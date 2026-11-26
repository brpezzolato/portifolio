'use client';

import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

/* Botão de apagar com confirmação em diálogo (nada é apagado sem confirmar). */
export function ConfirmDelete({
  id,
  what,
  action,
  label = 'Apagar',
  iconOnly = true,
}: {
  id: string;
  what: string;
  action: (form: FormData) => Promise<void>;
  label?: string;
  iconOnly?: boolean;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          iconOnly ? (
            <Button variant="ghost" size="icon" aria-label={`${label}: ${what}`} className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive" />
          ) : (
            <Button variant="destructive" size="pill" className="h-10 px-4" />
          )
        }
      >
        <Trash2 className="size-4" />
        {!iconOnly && label}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apagar “{what}”?</AlertDialogTitle>
          <AlertDialogDescription>Isso remove de vez e não dá para desfazer.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <form action={action}>
            <input type="hidden" name="id" value={id} />
            <Button type="submit" variant="destructive" className="w-full">
              Apagar
            </Button>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
