import { InspectionStatus } from '@/types/inspection';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusConfig: Record<InspectionStatus, { label: string; className: string }> = {
  pending: { label: 'Pendente', className: 'bg-warning/20 text-warning border-warning/30' },
  in_progress: { label: 'Em Progresso', className: 'bg-info/20 text-info border-info/30' },
  completed: { label: 'Concluída', className: 'bg-success/20 text-success border-success/30' },
};

export function StatusBadge({ status }: { status: InspectionStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn('font-heading text-xs uppercase tracking-wider', config.className)}>
      {config.label}
    </Badge>
  );
}
