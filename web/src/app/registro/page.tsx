"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/core/Button";
import { registerAction } from "@/lib/actions/auth";
import styles from "@/styles/auth.module.css";

// Registro público entra como Colaborador(a) — um Admin/Autor(a) promove o
// papel depois (aprovação manual, ver painel do autor numa etapa seguinte).
export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, undefined);

  useEffect(() => {
    // Reload de verdade (não router.push) — garante que o SessionProvider
    // remonte e leia o cookie de sessão novo. Ver nota em actions/auth.ts.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    if (state?.ok) window.location.href = "/";
  }, [state]);

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.head}>
          <h1 className={styles.title}>Pedir acesso</h1>
          <p className={styles.subtitle}>
            Quer escrever pro Estágio Zero? Manda seus dados, um editor
            aprova seu papel de colaborador.
          </p>
        </div>

        <form className={styles.form} action={formAction}>
          <div className="ez-field">
            <label className="ez-field__label" htmlFor="name">
              Nome
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="ez-input"
              placeholder="Seu nome"
              required
            />
          </div>

          <div className="ez-field">
            <label className="ez-field__label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="ez-input"
              placeholder="voce@estagiozero.com.br"
              required
            />
          </div>

          <div className="ez-field">
            <label className="ez-field__label" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="ez-input"
              placeholder="mínimo 8 caracteres"
              minLength={8}
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className={styles.submit}
            disabled={isPending}
          >
            {isPending ? "Enviando..." : "Pedir acesso"}
          </Button>

          {state?.error && <p className={styles.error}>{state.error}</p>}
        </form>

        <p className={styles.switch}>
          Já tem conta? <Link href="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
