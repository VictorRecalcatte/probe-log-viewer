import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { Inspection, InspectionStatus } from '@/types/inspection';
import { toast } from 'sonner';

interface Props {
  onSubmit: (inspection: Inspection) => void;
}

export function CreateInspectionDialog({ onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    location: '',
    responsible: '',
    description: '',
    status: 'pending' as InspectionStatus,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.location || !form.responsible) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    const inspection: Inspection = {
      id: crypto.randomUUID(),
      ...form,
      images: [],
      faultLocations: [],
      notes: [],
      createdAt: new Date().toISOString(),
    };
    onSubmit(inspection);
    setOpen(false);
    setForm({ date: new Date().toISOString().split('T')[0], location: '', responsible: '', description: '', status: 'pending' });
    toast.success('Inspeção criada com sucesso');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-heading text-sm gap-2">
          <Plus className="w-4 h-4" />
          Nova Inspeção
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-foreground">Cadastrar Inspeção</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider">Data *</Label>
              <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="bg-secondary border-border" />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider">Status</Label>
              <Select value={form.status} onValueChange={(v: InspectionStatus) => setForm(f => ({ ...f, status: v }))}>
                <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="in_progress">Em Progresso</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">Local *</Label>
            <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Ex: Tanque T-201, Refinaria Norte" className="bg-secondary border-border" />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">Responsável *</Label>
            <Input value={form.responsible} onChange={e => setForm(f => ({ ...f, responsible: e.target.value }))} placeholder="Nome do técnico" className="bg-secondary border-border" />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">Descrição</Label>
            <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Descreva o objetivo da inspeção..." rows={3} className="bg-secondary border-border" />
          </div>
          <Button type="submit" className="w-full font-heading">Criar Inspeção</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
