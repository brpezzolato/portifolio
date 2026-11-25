'use client';

import { useActionState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { sendContact, type ContactState } from '@/app/actions/contact';
import { useLang } from '@/components/site/providers';
import { Reveal } from '@/components/site/reveal';
import { site, ui } from '@/lib/site';
import { cn } from 'cn';
import { wrap } from './shared';

/* Contato como uma frase para completar: os campos são lacunas sublinhadas
   no meio do texto ("Oi, Bruno! Meu nome é ___ …"). Os componentes são os
   do shadcn, só com a aparência trocada. */
const gap =
  'inline-flex h-auto min-w-0 rounded-none border-0 border-b-2 border-foreground/20 bg-transparent px-1 py-0 align-baseline text-[length:inherit] font-medium md:text-[length:inherit] tracking-[inherit] text-signal [--autofill-ink:var(--signal)] shadow-none transition-[border-color] placeholder:text-foreground/25 focus-visible:border-signal focus-visible:ring-0 dark:bg-transparent';

export function Contact() {
  const { t } = useLang();
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, { status: 'idle' });
  const msg = { ok: ui.formOk, invalid: ui.formInvalid, fail: ui.formFail }[state.status as 'ok' | 'invalid' | 'fail'];

  return (
    <section id="contato" className="scroll-mt-16 py-28 sm:py-40">
      <div className={wrap}>
        <Reveal>
          <h2 className="text-[clamp(3rem,9vw,8rem)] leading-[0.9] font-semibold tracking-[-0.06em]">{t(ui.contactTitle)}</h2>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">{t(ui.contactText)}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <form action={action} className="relative mt-16 border-t border-border pt-12">
            <div className="text-[clamp(1.6rem,3.6vw,3.2rem)] leading-[1.45] font-medium tracking-[-0.03em]">
              <span>{t(ui.madHi)} </span>
              <Label htmlFor="c-name" className="sr-only">{t(ui.formName)}</Label>
              <Input id="c-name" name="name" autoComplete="name" required minLength={2} maxLength={80} placeholder={t(ui.phName)} className={cn(gap, 'w-auto field-sizing-content min-w-[7ch] max-w-full')} />
              <span> {t(ui.madMid)} </span>
              <Label htmlFor="c-email" className="sr-only">{t(ui.formEmail)}</Label>
              <Input id="c-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder={t(ui.phEmail)} className={cn(gap, 'w-auto field-sizing-content min-w-[10ch] max-w-full')} />
              <span>. {t(ui.madEnd)}</span>
              <Label htmlFor="c-message" className="sr-only">{t(ui.formMessage)}</Label>
              <Textarea
                id="c-message"
                name="message"
                required
                minLength={10}
                maxLength={2000}
                rows={2}
                placeholder={t(ui.phMessage)}
                className={cn(gap, 'mt-2 block min-h-0 w-full resize-none leading-[1.35] field-sizing-content')}
              />
            </div>
            {/* armadilha anti-robô */}
            <div aria-hidden className="absolute -left-[9999px]">
              <Label htmlFor="c-website">Website</Label>
              <Input id="c-website" name="website" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-4">
                <Button type="submit" variant="glass" size="pill" disabled={pending} className="h-12 px-7 text-base">
                  {pending ? t(ui.formSending) : t(ui.formSend)}
                  <ArrowRight data-icon="inline-end" />
                </Button>
                {msg && (
                  <p role="status" className={state.status === 'ok' ? 'text-signal' : 'text-destructive'}>
                    {t(msg)}
                  </p>
                )}
              </div>
              <p className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span>{t(ui.orReach)}</span>
                <a href={`mailto:${site.email}`} className="text-foreground hover:text-signal">{site.email}</a>
                {site.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-foreground hover:text-signal">
                    {l.label} <ArrowUpRight className="size-3.5" />
                  </a>
                ))}
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
