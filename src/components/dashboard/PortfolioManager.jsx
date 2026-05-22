import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ImagePlus, Trash2, Upload } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { toast } from 'sonner';

export default function PortfolioManager({ images, onUpdate }) {
  const [uploading, setUploading] = useState(false);
  const [newImage, setNewImage] = useState({ image_url: '', title: '' });

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `portfolio/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);

      setNewImage((prev) => ({ ...prev, image_url: data.publicUrl }));
      toast.success('Imagem carregada!');
    } catch (error) {
      toast.error('Erro no upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAddImage = async () => {
    if (!newImage.image_url) return toast.error('Faça upload da imagem primeiro');

    try {
      const { error } = await supabase
        .from('portfolio')
        .insert([{ title: newImage.title, image_url: newImage.image_url }]);

      if (error) throw error;

      toast.success('Adicionado ao portfólio!');
      setNewImage({ image_url: '', title: '' });
      if (onUpdate) await onUpdate();
    } catch (error) {
      toast.error('Erro ao salvar: ' + error.message);
    }
  };

  const handleDeleteImage = async (id) => {
    if (!confirm('Excluir esta imagem?')) return;

    try {
      const { error } = await supabase.from('portfolio').delete().eq('id', id);
      if (error) throw error;

      toast.success('Removida!');
      if (onUpdate) await onUpdate();
    } catch (error) {
      toast.error('Erro ao remover: ' + error.message);
    }
  };

  return (
    <div className="space-y-7">
      <div className="rounded-lg border border-white/[0.08] bg-black/20 p-4 md:p-5">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg border border-[#b72f36]/26 bg-[#b72f36]/10">
            <ImagePlus className="h-5 w-5 text-[#f4efe7]" />
          </span>
          <div>
            <h3 className="font-black text-[#f4efe7]">Adicionar imagem</h3>
            <p className="mt-1 text-sm text-[#d4ccc0]/50">O arquivo é salvo no bucket `images` e publicado no portfólio.</p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-[220px_1fr]">
          <label className="relative block cursor-pointer">
            <input type="file" onChange={handleFileUpload} className="absolute inset-0 z-20 cursor-pointer opacity-0" accept="image/*" disabled={uploading} />
            <div className={`grid h-48 place-items-center overflow-hidden rounded-lg border border-dashed transition-colors ${
              newImage.image_url ? 'border-[#b72f36]/42 bg-black' : 'border-white/14 bg-[#0d0d0b] hover:border-[#b72f36]/40'
            }`}>
              {uploading ? (
                <span className="text-sm text-[#d4ccc0]/60">Enviando...</span>
              ) : newImage.image_url ? (
                <img src={newImage.image_url} className="h-full w-full object-cover" alt="Preview" />
              ) : (
                <div className="flex flex-col items-center text-[#d4ccc0]/44">
                  <Upload className="mb-2 h-6 w-6" />
                  <span className="text-xs font-bold uppercase tracking-[0.16em]">Clique para upload</span>
                </div>
              )}
            </div>
          </label>

          <div className="flex flex-col justify-between gap-4">
            <div>
              <label className="mb-2 block text-sm font-bold text-[#d4ccc0]/66">Título opcional</label>
              <Input placeholder="Ex: Fechamento de braço" value={newImage.title} onChange={(event) => setNewImage({ ...newImage, title: event.target.value })} />
            </div>

            <Button onClick={handleAddImage} disabled={!newImage.image_url || uploading} className="premium-button h-12 rounded-lg font-black">
              Salvar no portfólio
            </Button>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-black text-[#f4efe7]">Galeria atual</h3>
          <span className="rounded-lg border border-white/[0.08] bg-white/[0.035] px-3 py-1 text-xs font-bold text-[#d4ccc0]/58">
            {images.length} imagens
          </span>
        </div>

        {images.length === 0 ? (
          <div className="rounded-lg border border-dashed border-white/[0.12] p-8 text-center text-sm text-[#d4ccc0]/46">
            Nenhuma imagem cadastrada.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
            {images.map((img) => (
              <div key={img.id} className="group relative aspect-[4/5] overflow-hidden rounded-lg border border-white/[0.08] bg-[#11100e]">
                <img src={img.image_url} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" alt={img.title || 'Tatuagem'} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/12 to-transparent opacity-100" />
                <button
                  onClick={() => handleDeleteImage(img.id)}
                  className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-black/60 text-white opacity-0 backdrop-blur-md transition-opacity hover:bg-[#b72f36] group-hover:opacity-100"
                  aria-label="Excluir imagem"
                >
                  <Trash2 size={17} />
                </button>
                <p className="absolute bottom-0 left-0 right-0 truncate p-3 text-xs font-bold text-white">
                  {img.title || 'Sem título'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
