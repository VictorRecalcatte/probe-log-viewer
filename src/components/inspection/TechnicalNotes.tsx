import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import { TechnicalNote } from '@/types/inspection';
import { cn } from '@/lib/utils';

interface Props {
  notes: TechnicalNote[];
  onAdd: (note: TechnicalNote) => void;
  onRemove: (id: string) => void;
}

const severityConfig = {
  low: { label: 'Baixa', color: 'text-success' },
  medium: { label: 'Média', color: 'text-warning' },
  high: { label: 'Alta', color: 'text-primary' },
  critical: { label: 'Crítica', color: 'text-destructive' },
};

export function TechnicalNotes({ notes, onAdd, onRemove }: Props) {
  const [text, setText] = useState('');
  const [severity, setSeverity] = useState<TechnicalNote['severity']>('medium');

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd({
      id: crypto.randomUUID(),
      text: text.trim(),
      severity,
      timestamp: new Date().toISOString(),
    });
    setText('');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Textarea value={text} onChange={e => setText(e.target.value)} placeholder="Descreva a falha ou observação técnica..." rows={3} className="bg-secondary border-border" />
        <div className="flex items-end gap-3">
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Severidade</Label>
            <Select value={severity} onValueChange={(v: TechnicalNote['severity']) => setSeverity(v)}>
              <SelectTrigger className="bg-secondary border-border w-32 h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="critical">Crítica</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button size="sm" onClick={handleAdd} className="font-heading text-xs gap-1">
            <Plus className="w-3 h-3" /> Adicionar Nota
          </Button>
        </div>
      </div>

      {notes.length > 0 && (
        <div className="space-y-2">
          {notes.map(note => (
            <div key={note.id} className="flex gap-3 p-3 rounded-md bg-secondary/50 border border-border/50">
              <AlertTriangle className={cn('w-4 h-4 mt-0.5 shrink-0', severityConfig[note.severity].color)} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn('text-xs font-heading uppercase', severityConfig[note.severity].color)}>
                    {severityConfig[note.severity].label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(note.timestamp).toLocaleString('pt-BR')}
                  </span>
                </div>
                <p className="text-sm text-foreground/90">{note.text}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive shrink-0" onClick={() => onRemove(note.id)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
