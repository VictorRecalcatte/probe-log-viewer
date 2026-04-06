import { useParams, useNavigate } from 'react-router-dom';
import { useInspectionStore } from '@/store/inspectionStore';
import { StatusBadge } from '@/components/inspection/StatusBadge';
import { ImageUploader } from '@/components/inspection/ImageUploader';
import { FaultMap } from '@/components/inspection/FaultMap';
import { TechnicalNotes } from '@/components/inspection/TechnicalNotes';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Bot, FileDown, Trash2, Calendar, User, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { generateReport } from '@/utils/generateReport';
import { InspectionStatus, InspectionImage, FaultLocation, TechnicalNote } from '@/types/inspection';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function InspectionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInspection, updateInspection, deleteInspection } = useInspectionStore();

  const inspection = getInspection(id!);

  if (!inspection) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground font-heading">Inspeção não encontrada</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/')}>Voltar</Button>
        </div>
      </div>
    );
  }

  const handleStatusChange = (status: InspectionStatus) => {
    updateInspection(inspection.id, { status });
  };

  const handleAddImages = (newImages: InspectionImage[]) => {
    updateInspection(inspection.id, { images: [...inspection.images, ...newImages] });
  };

  const handleRemoveImage = (imgId: string) => {
    updateInspection(inspection.id, { images: inspection.images.filter(i => i.id !== imgId) });
  };

  const handleAddLocation = (loc: FaultLocation) => {
    updateInspection(inspection.id, { faultLocations: [...inspection.faultLocations, loc] });
  };

  const handleRemoveLocation = (index: number) => {
    updateInspection(inspection.id, { faultLocations: inspection.faultLocations.filter((_, i) => i !== index) });
  };

  const handleAddNote = (note: TechnicalNote) => {
    updateInspection(inspection.id, { notes: [...inspection.notes, note] });
  };

  const handleRemoveNote = (noteId: string) => {
    updateInspection(inspection.id, { notes: inspection.notes.filter(n => n.id !== noteId) });
  };

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir esta inspeção?')) {
      deleteInspection(inspection.id);
      navigate('/');
      toast.success('Inspeção excluída');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-muted-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Bot className="w-5 h-5 text-primary" />
            <span className="font-heading text-sm font-bold text-foreground">RoboInspect</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="font-heading text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10" onClick={() => generateReport(inspection)}>
              <FileDown className="w-3.5 h-3.5" /> Exportar PDF
            </Button>
            <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={handleDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Info */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border/50 rounded-lg p-6 shadow-card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">{inspection.location}</h1>
              {inspection.description && (
                <p className="text-sm text-muted-foreground mt-1">{inspection.description}</p>
              )}
            </div>
            <Select value={inspection.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-auto bg-secondary border-border h-8">
                <StatusBadge status={inspection.status} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="in_progress">Em Progresso</SelectItem>
                <SelectItem value="completed">Concluída</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{format(new Date(inspection.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
            <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{inspection.responsible}</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{inspection.faultLocations.length} ponto(s) mapeado(s)</span>
          </div>
        </motion.div>

        {/* Sections */}
        {[
          { title: 'Imagens da Inspeção', icon: '📷', content: <ImageUploader images={inspection.images} onAdd={handleAddImages} onRemove={handleRemoveImage} /> },
          { title: 'Mapeamento de Falhas', icon: '📍', content: <FaultMap locations={inspection.faultLocations} onAdd={handleAddLocation} onRemove={handleRemoveLocation} /> },
          { title: 'Anotações Técnicas', icon: '📝', content: <TechnicalNotes notes={inspection.notes} onAdd={handleAddNote} onRemove={handleRemoveNote} /> },
        ].map((section, i) => (
          <motion.section key={section.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * (i + 1) }} className="bg-card border border-border/50 rounded-lg p-6 shadow-card">
            <h2 className="font-heading text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <span>{section.icon}</span> {section.title}
            </h2>
            {section.content}
          </motion.section>
        ))}
      </main>
    </div>
  );
}
