"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/core/Button";
import styles from "@/styles/auth.module.css";

// UI de autenticação sem back-end ainda — entra o Auth.js/NextAuth (com
// papel Admin/Autor/Colaborador) numa etapa seguinte do projeto. Registro
// público fica pra "pedir acesso": quem aprova o papel é um admin depois.
export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

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

        <form className={styles.form} onSubmit={handleSubmit}>
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

          <Button type="submit" variant="primary" className={styles.submit}>
            Pedir acesso
          </Button>
        </form>

        <p className={styles.switch}>
          Já tem conta? <Link href="/login">Entrar</Link>
        </p>

        {submitted && (
          <p className={styles.devNote}>
            Registro ainda não está conectado — entra junto com o Auth.js na
            próxima etapa do projeto.
          </p>
        )}
      </div>
    </div>
  );
}
