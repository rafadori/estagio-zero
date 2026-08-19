import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { getPostsForUser } from "@/lib/admin-data";
import { formatDate, statusLabel } from "@/lib/format";
import { approvePost, rejectPost, unpublishPost, deletePost } from "@/lib/actions/posts";
import { DeleteButton } from "@/components/painel/DeleteButton";
import type { Role } from "@/generated/prisma/client";
import styles from "./painel.module.css";

export const metadata: Metadata = { title: "Painel — Estágio Zero" };

const STATUS_CLASS: Record<string, string> = {
  DRAFT: "statusDraft",
  PENDING_REVIEW: "statusReview",
  PUBLISHED: "statusPublished",
};

export default async function PainelPage() {
  const session = await auth();
  // A layout já redireciona se não tiver sessão — isso aqui é só pro
  // TypeScript saber que session.user existe a partir daqui.
  if (!session?.user) return null;

  const canReview = session.user.role !== "CONTRIBUTOR";
  const posts = await getPostsForUser(session.user.id, session.user.role as Role);

  if (posts.length === 0) {
    return (
      <p className={styles.empty}>
        Nenhuma matéria ainda.{" "}
        <Link href="/painel/nova">Cria a primeira</Link>.
      </p>
    );
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Título</th>
            <th>Categoria</th>
            <th>Autor(a)</th>
            <th>Status</th>
            <th>Atualizado</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => {
            const isOwner = post.authorId === session.user.id;
            return (
              <tr key={post.id}>
                <td className={styles.titleCell}>
                  <Link href={`/painel/${post.id}/editar`}>{post.title}</Link>
                </td>
                <td>{post.categoryName}</td>
                <td>{post.authorName}</td>
                <td>
                  <span className={`${styles.status} ${styles[STATUS_CLASS[post.status]]}`}>
                    {statusLabel(post.status)}
                  </span>
                </td>
                <td>{formatDate(post.updatedAt)}</td>
                <td>
                  <div className={styles.actions}>
                    <Link
                      href={`/painel/${post.id}/editar`}
                      className="ez-btn ez-btn--secondary ez-btn--sm"
                    >
                      Editar
                    </Link>

                    {post.status === "PENDING_REVIEW" && canReview && (
                      <>
                        <form action={approvePost.bind(null, post.id)}>
                          <button type="submit" className="ez-btn ez-btn--primary ez-btn--sm">
                            Aprovar
                          </button>
                        </form>
                        <form action={rejectPost.bind(null, post.id)}>
                          <button type="submit" className="ez-btn ez-btn--secondary ez-btn--sm">
                            Rejeitar
                          </button>
                        </form>
                      </>
                    )}

                    {post.status === "PUBLISHED" && canReview && (
                      <form action={unpublishPost.bind(null, post.id)}>
                        <button type="submit" className="ez-btn ez-btn--secondary ez-btn--sm">
                          Despublicar
                        </button>
                      </form>
                    )}

                    {(canReview || isOwner) && (
                      <DeleteButton action={deletePost.bind(null, post.id)} />
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
