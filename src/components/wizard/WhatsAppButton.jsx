import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { db } from '../../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner'; // Biblioteca de toast recomendada

export default function WhatsAppButton({ formData }) {
  const handleWhatsAppClick = async () => {
    // Validar
    if (!formData.idea_description || !formData.body_location) {
      alert('Por favor, preencha a descrição e o local.');
      return;
    }

    // Salvar no Firebase
    try {
      await addDoc(collection(db, "leads"), {
        ...formData,
        createdAt: serverTimestamp(),
        source: 'web_pre_booking'
      });
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }

    // Montar msg WhatsApp
    let message = `Olá Max, gostaria de um orçamento.\n\n`;
    message += `📝 Ideia: ${formData.idea_description}\n`;
    message += `📍 Local: ${formData.body_location}\n`;
    if (formData.size_cm) message += `📏 Tamanho: ${formData.size_cm}cm\n`;
    if (formData.reference_image_url) {
      message += `\n🖼️ Imagem de referência enviada\nLink: ${formData.reference_image_url}`;
    }

    const phoneNumber = '5511999999999'; // SEU NUMERO
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-[#E60000] hover:bg-[#C50000] shadow-2xl z-50 transition-all hover:scale-110 flex items-center justify-center"
    >
      <MessageCircle className="w-8 h-8 text-white" />
    </Button>
  );
}