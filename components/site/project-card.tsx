import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Spotlight } from './spotlight';
import { projectStatusLabel } from '@/lib/format';
import type { Project } from '@/lib/types';
import { cn } from 'cn';

export function ProjectCard({
  project,
  large = false,
}: {
  project: Project;
  large?: boolean;
}) {
  const live = project.status !== 'arquivado';
  return (
    <Spotlight className={cn('h-full rounded-2xl', large && 'sm:col-span-2')}>
      <Link
        href={`/projetos/${project.slug}`}
        className="group block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Card className={cn('h-full justify-between', large ? 'min-h-72' : 'min-h-56')}>
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={live ? 'signal' : 'mono'}>
                {live && <span className="signal-dot size-1.5!" />}
                {projectStatusLabel[project.status]}
              </Badge>
              <span className="font-mono text-xs text-muted-foreground">
                {project.year}
              </span>
            </div>
            <ArrowUpRight className="size-4 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <h3
              className={cn(
                'font-medium tracking-tight',
                large ? 'text-3xl sm:text-4xl' : 'text-xl',
              )}
            >
              {project.title}
            </h3>
            <p className="max-w-prose text-pretty text-muted-foreground">
              {project.summary}
            </p>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-1.5 border-t border-foreground/6 bg-transparent py-3">
            {project.stack.map((s) => (
              <Badge key={s} variant="mono">
                {s}
              </Badge>
            ))}
          </CardFooter>
        </Card>
      </Link>
    </Spotlight>
  );
}
