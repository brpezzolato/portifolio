'use client';

import { useActionState } from 'react';
import { ArrowUpRight, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
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
    <section id="contato" className="scroll-mt-10 py-28 sm:py-40">
      <div className={`${wrap} text-center`}>
        <Reveal>
          <p className="text-sm text-muted-foreground">{t(ui.contactText)}</p>
          <h2 className="mt-6 text-[clamp(3rem,10vw,9.5rem)] leading-[0.9] font-semibold tracking-[-0.06em]">{t(ui.contactTitle)}</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <a
            href={`mailto:${site.email}`}
            className="group mt-10 inline-flex items-center gap-2 text-[clamp(1.2rem,2.4vw,2rem)] font-medium tracking-tight text-signal"
          >
            <span className="relative after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-500 group-hover:after:origin-left group-hover:after:scale-x-100">
              {site.email}
            </span>
            <ArrowUpRight className="size-6 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </a>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Sheet>
              <SheetTrigger render={<Button variant="glass" size="pill" />}>
                <PenLine data-icon="inline-start" /> {t(ui.writeMe)}
              </SheetTrigger>
              <SheetContent side="bottom" className="max-h-[90svh] overflow-y-auto rounded-t-[2rem] px-5 pt-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-8">
                <SheetTitle className="mx-auto w-full max-w-2xl text-2xl font-semibold tracking-tight">{t(ui.contactTitle)}</SheetTitle>
                <form action={action} className="relative mx-auto w-full max-w-2xl">
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
              </SheetContent>
            </Sheet>
            {site.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-1 rounded-full border border-border px-5 text-sm transition-colors hover:border-foreground/40"
              >
                {l.label} <ArrowUpRight className="size-3.5" />
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
