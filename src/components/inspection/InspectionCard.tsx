import { Inspection } from '@/types/inspection';
import { StatusBadge } from './StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar, User, Image, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function InspectionCard({ inspection, index }: { inspection: Inspection; index: number }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        className="cursor-pointer border-border/50 bg-card shadow-card hover:border-primary/40 hover:shadow-glow transition-all duration-300"
        onClick={() => navigate(`/inspection/${inspection.id}`)}
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-heading text-sm font-semibold text-foreground truncate mr-3">
              {inspection.location}
            </h3>
            <StatusBadge status={inspection.status} />
          </div>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {inspection.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {format(new Date(inspection.date), "dd MMM yyyy", { locale: ptBR })}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {inspection.responsible}
            </span>
            <span className="flex items-center gap-1">
              <Image className="w-3.5 h-3.5" />
              {inspection.images.length}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              {inspection.notes.length}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
