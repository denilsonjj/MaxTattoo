import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Upload, Trash2, Edit2, Plus, Image as ImageIcon, CheckCircle2, XCircle } from 'lucide-react';
import { FaEdit, FaTrash, FaImage } from "react-icons/fa";

import { supabase } from '../../supabaseClient';
import { toast } from 'sonner';
import InstagramPreview from './InstagramPreview';

export default function PromotionManager({ promotions = [], onUpdate }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewPromo, setPreviewPromo] = useState(null);

  const [formData, setFormData] = useState({
    title: '', description: '', original_price: '', promo_price: '', image_url: '', active: true
  });

  // Upload de Imagem
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `promotions/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('images').getPublicUrl(fileName);
      // Truque para evitar cache na hora do download (?t=...)
      setFormData({ ...formData, image_url: data.publicUrl });
      toast.success('Imagem enviada!');
    } catch (err) {
      toast.error('Erro no upload: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.title || !formData.promo_price) return toast.error('Título e preço são obrigatórios');
    try {
      const { error } = await supabase.from('promotions').insert([formData]);
      if (error) throw error;
      toast.success('Promoção criada!');
      setIsAdding(false);
      setFormData({ title: '', description: '', original_price: '', promo_price: '', image_url: '', active: true });
      if (onUpdate) onUpdate();
    } catch (e) { toast.error('Erro ao salvar'); }
  };

  const handleEdit = async (id) => {
    try {
      const { error } = await supabase.from('promotions').update(formData).eq('id', id);
      if (error) throw error;
      toast.success('Atualizado!');
      setEditingId(null);
      if (onUpdate) onUpdate();
    } catch (e) { toast.error('Erro ao atualizar'); }
  };

  const handleDelete = async (id) => {
    if (confirm('Deletar promoção?')) {
      await supabase.from('promotions').delete().eq('id', id);
      toast.success('Deletado!');
      if (onUpdate) onUpdate();
    }
  };

  // Lógica do Select Ativo/Inativo
  const handleStatusChange = async (item, newStatusString) => {
    const newActiveStatus = newStatusString === 'true';
    try {
      const { error } = await supabase.from('promotions').update({ active: newActiveStatus }).eq('id', item.id);
      if (error) throw error;
      toast.success(newActiveStatus ? 'Promoção ativada!' : 'Promoção pausada.');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao mudar status');
    }
  };

  return (
    <div className="space-y-6">
      {promotions && promotions.length > 0 ? (
        promotions.map(item => (
          <div key={item.id} className={`bg-[#101010] border rounded-xl p-4 transition-all ${item.active ? 'border-[#E60000]/40' : 'border-neutral-800 opacity-60'}`}>
            {editingId === item.id ? (
              <div className="space-y-3">
                <Input placeholder="Título" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                <Textarea placeholder="Descrição" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="De (R$)" value={formData.original_price} onChange={e => setFormData({ ...formData, original_price: e.target.value })} />
                  <Input placeholder="Por (R$)" value={formData.promo_price} onChange={e => setFormData({ ...formData, promo_price: e.target.value })} />
                </div>
                <div className="flex items-center gap-2">
                  <input type="file" id={`edit-file-${item.id}`} className="hidden" onChange={handleFileUpload} />
                  <label htmlFor={`edit-file-${item.id}`} className="cursor-pointer bg-[#151515] p-2 rounded border border-dashed border-[#E60000] text-sm text-gray-400 hover:text-white">
                    {uploading ? 'Enviando...' : 'Alterar Imagem'}
                  </label>
                  {formData.image_url && <img src={formData.image_url} className="h-10 w-10 rounded object-cover" alt="preview" />}
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleEdit(item.id)} className="bg-green-600 h-8 text-xs">Salvar</Button>
                  <Button onClick={() => setEditingId(null)} variant="outline" className="h-8 text-xs">Cancelar</Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                {item.image_url && <img src={item.image_url} className={`w-24 h-24 object-cover rounded-lg ${!item.active && 'grayscale'}`} alt={item.title} />}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-bold text-lg truncate ${item.active ? 'text-white' : 'text-gray-500'}`}>{item.title}</h3>
                    {!item.active && <span className="text-[10px] bg-neutral-800 px-2 py-0.5 rounded text-gray-500 uppercase tracking-wider">Inativo</span>}
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-2">{item.description}</p>
                  <div className="flex gap-2 mt-2 items-baseline">
                    {item.original_price && <span className="line-through text-gray-600 text-sm">R$ {item.original_price}</span>}
                    <span className={`font-bold text-xl ${item.active ? 'text-[#E60000]' : 'text-gray-500'}`}>R$ {item.promo_price}</span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-3 items-end w-full md:w-auto">
                  {/* SELECT DE STATUS */}
                  <div className="relative w-full md:w-32">
                    <select
                      value={item.active ? "true" : "false"}
                      onChange={(e) => handleStatusChange(item, e.target.value)}
                      className={`w-full appearance-none text-xs font-bold h-9 pl-3 pr-8 rounded-lg border bg-[#151515] focus:outline-none cursor-pointer transition-all ${item.active
                          ? 'border-green-900 text-green-400 hover:border-green-700'
                          : 'border-neutral-700 text-neutral-500 hover:border-neutral-600'
                        }`}
                    >
                      <option value="true">🟢 Ativa</option>
                      <option value="false">⚫ Inativa</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto">
                    {/* Botão Preview */}
                    <Button
                      onClick={() => setPreviewPromo(item)}
                      className="flex-1 bg-[#E60000] hover:bg-[#C50000] text-white h-9 px-3"
                    >
                      <FaImage className="w-4 h-4 mr-2" /> Preview
                    </Button>

                    {/* Botão Editar */}
                    <Button
                      onClick={() => { setEditingId(item.id); setFormData(item); }}
                      size="icon"
                      variant="ghost"
                      className="p-2 bg-transparent hover:bg-white/10 text-white"
                    >
                      <Edit2/>
                    </Button>

                    {/* Botão Excluir */}
                    <Button
                      onClick={() => handleDelete(item.id)}
                      size="icon"
                      variant="ghost"
                      className="p-2 bg-transparent hover:bg-white/10 text-white"
                    >
                      <FaTrash className="w-4 h-4" />
                    </Button>
                  </div>

                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 py-4">Nenhuma promoção cadastrada.</p>
      )}

      {isAdding ? (
        <div className="bg-[#101010] border border-dashed border-[#E60000] p-6 rounded-xl space-y-4 animate-in fade-in">
          <h4 className="text-[#E60000] font-bold flex items-center gap-2"><Plus size={18} /> Nova Promoção</h4>
          <Input placeholder="Título (Ex: Flash Day Anime)" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
          <Textarea placeholder="Descrição curta" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="Preço Original" value={formData.original_price} onChange={e => setFormData({ ...formData, original_price: e.target.value })} />
            <Input placeholder="Preço Promo" value={formData.promo_price} onChange={e => setFormData({ ...formData, promo_price: e.target.value })} />
          </div>

          <div className="relative group cursor-pointer">
            <input type="file" id="add-file" className="absolute inset-0 opacity-0 cursor-pointer z-20" onChange={handleFileUpload} disabled={uploading} />
            <div className={`h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors ${formData.image_url ? 'border-green-500 bg-green-900/10' : 'border-neutral-700 bg-[#151515] hover:border-[#E60000]'}`}>
              {uploading ? <span className="text-white animate-pulse">Enviando...</span> : formData.image_url ?
                <div className="text-green-500 flex flex-col items-center"><CheckCircle2 /><span className="text-xs mt-1">Imagem carregada!</span></div> :
                <div className="text-gray-400 flex flex-col items-center"><Upload /><span className="text-xs mt-1">Clique para upload</span></div>}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={handleAdd} className="flex-1 bg-[#E60000] hover:bg-[#C50000] text-white font-bold">Criar Promoção</Button>
            <Button onClick={() => setIsAdding(false)} variant="outline" className="flex-1 border-neutral-700 text-white hover:bg-neutral-800">Cancelar</Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setIsAdding(true)} variant="outline" className="w-full py-8 border-dashed border-[#E60000]/30 text-gray-400 hover:text-[#E60000] hover:border-[#E60000] hover:bg-[#E60000]/5 transition-all group">
          <Plus className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" /> Adicionar Nova Promoção
        </Button>
      )}

      {previewPromo && <InstagramPreview promotion={previewPromo} onClose={() => setPreviewPromo(null)} />}
    </div>
  );
}