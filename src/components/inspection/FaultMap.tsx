import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import { FaultLocation } from '@/types/inspection';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface Props {
  locations: FaultLocation[];
  onAdd: (loc: FaultLocation) => void;
  onRemove: (index: number) => void;
}

function ClickHandler({ onAdd }: { onAdd: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onAdd(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function FaultMap({ locations, onAdd, onRemove }: Props) {
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [manualDesc, setManualDesc] = useState('');
  const [pendingClick, setPendingClick] = useState<{ lat: number; lng: number } | null>(null);
  const [clickDesc, setClickDesc] = useState('');

  const handleManualAdd = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (isNaN(lat) || isNaN(lng)) return;
    onAdd({ lat, lng, description: manualDesc || 'Falha identificada' });
    setManualLat(''); setManualLng(''); setManualDesc('');
  };

  const handleMapClick = (lat: number, lng: number) => {
    setPendingClick({ lat, lng });
    setClickDesc('');
  };

  const confirmClick = () => {
    if (!pendingClick) return;
    onAdd({ ...pendingClick, description: clickDesc || 'Falha identificada' });
    setPendingClick(null);
    setClickDesc('');
  };

  const center = locations.length > 0
    ? [locations[0].lat, locations[0].lng] as [number, number]
    : [-23.55, -46.63] as [number, number];

  return (
    <div className="space-y-4">
      <div className="rounded-md overflow-hidden border border-border" style={{ height: 300 }}>
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }} className="z-0">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onAdd={handleMapClick} />
          {locations.map((loc, i) => (
            <Marker key={i} position={[loc.lat, loc.lng]}>
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{loc.description}</p>
                  <p className="text-xs text-gray-500">{loc.lat.toFixed(6)}, {loc.lng.toFixed(6)}</p>
                </div>
              </Popup>
            </Marker>
          ))}
          {pendingClick && (
            <Marker position={[pendingClick.lat, pendingClick.lng]} opacity={0.6} />
          )}
        </MapContainer>
      </div>

      {pendingClick && (
        <div className="flex gap-2 items-end p-3 rounded-md bg-secondary border border-border">
          <div className="flex-1 space-y-1">
            <Label className="text-xs text-muted-foreground">Descrição do ponto clicado</Label>
            <Input value={clickDesc} onChange={e => setClickDesc(e.target.value)} placeholder="Descreva a falha..." className="bg-muted border-border h-8 text-sm" />
          </div>
          <Button size="sm" onClick={confirmClick} className="font-heading text-xs">Confirmar</Button>
          <Button size="sm" variant="ghost" onClick={() => setPendingClick(null)} className="text-xs">Cancelar</Button>
        </div>
      )}

      <div className="flex gap-2 items-end">
        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Lat</Label>
          <Input value={manualLat} onChange={e => setManualLat(e.target.value)} className="bg-secondary border-border h-8 w-24 text-sm" placeholder="-23.55" />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Lng</Label>
          <Input value={manualLng} onChange={e => setManualLng(e.target.value)} className="bg-secondary border-border h-8 w-24 text-sm" placeholder="-46.63" />
        </div>
        <div className="flex-1 space-y-1">
          <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Descrição</Label>
          <Input value={manualDesc} onChange={e => setManualDesc(e.target.value)} className="bg-secondary border-border h-8 text-sm" placeholder="Falha..." />
        </div>
        <Button size="sm" variant="outline" onClick={handleManualAdd} className="font-heading text-xs gap-1 border-primary/30 text-primary">
          <Plus className="w-3 h-3" /> Adicionar
        </Button>
      </div>

      {locations.length > 0 && (
        <div className="space-y-1">
          {locations.map((loc, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2 rounded bg-secondary/50 text-sm">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="text-foreground flex-1">{loc.description}</span>
              <span className="text-xs text-muted-foreground">{loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onRemove(i)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
