import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { toast } from 'sonner';

const SUBTITLE_OPTIONS = [
  { value: 'ate_5cm', label: 'Até 5cm' },
  { value: 'ate_10cm', label: 'Até 10cm' },
  { value: 'ate_15cm', label: 'Até 15cm' },
  { value: 'maior_15cm', label: 'Maior que 15cm - Consultar WhatsApp' },
  { value: 'custom', label: 'Personalizado' }
];

export default function PricingManager({ pricing, onUpdate }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [customSubtitle, setCustomSubtitle] = useState('');
  const [selectedSubtitle, setSelectedSubtitle] = useState('ate_5cm');
  const [formData, setFormData] = useState({
    title: '', subtitle: '', price: '', icon: '✨'
  });

  const handleSubtitleChange = (e) => {
    const value = e.target.value;
    setSelectedSubtitle(value);
    if (value !== 'custom') {
      const option = SUBTITLE_OPTIONS.find(opt => opt.value === value);
      setFormData({ ...formData, subtitle: option ? option.label : '' });
    } else {
      setFormData({ ...formData, subtitle: customSubtitle });
    }
  };

  const handleAdd = async () => {
    if (!formData.title || !formData.price) return toast.error('Preencha título e preço');
    const finalSubtitle = selectedSubtitle === 'custom' ? customSubtitle : formData.subtitle;

    try {
      const { error } = await supabase.from('pricing_tiers').insert([{ ...formData, subtitle: finalSubtitle }]);
      if(error) throw error;
      toast.success('Preço adicionado!');
      setIsAdding(false);
      setFormData({ title: '', subtitle: '', price: '', icon: '✨' });
      if(onUpdate) onUpdate();
    } catch (error) {
      toast.error('Erro ao adicionar: ' + error.message);
    }
  };

  const handleEdit = async (id) => {
    const finalSubtitle = selectedSubtitle === 'custom' ? customSubtitle : formData.subtitle;
    try {
      const { error } = await supabase.from('pricing_tiers').update({ ...formData, subtitle: finalSubtitle }).eq('id', id);
      if(error) throw error;
      toast.success('Atualizado!');
      setEditingId(null);
      if(onUpdate) onUpdate();
    } catch (error) {
      toast.error('Erro ao atualizar');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remover este preço?')) return;
    try {
      const { error } = await supabase.from('pricing_tiers').delete().eq('id', id);
      if(error) throw error;
      toast.success('Removido!');
      if(onUpdate) onUpdate();
    } catch (error) {
      toast.error('Erro ao remover');
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setFormData(item);
    const matching = SUBTITLE_OPTIONS.find(opt => opt.label === item.subtitle);
    if (matching) {
      setSelectedSubtitle(matching.value);
    } else {
      setSelectedSubtitle('custom');
      setCustomSubtitle(item.subtitle);
    }
  };

  return (
    <div className="space-y-4">
      {pricing.map((item) => (
        <div key={item.id} className="bg-[#101010] border border-[#E60000]/20 rounded-xl p-4">
          {editingId === item.id ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Emoji" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} />
                <Input placeholder="Título" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <select value={selectedSubtitle} onChange={handleSubtitleChange} className="w-full bg-[#151515] border border-[#E60000]/20 rounded-md p-2 text-white">
                {SUBTITLE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              {selectedSubtitle === 'custom' && (
                <Input placeholder="Subtítulo personalizado" value={customSubtitle} onChange={e => { setCustomSubtitle(e.target.value); setFormData({...formData, subtitle: e.target.value}) }} />
              )}
              <Input placeholder="Preço" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(item.id)} size="sm" className="bg-green-600 hover:bg-green-700"><Check className="w-4 h-4"/></Button>
                <Button onClick={() => setEditingId(null)} size="sm" variant="outline"><X className="w-4 h-4"/></Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h3 className="text-[#FAFAFA] font-bold">{item.title}</h3>
                  <p className="text-[#FAFAFA]/60 text-sm">{item.subtitle}</p>
                  <p className="text-[#E60000] font-bold mt-1">{item.price}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => startEdit(item)} className="p-2 bg-transparent hover:bg-white/10 text-white"><Edit2 className="w-4 h-4"/></Button>
                <Button onClick={() => handleDelete(item.id)} className="p-2 bg-transparent hover:bg-white/10 text-[#E60000]"><Trash2 className="w-4 h-4"/></Button>
              </div>
            </div>
          )}
        </div>
      ))}
      {isAdding ? (
        <div className="bg-[#101010] border border-[#E60000]/30 border-dashed rounded-xl p-4 space-y-3">
           <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Emoji" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} />
              <Input placeholder="Título" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
           </div>
           <select value={selectedSubtitle} onChange={handleSubtitleChange} className="w-full bg-[#151515] border border-[#E60000]/20 rounded-md p-2 text-white">
              {SUBTITLE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            {selectedSubtitle === 'custom' && (
                <Input placeholder="Subtítulo" value={customSubtitle} onChange={e => { setCustomSubtitle(e.target.value); setFormData({...formData, subtitle: e.target.value}) }} />
            )}
           <Input placeholder="Preço" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
           <div className="flex gap-2">
             <Button onClick={handleAdd}>Salvar</Button>
             <Button onClick={() => setIsAdding(false)} variant="outline">Cancelar</Button>
           </div>
        </div>
      ) : (
        <Button onClick={() => setIsAdding(true)} variant="outline" className="w-full border-[#E60000]/20 text-gray-400 hover:text-white">
          <Plus className="w-4 h-4 mr-2" /> Adicionar Preço
        </Button>
      )}
    </div>
  );
}