'use client';

import { startTransition, useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type State = { ok?: string; error?: string } | null;

/* Envio dos formulários do painel sem o "reset" automático do React 19
   (que voltava os campos para os valores antigos depois de salvar).
   - mantém na tela o que foi digitado, inclusive quando dá erro;
   - marca "alterações não salvas" ao mexer em qualquer campo;
   - depois de salvar, atualiza os dados da página e guarda a hora. */
export function useSave(fn: (prev: State, form: FormData) => Promise<State>) {
  const router = useRouter();
  const [state, action, pending] = useActionState<State, FormData>(fn, null);
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    if (state?.ok) {
      setDirty(false);
      setSavedAt(new Date());
      router.refresh();
    }
  }, [state, router]);

  const touch = () => setDirty(true);
  const form = {
    onSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      startTransition(() => action(data));
    },
    onInput: touch,
    onChange: touch,
    onClick(e: React.MouseEvent) {
      // interruptores e listas de opção não disparam "input"
      if ((e.target as HTMLElement).closest('[role=switch],[role=combobox],[role=option]')) touch();
    },
  };

  return { state, pending, dirty, savedAt, form, touch };
}
