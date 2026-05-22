import React, { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Save, Upload } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { toast } from 'sonner';

const DEFAULT_SETTINGS = {
  profile_image_url: '',
  instagram_handle: '@max_tatt00',
  phone_number: '558193735982',
  location: 'Igarassu, PE',
};

export default function SiteSettingsManager({ settings, onUpdate }) {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    setFormData({
      profile_image_url: settings?.profile_image_url || DEFAULT_SETTINGS.profile_image_url,
      instagram_handle: settings?.instagram_handle || DEFAULT_SETTINGS.instagram_handle,
      phone_number: settings?.phone_number || DEFAULT_SETTINGS.phone_number,
      location: settings?.location || DEFAULT_SETTINGS.location,
    });
  }, [settings]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `settings/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('images').getPublicUrl(fileName);

      setFormData((prev) => ({ ...prev, profile_image_url: data.publicUrl }));
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
      if (onUpdate) await onUpdate();
    } catch (error) {
      toast.error('Erro ao salvar: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <div className="rounded-lg border border-white/[0.08] bg-black/20 p-4">
        <div className="aspect-square overflow-hidden rounded-lg border border-[#b72f36]/30 bg-[#11100e]">
          {formData.profile_image_url ? (
            <img src={formData.profile_image_url} className="h-full w-full object-cover" alt="Perfil" />
          ) : (
            <div className="grid h-full w-full place-items-center text-sm text-[#d4ccc0]/42">Sem foto</div>
          )}
        </div>

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
          className={`mt-4 flex h-11 cursor-pointer items-center justify-center rounded-lg border border-[#b72f36]/30 bg-[#b72f36]/12 px-4 text-sm font-bold text-[#f4efe7] transition-colors hover:bg-[#b72f36]/18 ${
            uploading ? 'pointer-events-none opacity-50' : ''
          }`}
        >
          <Upload className="mr-2 h-4 w-4" />
          {uploading ? 'Enviando...' : 'Trocar foto'}
        </label>
        <p className="mt-3 text-xs leading-5 text-[#d4ccc0]/46">Essa imagem aparece no topo do site e na assinatura do artista.</p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-[#d4ccc0]/66">Instagram</label>
            <Input value={formData.instagram_handle} onChange={(event) => setFormData({ ...formData, instagram_handle: event.target.value })} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-[#d4ccc0]/66">WhatsApp</label>
            <Input value={formData.phone_number} onChange={(event) => setFormData({ ...formData, phone_number: event.target.value })} />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-[#d4ccc0]/66">Localização</label>
          <Input value={formData.location} onChange={(event) => setFormData({ ...formData, location: event.target.value })} />
        </div>

        <Button onClick={handleSave} disabled={saving || uploading} className="premium-button h-12 w-full rounded-lg font-black">
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Salvando...' : 'Salvar no Supabase'}
        </Button>
      </div>
    </div>
  );
}
