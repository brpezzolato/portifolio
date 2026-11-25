import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from 'cn';

export default function NotFound() {
  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center px-5 pt-24 text-center">
      <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Erro 404</p>
      <h1 className="text-sheen mt-3 text-6xl font-semibold tracking-tighter">Nada por aqui.</h1>
      <p className="mt-4 text-muted-foreground">Essa página não existe (ou ainda não foi publicada).</p>
      <Link href="/" className={cn(buttonVariants({ variant: 'glass-quiet', size: 'pill' }), 'mt-8')}>
        Voltar ao início
      </Link>
    </div>
  );
}
