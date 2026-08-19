"use client";

type DeleteButtonProps = {
  action: () => Promise<void>;
};

export function DeleteButton({ action }: DeleteButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!confirm("Excluir essa matéria? Não dá pra desfazer.")) {
          event.preventDefault();
        }
      }}
    >
      <button type="submit" className="ez-btn ez-btn--secondary ez-btn--sm">
        Excluir
      </button>
    </form>
  );
}
