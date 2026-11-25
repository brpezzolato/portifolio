import { cn } from 'cn';

/* Link com sublinhado que desliza da esquerda no hover. */
export function NiceLink({ className, children, ...props }: React.ComponentProps<'a'>) {
  return (
    <a
      {...props}
      className={cn(
        'relative inline-block after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-500 after:ease-[cubic-bezier(.22,.9,.28,1)] hover:after:origin-left hover:after:scale-x-100',
        className,
      )}
    >
      {children}
    </a>
  );
}
