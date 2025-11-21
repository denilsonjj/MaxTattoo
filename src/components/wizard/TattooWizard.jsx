import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Send, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../supabaseClient'; // <--- MUDANÇA IMPORTANTE
import { toast } from 'sonner';

const BODY_LOCATIONS = [
  { id: 'braco', label: 'Braço' },
  { id: 'perna', label: 'Perna' },
  { id: 'costas', label: 'Costas' },
  { id: 'peito', label: 'Peito' },
  { id: 'mao', label: 'Mão' },
  { id: 'pescoco', label: 'Pescoço' },
  { id: 'outro', label: 'Outro' }
];

const SIZES = [
  { id: 'mini', label: 'Mini', subtitle: 'Até 5cm', price: 'A partir de R$ 100' },
  { id: 'pequeno', label: 'Pequeno', subtitle: '5-10cm', price: 'A partir de R$ 150' },
  { id: 'medio', label: 'Médio', subtitle: 'Tamanho da palma', price: 'A partir de R$ 300' },
  { id: 'grande', label: 'Grande', subtitle: '+20cm', price: 'A partir de R$ 500' }
];

const STYLES = [
  'Blackwork', 'Realismo', 'Fine Line', 'Old School',
  'Tribal', 'Aquarela', 'Geométrico', 'Minimalista'
];

export default function TattooWizard({ onClose }) {
  const [step, setStep] = useState(1);
  const [bodyLocation, setBodyLocation] = useState('');
  const [size, setSize] = useState('');
  const [styles, setStyles] = useState([]);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = (step / 4) * 100;

  const handleStyleToggle = (style) => {
    if (styles.includes(style)) {
      setStyles(styles.filter(s => s !== style));
    } else {
      setStyles([...styles, style]);
    }
  };

  const handleNext = () => {
    if (step === 1 && !bodyLocation) {
      toast.error('Selecione o local do corpo');
      return;
    }
    if (step === 2 && !size) {
      toast.error('Selecione o tamanho');
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Salvar lead no banco de dados (Supabase)
      // Nota: Você precisaria criar a tabela 'leads' no Supabase se quiser salvar lá.
      // Por enquanto, vamos focar no envio do WhatsApp que é o principal.
      /* await supabase.from('leads').insert([{ 
        body_location: bodyLocation, 
        size: size, 
        styles: styles, 
        description: description,
        status: 'novo'
      }]);
      */

      // Montar mensagem para WhatsApp
      const locationLabel = BODY_LOCATIONS.find(l => l.id === bodyLocation)?.label || bodyLocation;
      const sizeLabel = SIZES.find(s => s.id === size)?.label || size;
      const stylesText = styles.length > 0 ? styles.join(', ') : 'Não especificado';
      
      let message = `🎨 *Orçamento via Site*\n\n`;
      message += `📍 *Local:* ${locationLabel}\n`;
      message += `📏 *Tamanho:* ${sizeLabel}\n`;
      message += `🎭 *Estilo:* ${stylesText}\n`;
      
      if (description) {
        message += `\n💭 *Minha ideia:*\n${description}\n`;
      }
      
      message += `\n_Podemos ver o valor exato?_`;

      const phoneNumber = '558193735982'; // Seu número
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      
      toast.success('Redirecionando para o WhatsApp...');
      
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        onClose();
      }, 1000);

    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao processar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#1A1A1A] w-full md:max-w-2xl h-full md:h-auto md:max-h-[90vh] md:rounded-3xl shadow-2xl flex flex-col border border-[#E60000]/30 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#101010] p-6 border-b border-[#E60000]/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-black text-[#FAFAFA]">Orçamento Interativo</h2>
              <p className="text-gray-400 text-sm">Etapa {step} de 4</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-[#FAFAFA] hover:bg-[#E60000]/20"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-[#151515] rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#E60000] to-[#FF4444]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait" custom={step}>
            {/* Etapa 1: Local do Corpo */}
            {step === 1 && (
              <motion.div
                key="step1"
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-[#FAFAFA] mb-4">Onde será a tatuagem?</h3>
                <div className="grid grid-cols-2 gap-4">
                  {BODY_LOCATIONS.map((location) => (
                    <button
                      key={location.id}
                      onClick={() => setBodyLocation(location.id)}
                      className={`p-6 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                        bodyLocation === location.id
                          ? 'border-[#E60000] bg-[#E60000]/10'
                          : 'border-[#E60000]/20 bg-[#151515] hover:border-[#E60000]/40'
                      }`}
                    >
                      <div className="text-[#FAFAFA] font-bold text-lg">{location.label}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Etapa 2: Tamanho */}
            {step === 2 && (
              <motion.div
                key="step2"
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold text-[#FAFAFA] mb-4">Qual o tamanho aproximado?</h3>
                {SIZES.map((sizeOption) => (
                  <button
                    key={sizeOption.id}
                    onClick={() => setSize(sizeOption.id)}
                    className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${
                      size === sizeOption.id
                        ? 'border-[#E60000] bg-[#E60000]/10'
                        : 'border-[#E60000]/20 bg-[#151515] hover:border-[#E60000]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[#FAFAFA] font-bold text-lg">{sizeOption.label}</div>
                        <div className="text-[#FAFAFA]/60 text-sm">{sizeOption.subtitle}</div>
                      </div>
                      <div className="text-[#E60000] font-bold text-sm">{sizeOption.price}</div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}

            {/* Etapa 3: Estilo e Ideia */}
            {step === 3 && (
              <motion.div
                key="step3"
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-[#FAFAFA] mb-4">Qual(is) estilo(s)?</h3>
                  <div className="flex flex-wrap gap-2">
                    {STYLES.map((style) => (
                      <button
                        key={style}
                        onClick={() => handleStyleToggle(style)}
                        className={`px-4 py-2 rounded-full border-2 transition-all text-sm font-medium ${
                          styles.includes(style)
                            ? 'border-[#E60000] bg-[#E60000]/20 text-[#FAFAFA]'
                            : 'border-[#E60000]/20 bg-[#151515] text-[#FAFAFA]/60 hover:border-[#E60000]/40'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#FAFAFA] mb-4">Descreva sua ideia</h3>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Quero uma rosa realista no antebraço, com cores vibrantes..."
                    className="bg-[#151515] border-[#E60000]/20 text-[#FAFAFA] placeholder:text-[#FAFAFA]/40 min-h-[150px] resize-none focus:border-[#E60000]"
                  />
                </div>
              </motion.div>
            )}

            {/* Etapa 4: Revisão */}
            {step === 4 && (
              <motion.div
                key="step4"
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-[#FAFAFA] mb-4">Confirme os dados</h3>
                
                <div className="space-y-4">
                  <div className="bg-[#151515] rounded-2xl p-5 border border-[#E60000]/20">
                    <div className="text-[#FAFAFA]/60 text-sm mb-1">Local do Corpo</div>
                    <div className="text-[#FAFAFA] font-bold text-lg">
                      {BODY_LOCATIONS.find(l => l.id === bodyLocation)?.label}
                    </div>
                  </div>

                  <div className="bg-[#151515] rounded-2xl p-5 border border-[#E60000]/20">
                    <div className="text-[#FAFAFA]/60 text-sm mb-1">Tamanho</div>
                    <div className="text-[#FAFAFA] font-bold text-lg">
                      {SIZES.find(s => s.id === size)?.label} - {SIZES.find(s => s.id === size)?.subtitle}
                    </div>
                    <div className="text-[#E60000] text-sm mt-1">
                      {SIZES.find(s => s.id === size)?.price}
                    </div>
                  </div>

                  {styles.length > 0 && (
                    <div className="bg-[#151515] rounded-2xl p-5 border border-[#E60000]/20">
                      <div className="text-[#FAFAFA]/60 text-sm mb-2">Estilos</div>
                      <div className="flex flex-wrap gap-2">
                        {styles.map(style => (
                          <span key={style} className="px-3 py-1 bg-[#E60000]/20 text-[#FAFAFA] rounded-full text-sm">
                            {style}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {description && (
                    <div className="bg-[#151515] rounded-2xl p-5 border border-[#E60000]/20">
                      <div className="text-[#FAFAFA]/60 text-sm mb-2">Descrição</div>
                      <div className="text-[#FAFAFA]">{description}</div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="bg-[#101010] p-6 border-t border-[#E60000]/20 flex gap-3">
          {step > 1 && (
            <Button
              onClick={handleBack}
              variant="outline"
              className="border-[#E60000]/30 text-[#FAFAFA] hover:bg-[#E60000]/20 bg-[#151515]"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          )}
          
          {step < 4 ? (
            <Button
              onClick={handleNext}
              className="flex-1 bg-[#E60000] hover:bg-[#C50000] text-white font-bold"
            >
              Próximo
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar no WhatsApp
                </>
              )}
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}