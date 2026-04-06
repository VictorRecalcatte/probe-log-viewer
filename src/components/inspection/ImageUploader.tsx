import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, ZoomIn } from 'lucide-react';
import { InspectionImage } from '@/types/inspection';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Props {
  images: InspectionImage[];
  onAdd: (images: InspectionImage[]) => void;
  onRemove: (id: string) => void;
}

export function ImageUploader({ images, onAdd, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newImages: InspectionImage[] = [];
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        newImages.push({
          id: crypto.randomUUID(),
          url: reader.result as string,
          name: file.name,
          timestamp: new Date().toISOString(),
        });
        if (newImages.length === files.length) {
          onAdd(newImages);
          toast.success(`${newImages.length} imagem(ns) adicionada(s)`);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="font-heading text-xs gap-2 border-primary/30 text-primary hover:bg-primary/10" onClick={() => inputRef.current?.click()}>
          <Upload className="w-3.5 h-3.5" /> Upload Imagens
        </Button>
        <span className="text-xs text-muted-foreground">{images.length} imagem(ns)</span>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
      </div>
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map(img => (
            <div key={img.id} className="group relative aspect-square rounded-md overflow-hidden border border-border bg-secondary">
              <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground"><ZoomIn className="w-4 h-4" /></Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl bg-card border-border p-2">
                    <img src={img.url} alt={img.name} className="w-full rounded" />
                  </DialogContent>
                </Dialog>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onRemove(img.id)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-background/80 px-2 py-1">
                <p className="text-[10px] text-muted-foreground truncate">{img.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
