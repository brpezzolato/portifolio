/* Páginas internas: a mesma coluna estreita da home. */
export default function PaginasLayout({ children }: LayoutProps<'/'>) {
  return <div className="mx-auto w-full max-w-2xl px-5 pt-32 pb-24">{children}</div>;
}
