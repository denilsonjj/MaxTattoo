import React, { useState } from 'react';
import { Input } from '@/components/ui/input'; // Certifique-se de ter o UI/Input criado ou use input HTML padrão
import { Textarea } from '@/components/ui/textarea'; // Idem
import { Label } from '@/components/ui/label'; // Idem
import { Upload } from 'lucide-react';
import { storage } from '../../firebaseConfig'; // Importando Storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function PreBookingForm({ onFormChange }) {
  const [formData, setFormData] = useState({
    idea_description: '',
    body_location: '',
    size_cm: '',
    reference_image_url: ''
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onFormChange(newData);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // Lógica Firebase Storage
      const storageRef = ref(storage, `referencias/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      handleChange('reference_image_url', downloadURL);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao enviar imagem. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-[#FAFAFA] font-medium block">Descrição da Ideia *</label>
        <textarea
          placeholder="Descreva sua ideia de tatuagem..."
          value={formData.idea_description}
          onChange={(e) => handleChange('idea_description', e.target.value)}
          className="w-full bg-[#151515] border border-[#E60000]/20 rounded-md p-2 text-[#FAFAFA] focus:border-[#E60000] min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[#FAFAFA] font-medium block">Local do Corpo *</label>
        <input
          placeholder="Ex: Braço, perna, costas..."
          value={formData.body_location}
          onChange={(e) => handleChange('body_location', e.target.value)}
          className="w-full bg-[#151515] border border-[#E60000]/20 rounded-md p-2 text-[#FAFAFA] focus:border-[#E60000]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[#FAFAFA] font-medium block">Tamanho Aproximado (cm)</label>
        <input
          type="number"
          placeholder="Ex: 10"
          value={formData.size_cm}
          onChange={(e) => handleChange('size_cm', e.target.value)}
          className="w-full bg-[#151515] border border-[#E60000]/20 rounded-md p-2 text-[#FAFAFA] focus:border-[#E60000]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[#FAFAFA] font-medium block">Foto de Referência (Opcional)</label>
        <div className="relative">
          <input
            id="reference"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label
            htmlFor="reference"
            className="flex items-center justify-center gap-2 bg-[#151515] border-2 border-dashed border-[#E60000]/20 rounded-lg p-6 cursor-pointer hover:border-[#E60000]/40 transition-colors"
          >
            {uploading ? (
              <span className="text-[#FAFAFA]/60">Enviando...</span>
            ) : formData.reference_image_url ? (
              <div className="flex flex-col items-center gap-2">
                <img
                  src={formData.reference_image_url}
                  alt="Referência"
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <span className="text-[#E60000] text-sm">Clique para trocar</span>
              </div>
            ) : (
              <>
                <Upload className="w-6 h-6 text-[#FAFAFA]/40" />
                <span className="text-[#FAFAFA]/60">Clique para fazer upload</span>
              </>
            )}
          </label>
        </div>
      </div>
    </div>
  );
}