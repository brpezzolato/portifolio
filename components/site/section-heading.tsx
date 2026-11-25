import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function SectionHeading({
  index,
  title,
  href,
  linkLabel,
}: {
  index: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="flex items-baseline gap-3 text-lg font-medium tracking-tight">
        <span className="font-mono text-xs text-muted-foreground">{index}</span>
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {linkLabel}
          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      )}
    </div>
  );
}
