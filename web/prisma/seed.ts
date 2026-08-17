import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, Role, PostStatus, CommentStatus } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { categories, posts } from "../src/lib/posts";
import { authors } from "../src/lib/authors";
import { getCommentsBySlug } from "../src/lib/comments";

// Popula o banco com os mesmos dados fake que já estavam no site (ver
// src/lib/posts.ts, authors.ts, comments.ts), pra manter continuidade
// visual assim que as páginas passarem a ler do Postgres em vez do array
// em memória. Idempotente: pode rodar de novo sem duplicar nada.

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Senha de desenvolvimento única pros dois usuários seedados — só pra
// destravar o login de teste assim que o Auth.js entrar. Trocar em produção.
const SEED_PASSWORD = "estagiozero123";

const authorEmails: Record<string, string> = {
  "Bia Ferraz": "bia@estagiozero.com.br",
  "Rafael Dorí": "rafael@estagiozero.com.br",
};

const authorRoles: Record<string, Role> = {
  "Bia Ferraz": "AUTHOR",
  "Rafael Dorí": "ADMIN",
};

async function main() {
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

  // 1. Categorias
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: { slug: category.slug, name: category.name },
    });
  }
  console.log(`Categorias: ${categories.length}`);

  // 2. Usuários (a partir dos autores fake)
  const userIdByName: Record<string, string> = {};
  for (const author of Object.values(authors)) {
    const email = authorEmails[author.name];
    if (!email) continue;
    const user = await prisma.user.upsert({
      where: { email },
      update: { name: author.name, bio: author.bio, role: authorRoles[author.name] },
      create: {
        name: author.name,
        email,
        passwordHash,
        role: authorRoles[author.name] ?? "AUTHOR",
        bio: author.bio,
      },
    });
    userIdByName[author.name] = user.id;
  }
  console.log(`Usuários: ${Object.keys(userIdByName).length} (senha de dev: "${SEED_PASSWORD}")`);

  // 3. Tags (únicas, extraídas de todos os posts)
  const allTagNames = Array.from(new Set(posts.flatMap((p) => p.tags)));
  const tagIdByName: Record<string, string> = {};
  for (const tagName of allTagNames) {
    const slug = tagName.toLowerCase().replace(/\s+/g, "-");
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: { name: tagName },
      create: { slug, name: tagName },
    });
    tagIdByName[tagName] = tag.id;
  }
  console.log(`Tags: ${allTagNames.length}`);

  // 4. Posts (+ ligação com tags via PostTag) e comentários
  let commentCount = 0;
  for (const post of posts) {
    const authorId = userIdByName[post.author];
    if (!authorId) {
      console.warn(`Pulando post "${post.slug}": autor "${post.author}" sem usuário seedado.`);
      continue;
    }

    const category = categories.find((c) => c.slug === post.category.slug);
    if (!category) continue;

    const dbCategory = await prisma.category.findUniqueOrThrow({
      where: { slug: category.slug },
    });

    const savedPost = await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        body: post.body.join("\n\n"),
        imageUrl: post.imageUrl ?? null,
        badge: post.badge ?? null,
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(post.date),
        authorId,
        categoryId: dbCategory.id,
      },
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        body: post.body.join("\n\n"),
        imageUrl: post.imageUrl ?? null,
        badge: post.badge ?? null,
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(post.date),
        authorId,
        categoryId: dbCategory.id,
      },
    });

    // Reseta as ligações de tag pra refletir exatamente o array atual
    await prisma.postTag.deleteMany({ where: { postId: savedPost.id } });
    for (const tagName of post.tags) {
      const tagId = tagIdByName[tagName];
      if (!tagId) continue;
      await prisma.postTag.create({ data: { postId: savedPost.id, tagId } });
    }

    // Comentários fake desse post (todos entram como aprovados — já
    // estavam publicamente visíveis no protótipo estático)
    const comments = getCommentsBySlug(post.slug);
    for (const comment of comments) {
      const existing = await prisma.comment.findFirst({
        where: { postId: savedPost.id, authorName: comment.author, body: comment.body },
      });
      if (existing) continue;
      await prisma.comment.create({
        data: {
          postId: savedPost.id,
          authorName: comment.author,
          body: comment.body,
          status: CommentStatus.APPROVED,
          createdAt: new Date(comment.date),
        },
      });
      commentCount++;
    }
  }
  console.log(`Posts: ${posts.length}`);
  console.log(`Comentários novos: ${commentCount}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
