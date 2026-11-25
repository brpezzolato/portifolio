import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/* Markdown do banco renderizado sem HTML cru (react-markdown ignora tags por
   padrão: nada de XSS vindo do conteúdo) e links externos isolados. */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="space-y-4 leading-relaxed text-foreground/85 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-medium [&_h2]:tracking-tight [&_h2]:text-foreground [&_li]:my-1 [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:marker:text-muted-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
            >
              {children}
            </a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
