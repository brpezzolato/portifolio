/* Páginas internas: coluna centralizada abaixo do cabeçalho fixo. */
export default function PaginasLayout({ children }: LayoutProps<'/'>) {
  return <div className="mx-auto w-full max-w-5xl px-5 pt-32 pb-24 sm:px-8">{children}</div>;
}
