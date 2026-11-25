import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { PostKind, ProjectStatus } from './types';

export const formatDate = (iso: string) =>
  format(new Date(iso), "d 'de' MMM yyyy", { locale: ptBR });

export const formatShortDate = (iso: string) =>
  format(new Date(iso), 'dd.MM.yy', { locale: ptBR });

export const postKindLabel: Record<PostKind, string> = {
  lancamento: 'Lançamento',
  atualizacao: 'Atualização',
  nota: 'Nota',
};

export const projectStatusLabel: Record<ProjectStatus, string> = {
  'em-producao': 'No ar',
  'em-construcao': 'Construindo',
  arquivado: 'Arquivado',
};
