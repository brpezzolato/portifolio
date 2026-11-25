'use client';

import { useActionState } from 'react';
import { ArrowUpRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { sendContact, type ContactState } from '@/app/actions/contact';
import { useLang } from '@/components/site/providers';
import { Reveal } from '@/components/site/reveal';
import { site, ui } from '@/lib/site';
import { wrap } from './shared';

export function Contact() {
  const { t } = useLang();
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, { status: 'idle' });
  const msg = { ok: ui.formOk, invalid: ui.formInvalid, fail: ui.formFail }[state.status as 'ok' | 'invalid' | 'fail'];

  return (
    <section id="contato" className="scroll-mt-24 py-20 sm:py-28">
      <div className={`${wrap} grid gap-12 lg:grid-cols-12`}>
        <Reveal className="lg:col-span-5">
          <h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">{t(ui.contactTitle)}</h2>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">{t(ui.contactText)}</p>
          <a href={`mailto:${site.email}`} className="group mt-10 flex items-center gap-4">
            <span className="grid size-12 place-items-center rounded-2xl bg-signal/10 text-signal">
              <Mail className="size-5" />
            </span>
            <span className="text-lg font-medium group-hover:text-signal">{site.email}</span>
          </a>
          <ul className="mt-6 flex gap-3">
            {site.links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-foreground/30"
                >
                  {l.label} <ArrowUpRight className="size-3.5" />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-7">
          <form action={action} className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="c-name">{t(ui.formName)}</Label>
                <Input id="c-name" name="name" autoComplete="name" required minLength={2} maxLength={80} className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-email">{t(ui.formEmail)}</Label>
                <Input id="c-email" name="email" type="email" autoComplete="email" required maxLength={254} className="h-11" />
              </div>
            </div>
            <div className="mt-5 space-y-2">
              <Label htmlFor="c-message">{t(ui.formMessage)}</Label>
              <Textarea id="c-message" name="message" required minLength={10} maxLength={2000} rows={6} />
            </div>
            {/* armadilha anti-robô: fora da tela e fora do teclado */}
            <div aria-hidden className="absolute -left-[9999px]">
              <Label htmlFor="c-website">Website</Label>
              <Input id="c-website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button type="submit" variant="glass" size="pill" disabled={pending}>
                {pending ? t(ui.formSending) : t(ui.formSend)}
              </Button>
              {msg && (
                <p role="status" className={state.status === 'ok' ? 'text-sm text-signal' : 'text-sm text-destructive'}>
                  {t(msg)}
                </p>
              )}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
