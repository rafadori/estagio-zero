"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Comment } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/core/Button";
import { submitComment } from "@/lib/actions/comments";
import styles from "./CommentSection.module.css";

type CommentSectionProps = {
  postSlug: string;
  initialComments: Comment[];
};

/** Fluxo de comentário anônimo descrito no doc de pré-engenharia: nome
 * obrigatório + email opcional, honeypot, checagem de tempo de envio — e o
 * comentário novo entra "pendente" até um editor aprovar. A Server Action
 * (src/lib/actions/comments.ts) grava de verdade no Postgres. */
export function CommentSection({ postSlug, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  // Date.now() é impuro — não pode rodar durante o render. Guardamos 0
  // até o efeito de montagem preencher o valor real.
  const formOpenedAt = useRef(0);
  useEffect(() => {
    formOpenedAt.current = Date.now();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError(null);

    const form = new FormData(event.currentTarget);
    form.set("renderedAt", String(formOpenedAt.current));

    const result = await submitComment(postSlug, form);

    if (!result.ok) {
      setStatus("error");
      setError(result.error);
      return;
    }

    if (result.comment) {
      setComments((prev) => [result.comment as Comment, ...prev]);
    }

    setName("");
    setEmail("");
    setBody("");
    setStatus("sent");
  }

  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>Comentários ({comments.length})</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Honeypot — escondido via CSS, humano nunca vê nem preenche */}
        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor="website">Deixe em branco</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className={styles.formRow}>
          <div className="ez-field">
            <label className="ez-field__label" htmlFor="comment-name">
              Nome *
            </label>
            <input
              id="comment-name"
              name="name"
              className="ez-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Como podemos te chamar?"
              required
            />
          </div>
          <div className="ez-field">
            <label className="ez-field__label" htmlFor="comment-email">
              Email (opcional)
            </label>
            <input
              id="comment-email"
              name="email"
              className="ez-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="só se quiser resposta por email"
            />
          </div>
        </div>

        <div className="ez-field">
          <label className="ez-field__label" htmlFor="comment-body">
            Comentário *
          </label>
          <textarea
            id="comment-body"
            name="body"
            className="ez-textarea"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Fala com a gente"
            required
          />
        </div>

        <div>
          <Button type="submit" variant="primary" size="sm" disabled={status === "sending"}>
            {status === "sending" ? "Enviando..." : "Publicar comentário"}
          </Button>
          <p className={styles.notice}>
            {status === "error"
              ? error
              : status === "sent"
                ? "Recebemos! Seu comentário fica pendente até um editor aprovar."
                : "Não precisa criar conta. Comentários passam por moderação antes de aparecer pra todo mundo."}
          </p>
        </div>
      </form>

      {comments.length === 0 ? (
        <p className={styles.empty}>Ninguém comentou ainda — seja o primeiro.</p>
      ) : (
        <ul className={styles.list}>
          {comments.map((comment) => (
            <li key={comment.id} className={styles.comment}>
              <div className={styles.commentHead}>
                <span className={styles.commentAuthor}>{comment.author}</span>
                <span className={styles.commentDate}>{formatDate(comment.date)}</span>
                {comment.pending && <span className={styles.pendingBadge}>Pendente</span>}
              </div>
              <p className={styles.commentBody}>{comment.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
