"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/core/Button";
import { loginAction } from "@/lib/actions/auth";
import styles from "@/styles/auth.module.css";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);

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
          <h1 className={styles.title}>Entrar</h1>
          <p className={styles.subtitle}>
            Acesso pra quem escreve no Estágio Zero.
          </p>
        </div>

        <form className={styles.form} action={formAction}>
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
              placeholder="••••••••"
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className={styles.submit}
            disabled={isPending}
          >
            {isPending ? "Entrando..." : "Entrar"}
          </Button>

          {state?.error && <p className={styles.error}>{state.error}</p>}
        </form>

        <p className={styles.switch}>
          Ainda não tem conta? <Link href="/registro">Peça acesso</Link>
        </p>
      </div>
    </div>
  );
}
