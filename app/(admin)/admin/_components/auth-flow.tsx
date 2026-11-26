'use client';

import { useActionState, useState } from 'react';
import { KeyRound, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn, startEnroll, verifyCode } from '../_actions/auth';

/* Tela de entrada em duas colunas: marca à esquerda (some no celular) e o
   passo atual (senha, cadastro do autenticador ou código) à direita. */
function Shell({ icon: Icon, title, text, children }: { icon: typeof KeyRound; title: string; text: string; children: React.ReactNode }) {
  const steps = ['Senha', 'Autenticador', 'Painel'];
  const current = Icon === KeyRound ? 0 : 1;
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-foreground p-12 text-background lg:flex lg:flex-col lg:justify-between">
        <span aria-hidden className="absolute -bottom-40 -left-40 size-[32rem] rounded-full bg-signal/40 blur-[120px]" />
        <span aria-hidden className="absolute top-1/3 right-[-6rem] size-72 rounded-full bg-background/10 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-background text-sm font-semibold text-foreground">BP</span>
          <span className="text-sm text-background/70">Painel do portfólio</span>
        </div>
        <div className="relative">
          <p className="max-w-md text-[clamp(2.2rem,3.5vw,3.25rem)] leading-[0.95] font-semibold tracking-[-0.05em]">
            Área restrita<span className="text-signal">.</span>
          </p>
          <p className="mt-5 max-w-sm text-background/60">Entrada com senha e código do app autenticador. Tentativas limitadas e sessão só neste site.</p>
        </div>
        <p className="relative text-xs text-background/40">Bruno Pezzolato</p>
      </div>

      <div className="flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-sm">
          <ol className="mb-10 flex items-center gap-2 text-xs">
            {steps.map((s, i) => (
              <li key={s} className="flex items-center gap-2">
                <span
                  className={`grid size-6 place-items-center rounded-full font-medium ${
                    i < current ? 'bg-signal text-white' : i === current ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {i + 1}
                </span>
                <span className={i === current ? 'text-foreground' : 'text-muted-foreground'}>{s}</span>
                {i < steps.length - 1 && <span className="h-px w-5 bg-border" />}
              </li>
            ))}
          </ol>
          <span className="grid size-12 place-items-center rounded-2xl bg-signal/10 text-signal">
            <Icon className="size-5" />
          </span>
          <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em]">{title}</h1>
          <p className="mt-2 text-sm text-pretty text-muted-foreground">{text}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Error({ msg }: { msg: string | null }) {
  return msg ? (
    <p role="alert" className="text-sm text-destructive">
      {msg}
    </p>
  ) : null;
}

export function LoginForm() {
  const [error, action, pending] = useActionState(signIn, null);
  return (
    <Shell icon={KeyRound} title="Entrar" text="Área restrita. Senha e código do autenticador.">
      <form action={action} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="a-email">E-mail</Label>
          <Input id="a-email" name="email" type="email" autoComplete="username" required className="h-11 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="a-pass">Senha</Label>
          <Input id="a-pass" name="password" type="password" autoComplete="current-password" minLength={12} required className="h-11 rounded-xl" />
        </div>
        <Error msg={error} />
        <Button type="submit" size="pill" className="h-11 w-full" disabled={pending}>
          {pending ? 'Entrando…' : 'Continuar'}
        </Button>
      </form>
    </Shell>
  );
}

function CodeForm({ factorId }: { factorId: string }) {
  const [error, action, pending] = useActionState(verifyCode, null);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="factorId" value={factorId} />
      <div className="space-y-2">
        <Label htmlFor="a-code">Código de 6 dígitos</Label>
        <Input
          id="a-code"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{6}"
          maxLength={6}
          required
          autoFocus
          className="h-12 text-center font-mono text-2xl tracking-[0.5em]"
        />
      </div>
      <Error msg={error} />
      <Button type="submit" size="pill" className="h-11 w-full" disabled={pending}>
        {pending ? 'Verificando…' : 'Verificar'}
      </Button>
    </form>
  );
}

export function VerifyForm({ factorId }: { factorId: string }) {
  return (
    <Shell icon={ShieldCheck} title="Código do autenticador" text="Abra o app autenticador e digite o código atual.">
      <CodeForm factorId={factorId} />
    </Shell>
  );
}

export function EnrollForm() {
  const [data, setData] = useState<{ factorId: string; qr: string; secret: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  return (
    <Shell
      icon={ShieldCheck}
      title="Ative a verificação em duas etapas"
      text="Obrigatória para entrar no painel. Use Google Authenticator, 1Password, Authy ou parecido."
    >
      {!data ? (
        <div className="space-y-4">
          <Error msg={error} />
          <Button
            size="pill"
            className="h-11 w-full"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              const r = await startEnroll();
              setLoading(false);
              if ('error' in r) setError(r.error);
              else setData(r);
            }}
          >
            {loading ? 'Gerando…' : 'Gerar QR code'}
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.qr} alt="QR code para o app autenticador" className="mx-auto size-48 rounded-xl bg-white p-2" />
          <p className="text-center text-xs text-muted-foreground">
            Ou digite a chave: <code className="font-mono break-all text-foreground">{data.secret}</code>
          </p>
          <CodeForm factorId={data.factorId} />
        </div>
      )}
    </Shell>
  );
}
