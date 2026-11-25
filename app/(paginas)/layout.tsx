/* Páginas internas: a mesma coluna estreita da home. */
export default function PaginasLayout({ children }: LayoutProps<'/'>) {
  return <div className="mx-auto w-full max-w-3xl px-5 pt-36 pb-24">{children}</div>;
}
