"use client";

import { useState, type FormEvent } from "react";
import type { Comment } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/core/Button";
import styles from "./CommentSection.module.css";

type CommentSectionProps = {
  initialComments: Comment[];
};

/** Static-data demo of the anonymous-comment flow described in the
 * pre-engenharia doc: nome obrigatório + email opcional + honeypot, e o
 * comentário novo entra "pendente" até moderação. Nada é enviado a um
 * servidor ainda — é só a UI, pronta pra plugar no back-end depois. */
export function CommentSection({ initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [justSubmitted, setJustSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    // honeypot: campo escondido que só bot preenche — se vier preenchido,
    // descartamos silenciosamente (sem avisar o remetente que é bot).
    if (form.get("website")) {
      setName("");
      setBody("");
      return;
    }

    if (!name.trim() || !body.trim()) return;

    const newComment: Comment = {
      id: `local-${Date.now()}`,
      author: name.trim(),
      date: new Date().toISOString(),
      body: body.trim(),
    };

    setComments((prev) => [newComment, ...prev]);
    setName("");
    setBody("");
    setJustSubmitted(true);
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
              className="ez-input"
              type="email"
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
            className="ez-textarea"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Fala com a gente"
            required
          />
        </div>

        <div>
          <Button type="submit" variant="primary" size="sm">
            Publicar comentário
          </Button>
          <p className={styles.notice}>
            {justSubmitted
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
                {comment.id.startsWith("local-") && (
                  <span className={styles.pendingBadge}>Pendente</span>
                )}
              </div>
              <p className={styles.commentBody}>{comment.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
