import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Upload, Save } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { toast } from 'sonner';

export default function SiteSettingsManager({ settings, onUpdate }) {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    profile_image_url: settings?.profile_image_url || '',
    instagram_handle: settings?.instagram_handle || '@max_tatt00',
    phone_number: settings?.phone_number || '558193735982',
    location: settings?.location || 'Recife, PE'
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `settings/${Date.now()}.${fileExt}`;
      
      // Upload
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file);
        
      if (uploadError) throw uploadError;

      // Pegar URL
      const { data } = supabase.storage.from('images').getPublicUrl(fileName);
      
      setFormData(prev => ({ ...prev, profile_image_url: data.publicUrl }));
      toast.success('Foto carregada!');
    } catch (error) {
      toast.error('Erro no upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const dataToSave = { ...formData };
      
      // Se já existe um ID, atualiza. Se não, cria.
      if (settings?.id) {
        const { error } = await supabase
          .from('site_settings')
          .update(dataToSave)
          .eq('id', settings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert([dataToSave]);
        if (error) throw error;
      }

      toast.success('Configurações salvas!');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {/* Preview da Foto Redonda */}
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#E60000] bg-black flex-shrink-0">
          {formData.profile_image_url ? (
            <img src={formData.profile_image_url} className="w-full h-full object-cover" alt="Perfil" />
          ) : (
            <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-gray-500 text-xs">Sem foto</div>
          )}
        </div>

        {/* Botão de Upload Corrigido */}
        <div>
           <div className="relative">
             <input 
               type="file" 
               id="profile-upload" 
               className="hidden" 
               onChange={handleFileUpload} 
               disabled={uploading} 
               accept="image/*"
             />
             <label 
                htmlFor="profile-upload" 
                className={`flex items-center justify-center h-10 px-4 py-2 rounded-md font-medium transition-colors cursor-pointer bg-[#E60000] hover:bg-[#C50000] text-white ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
             >
                <Upload className="w-4 h-4 mr-2"/> 
                {uploading ? 'Enviando...' : 'Trocar Foto'}
             </label>
           </div>
           <p className="text-xs text-gray-500 mt-2">Será visível no topo do site.</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
           <label className="text-gray-400 text-sm">Instagram</label>
           <Input value={formData.instagram_handle} onChange={e => setFormData({...formData, instagram_handle: e.target.value})} />
        </div>
        <div>
           <label className="text-gray-400 text-sm">WhatsApp (Somente números com DDD)</label>
           <Input value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} />
        </div>
        <div>
           <label className="text-gray-400 text-sm">Localização</label>
           <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full bg-green-600 hover:bg-green-700 text-white">
         <Save className="w-4 h-4 mr-2" /> {saving ? 'Salvando...' : 'Salvar Tudo'}
      </Button>
    </div>
  );
}