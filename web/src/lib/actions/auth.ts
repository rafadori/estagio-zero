"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";

export type AuthFormState = { error?: string; ok?: boolean } | undefined;

// redirect: false de propósito nos dois signIn() abaixo: o Header lê a
// sessão no client (useSession, ver AuthStatus.tsx) pra não forçar
// renderização dinâmica no site inteiro. Um redirect "soft" do lado do
// servidor não faz o SessionProvider já montado buscar a sessão nova, então
// devolvemos { ok: true } e é o client (login/registro page) quem navega —
// com um reload de verdade, garantindo que a sessão apareça no Header.

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    return { ok: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email ou senha incorretos." };
        default:
          return { error: "Não foi possível entrar. Tenta de novo." };
      }
    }
    throw error;
  }
}

export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name) return { error: "Nome é obrigatório." };
  if (!email) return { error: "Email é obrigatório." };
  if (password.length < 8) {
    return { error: "Senha precisa de pelo menos 8 caracteres." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "Já existe uma conta com esse email." };

  const passwordHash = await bcrypt.hash(password, 10);
  // Registro público entra como Colaborador(a) — um Admin/Autor(a) promove
  // o papel depois, conforme descrito na própria página.
  await prisma.user.create({
    data: { name, email, passwordHash, role: "CONTRIBUTOR" },
  });

  try {
    await signIn("credentials", { email, password, redirect: false });
    return { ok: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: "Conta criada! Algo deu errado no login automático — tenta entrar manualmente.",
      };
    }
    throw error;
  }
}
