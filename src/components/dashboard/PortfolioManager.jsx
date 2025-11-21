import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Upload, Trash2 } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { toast } from 'sonner';

export default function PortfolioManager({ images, onUpdate }) {
  const [uploading, setUploading] = useState(false);
  const [newImage, setNewImage] = useState({ image_url: '', title: '' });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `portfolio/${fileName}`;

      // 1. Upload para o Bucket 'images'
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Pegar URL Pública
      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      
      setNewImage({ ...newImage, image_url: data.publicUrl });
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
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error('Erro ao salvar');
    }
  };

  const handleDeleteImage = async (id) => {
    if (!confirm('Excluir esta imagem?')) return;
    try {
        const { error } = await supabase.from('portfolio').delete().eq('id', id);
        if (error) throw error;
        toast.success('Removida!');
        if (onUpdate) onUpdate();
    } catch (error) {
        toast.error('Erro ao remover');
    }
  };

  return (
    <div className="space-y-8">
      {/* Formulário de Adição */}
      <div className="bg-[#1A1A1A] border border-[#E60000]/20 rounded-xl p-6 space-y-4">
        <h3 className="text-white font-bold text-lg flex gap-2 items-center"><Upload className="text-[#E60000] w-5 h-5"/> Adicionar Nova Imagem</h3>
        
        <div className="grid md:grid-cols-[200px_1fr] gap-6 items-start">
            {/* Área de Upload */}
            <div className="relative group cursor-pointer">
                <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer z-20" accept="image/*" disabled={uploading} />
                <div className={`h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors ${newImage.image_url ? 'border-[#E60000] bg-black' : 'border-[#E60000]/30 bg-[#101010] hover:border-[#E60000]'}`}>
                    {uploading ? (
                        <span className="text-gray-400 text-sm animate-pulse">Enviando...</span>
                    ) : newImage.image_url ? (
                        <img src={newImage.image_url} className="h-full w-full object-cover rounded-lg" alt="Preview" />
                    ) : (
                        <>
                            <Upload className="text-gray-500 mb-2"/>
                            <span className="text-gray-500 text-xs">Clique para upload</span>
                        </>
                    )}
                </div>
            </div>

            {/* Campos de Texto */}
            <div className="space-y-4">
                <div>
                    <label className="text-sm text-gray-400 mb-1 block">Título (Opcional)</label>
                    <Input placeholder="Ex: Fechamento de braço" value={newImage.title} onChange={e => setNewImage({...newImage, title: e.target.value})} />
                </div>
                <Button onClick={handleAddImage} disabled={!newImage.image_url || uploading} className="w-full bg-[#E60000] hover:bg-[#C50000] text-white">
                    Salvar no Portfólio
                </Button>
            </div>
        </div>
      </div>

      {/* Galeria */}
      <div>
          <h3 className="text-white font-bold text-lg mb-4">Galeria Atual ({images.length})</h3>
          {images.length === 0 ? (
              <p className="text-gray-500 italic">Nenhuma imagem cadastrada.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map(img => (
                    <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden bg-[#151515] border border-[#333]">
                        <img src={img.image_url} className="w-full h-full object-cover" alt={img.title} />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button onClick={() => handleDeleteImage(img.id)} className="p-3 bg-red-600 rounded-full text-white hover:bg-red-700 transition-transform hover:scale-110">
                                <Trash2 size={20} />
                            </button>
                        </div>
                        {img.title && <p className="absolute bottom-0 w-full bg-black/80 text-white text-xs p-2 truncate text-center">{img.title}</p>}
                    </div>
                ))}
            </div>
          )}
      </div>
    </div>
  );
}