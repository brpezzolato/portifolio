'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Download, FileText, Trash2, UploadCloud, X } from 'lucide-react';
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
import { cn } from 'cn';
import { removeCv, uploadCv, type CvState } from '../_actions/cv';
import { Status } from './fields';

const MAX = 4 * 1024 * 1024;
const size = (n: number) => (n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`);

/* Envio do currículo: área de arrastar e soltar, conferência do arquivo antes
   de enviar e cartão do arquivo atual com baixar e remover. */
export function CvUploader({ current }: { current: { updated: string; size: number | null } | null }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [local, setLocal] = useState<string | null>(null);
  const [state, action, pending] = useActionState<CvState, FormData>(uploadCv, null);
  const [rmState, rmAction, removing] = useActionState<CvState, FormData>(async () => removeCv(), null);

  useEffect(() => {
    if (state?.ok || rmState?.ok) {
      setFile(null);
      if (input.current) input.current.value = '';
      router.refresh();
    }
  }, [state, rmState, router]);

  const pick = (f: File | undefined) => {
    setLocal(null);
    if (!f) return;
    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) return setLocal('O arquivo precisa ser um PDF.');
    if (f.size > MAX) return setLocal('O PDF pode ter no máximo 4 MB.');
    setFile(f);
    // coloca o arquivo no campo do formulário (também quando veio arrastado)
    if (input.current) {
      const dt = new DataTransfer();
      dt.items.add(f);
      input.current.files = dt.files;
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <form action={action} className="space-y-4">
        <label
          htmlFor="cv-file"
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            pick(e.dataTransfer.files?.[0]);
          }}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-14 text-center transition-colors',
            drag ? 'border-signal bg-signal/5' : 'border-border bg-card hover:border-foreground/25',
          )}
        >
          <span className={cn('grid size-14 place-items-center rounded-2xl transition-colors', drag ? 'bg-signal text-white' : 'bg-muted text-muted-foreground')}>
            <UploadCloud className="size-6" />
          </span>
          <p className="mt-5 font-medium">{current ? 'Trocar o currículo' : 'Enviar o currículo'}</p>
          <p className="mt-1 text-sm text-muted-foreground">Arraste o PDF para cá ou clique para escolher · até 4 MB</p>
          <input
            ref={input}
            id="cv-file"
            name="file"
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            onChange={(e) => pick(e.target.files?.[0])}
          />
        </label>

        {file && (
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-signal/10 text-signal">
              <FileText className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{file.name}</span>
              <span className="block text-xs text-muted-foreground">{size(file.size)} · pronto para enviar</span>
            </span>
            <button
              type="button"
              aria-label="Tirar arquivo"
              onClick={() => {
                setFile(null);
                if (input.current) input.current.value = '';
              }}
              className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
            <Button type="submit" size="pill" className="h-10" disabled={pending}>
              {pending ? 'Enviando…' : 'Enviar'}
            </Button>
          </div>
        )}

        {local ? <p className="text-sm text-destructive">{local}</p> : <Status state={state} />}
      </form>

      <aside className="rounded-3xl border border-border bg-card p-5 lg:self-start">
        <p className="font-semibold tracking-tight">No site agora</p>
        {current ? (
          <>
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-muted/60 p-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-background text-signal">
                <FileText className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">Bruno-Pezzolato-Curriculo.pdf</span>
                <span className="block text-xs text-muted-foreground">
                  {current.size ? `${size(current.size)} · ` : ''}
                  {new Date(current.updated).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <a href="/curriculo" className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-border text-sm hover:bg-muted">
                <Download className="size-4" /> Baixar
              </a>
              <a href="/#curriculo" target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-border text-sm hover:bg-muted">
                Ver <ArrowUpRight className="size-4" />
              </a>
            </div>
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="ghost" className="mt-2 h-10 w-full rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive" />}>
                <Trash2 className="size-4" /> Remover do site
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remover o currículo?</AlertDialogTitle>
                  <AlertDialogDescription>A seção e o botão de download somem do site até você enviar outro.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <form action={rmAction}>
                    <Button type="submit" variant="destructive" className="w-full" disabled={removing}>
                      {removing ? 'Removendo…' : 'Remover'}
                    </Button>
                  </form>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <div className="mt-2 text-center">
              <Status state={rmState} />
            </div>
          </>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">Nenhum currículo enviado. A seção de currículo fica escondida no site até você enviar o PDF.</p>
        )}
      </aside>
    </div>
  );
}
