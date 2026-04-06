import { useInspectionStore } from '@/store/inspectionStore';
import { InspectionCard } from '@/components/inspection/InspectionCard';
import { CreateInspectionDialog } from '@/components/inspection/CreateInspectionDialog';
import { Bot, Search, ClipboardList } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { inspections, addInspection } = useInspectionStore();
  const [search, setSearch] = useState('');

  const filtered = inspections.filter(i =>
    i.location.toLowerCase().includes(search.toLowerCase()) ||
    i.responsible.toLowerCase().includes(search.toLowerCase()) ||
    i.description.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: inspections.length,
    pending: inspections.filter(i => i.status === 'pending').length,
    inProgress: inspections.filter(i => i.status === 'in_progress').length,
    completed: inspections.filter(i => i.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center animate-pulse-glow">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-base font-bold text-foreground tracking-tight">RoboInspect</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Ambientes Confinados</p>
            </div>
          </div>
          <CreateInspectionDialog onSubmit={addInspection} />
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total', value: stats.total, color: 'text-foreground' },
            { label: 'Pendentes', value: stats.pending, color: 'text-warning' },
            { label: 'Em Progresso', value: stats.inProgress, color: 'text-info' },
            { label: 'Concluídas', value: stats.completed, color: 'text-success' },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border/50 rounded-lg p-4 shadow-card">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-heading">{s.label}</p>
              <p className={`text-2xl font-heading font-bold ${s.color} mt-1`}>{s.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por local, responsável ou descrição..."
            className="pl-9 bg-card border-border h-10"
          />
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <ClipboardList className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-heading text-sm">
              {inspections.length === 0 ? 'Nenhuma inspeção cadastrada' : 'Nenhum resultado encontrado'}
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              {inspections.length === 0 && 'Clique em "Nova Inspeção" para começar'}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((inspection, i) => (
              <InspectionCard key={inspection.id} inspection={inspection} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
