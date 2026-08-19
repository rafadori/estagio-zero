"use client";

import { useActionState } from "react";
import { Button } from "@/components/core/Button";
import type { PostFormState } from "@/lib/actions/posts";
import styles from "./PostForm.module.css";

type PostFormProps = {
  action: (state: PostFormState, formData: FormData) => Promise<PostFormState>;
  categories: { id: string; name: string }[];
  role: string;
  initial?: {
    id: string;
    title: string;
    excerpt: string;
    body: string;
    categoryId: string;
    tags: string;
    badge: string;
    featured: boolean;
    status: string;
  };
};

export function PostForm({ action, categories, role, initial }: PostFormProps) {
  const [state, formAction, isPending] = useActionState(action, undefined);
  const isContributor = role === "CONTRIBUTOR";

  const publishLabel = isContributor
    ? "Enviar para revisão"
    : initial?.status === "PUBLISHED"
      ? "Salvar"
      : "Publicar";

  return (
    <form className={styles.form} action={formAction}>
      {initial && <input type="hidden" name="id" value={initial.id} />}

      <div className="ez-field">
        <label className="ez-field__label" htmlFor="title">
          Título
        </label>
        <input
          id="title"
          name="title"
          className="ez-input"
          type="text"
          defaultValue={initial?.title}
          placeholder="Ex: Novo Polo Track: o Volks mais barato ficou bom?"
          required
        />
      </div>

      <div className="ez-field">
        <label className="ez-field__label" htmlFor="excerpt">
          Resumo
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          className="ez-textarea"
          defaultValue={initial?.excerpt}
          placeholder="Uma ou duas frases — aparece no card e no resultado de busca."
          rows={2}
          required
        />
      </div>

      <div className={styles.row}>
        <div className="ez-field">
          <label className="ez-field__label" htmlFor="categoryId">
            Categoria
          </label>
          <select
            id="categoryId"
            name="categoryId"
            className="ez-input"
            defaultValue={initial?.categoryId ?? ""}
            required
          >
            <option value="" disabled>
              Escolhe uma categoria
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="ez-field">
          <label className="ez-field__label" htmlFor="badge">
            Marcador (opcional)
          </label>
          <input
            id="badge"
            name="badge"
            className="ez-input"
            type="text"
            defaultValue={initial?.badge}
            placeholder="Ex: NOVO, VÍDEO"
          />
        </div>
      </div>

      <div className="ez-field">
        <label className="ez-field__label" htmlFor="tags">
          Tags
        </label>
        <input
          id="tags"
          name="tags"
          className="ez-input"
          type="text"
          defaultValue={initial?.tags}
          placeholder="separadas por vírgula — ex: volkswagen, polo track, hatch"
        />
      </div>

      <div className="ez-field">
        <label className="ez-field__label" htmlFor="body">
          Corpo da matéria
        </label>
        <textarea
          id="body"
          name="body"
          className="ez-textarea"
          defaultValue={initial?.body}
          placeholder="Um parágrafo por linha em branco."
          rows={14}
          required
        />
        <p className="ez-field__hint">
          Separa os parágrafos com uma linha em branco entre eles.
        </p>
      </div>

      {!isContributor && (
        <label className={styles.checkboxField}>
          <input
            type="checkbox"
            name="featured"
            defaultChecked={initial?.featured}
          />
          Destacar na home
        </label>
      )}

      <div className={styles.actions}>
        <Button
          type="submit"
          name="intent"
          value="draft"
          variant="secondary"
          disabled={isPending}
        >
          Salvar rascunho
        </Button>
        <Button
          type="submit"
          name="intent"
          value="publish"
          variant="primary"
          disabled={isPending}
        >
          {isPending ? "Salvando..." : publishLabel}
        </Button>
        {state?.error && <span className={styles.error}>{state.error}</span>}
      </div>
    </form>
  );
}
