'use client';

import { useActionState } from 'react';
import { ArrowRight, ArrowUpRight, AtSign, Code2, Mail, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { sendContact, type ContactState } from '@/app/actions/contact';
import { useLang } from '@/components/site/providers';
import { Reveal } from '@/components/site/reveal';
import { ui } from '@/lib/site';
import { useSite } from '@/components/site/site-data';
import { wrap } from './shared';

/* Contato em três partes alinhadas à mesma grade:
   - título grande na largura toda;
   - à esquerda, os canais (e-mail, GitHub, LinkedIn) em linhas;
   - à direita, o formulário num cartão, com rótulos sobre os campos.
   O preenchimento automático fica desligado de propósito: a prévia de
   sugestões do Chrome usa fonte e largura próprias que o CSS não alcança. */

const noAutofill = {
  autoComplete: 'off',
  autoCorrect: 'off',
  spellCheck: false,
  'data-1p-ignore': true,
  'data-lpignore': 'true',
  'data-form-type': 'other',
} as const;

const field = 'h-12 rounded-xl bg-background px-4 text-base md:text-base';

export function Contact() {
  const site = useSite();
  const { t } = useLang();
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, { status: 'idle' });
  const msg = { ok: ui.formOk, invalid: ui.formInvalid, fail: ui.formFail }[state.status as 'ok' | 'invalid' | 'fail'];

  const channels = [
    { icon: Mail, label: ui.formEmail, value: site.email, href: `mailto:${site.email}`, external: false },
    ...site.links.map((l) => ({
      icon: l.label === 'GitHub' ? Code2 : UserRound,
      label: { pt: l.label, en: l.label },
      value: l.href.replace(/^https?:\/\/(www\.)?/, ''),
      href: l.href,
      external: true,
    })),
  ];

  return (
    <section id="contato" className="scroll-mt-20 py-28 sm:py-36">
      <div className={wrap}>
        <Reveal>
          <p className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-1.5 rounded-full bg-signal" />
            {t(ui.nav.contato)}
          </p>
          <h2 className="text-[clamp(3rem,8vw,7rem)] leading-[0.9] font-semibold tracking-[-0.06em]">{t(ui.contactTitle)}</h2>
        </Reveal>

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* canais */}
          <Reveal className="lg:col-span-5">
            <p className="max-w-md text-lg text-pretty text-muted-foreground">{t(ui.contactText)}</p>
            <ul className="mt-10 border-t border-border">
              {channels.map((c) => {
                const Icon = c.icon;
                return (
                  <li key={c.href}>
                    <a
                      href={c.href}
                      {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="group flex items-center gap-4 border-b border-border py-5"
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-signal/10 text-signal">
                        <Icon className="size-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm text-muted-foreground">{t(c.label)}</span>
                        <span className="block truncate font-medium transition-colors group-hover:text-signal">{c.value}</span>
                      </span>
                      <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          {/* formulário */}
          <Reveal delay={0.08} className="lg:col-span-7">
            <form action={action} autoComplete="off" className="relative rounded-[2rem] border border-border bg-card p-6 sm:p-10">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="c-name">{t(ui.formName)}</Label>
                  <div className="relative">
                    <UserRound aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="c-name" name="c1" type="text" required minLength={2} maxLength={80} placeholder={t(ui.phName)} className={`${field} pl-11`} {...noAutofill} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-email">{t(ui.formEmail)}</Label>
                  <div className="relative">
                    <AtSign aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="c-email" name="c2" type="text" inputMode="email" autoCapitalize="none" required maxLength={254} placeholder={t(ui.phEmail)} className={`${field} pl-11`} {...noAutofill} />
                  </div>
                </div>
              </div>
              <div className="mt-5 space-y-2">
                <Label htmlFor="c-message">{t(ui.formMessage)}</Label>
                <Textarea
                  id="c-message"
                  name="c3"
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={6}
                  placeholder={t(ui.phMessage)}
                  className="min-h-40 resize-none rounded-xl bg-background px-4 py-3 text-base md:text-base"
                  {...noAutofill}
                />
              </div>
              {/* armadilha anti-robô */}
              <div aria-hidden className="absolute -left-[9999px]">
                <Label htmlFor="c-website">Website</Label>
                <Input id="c-website" name="website" tabIndex={-1} autoComplete="off" />
              </div>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p role="status" className={`text-sm ${state.status === 'ok' ? 'text-signal' : state.status === 'idle' ? 'text-muted-foreground' : 'text-destructive'}`}>
                  {msg ? t(msg) : t(ui.formHint)}
                </p>
                <Button type="submit" size="pill" disabled={pending} className="h-12 px-7 text-base sm:shrink-0">
                  {pending ? t(ui.formSending) : t(ui.formSend)}
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
