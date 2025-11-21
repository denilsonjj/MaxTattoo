import React, { useRef, useState, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { Download, X, Instagram } from 'lucide-react';
import { Button } from '../ui/Button';

const InstagramPreview = ({ promotion, onClose }) => {
  const previewRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    if (previewRef.current === null) {
      return;
    }

    setIsDownloading(true);

    try {
      // Pequeno delay para garantir que imagens carregaram
      await new Promise((resolve) => setTimeout(resolve, 100));

      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true, // Força o carregamento da imagem fresca
        pixelRatio: 2,   // Qualidade HD
        backgroundColor: '#000000', // Garante fundo preto se for transparente
      });

      const link = document.createElement('a');
      link.download = `promo-${promotion.title.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Erro ao gerar imagem:', err);
      // Se der erro, tenta uma segunda vez (truque comum com imagens externas)
      alert("Houve um erro ao processar a imagem. Tente clicar em baixar novamente."); 
    } finally {
      setIsDownloading(false);
    }
  }, [previewRef, promotion]);

  const formatPrice = (val) => {
      if(!val) return "";
      return val.toString().includes("R$") ? val : `R$ ${val}`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#121212] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-neutral-800">
        
        {/* Cabeçalho do Modal */}
        <div className="flex justify-between items-center p-4 border-b border-neutral-800">
          <h3 className="text-white font-bold flex items-center gap-2">
            <Instagram className="text-[#E1306C]" /> Preview do Story
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* ÁREA QUE SERÁ BAIXADA (O STORY) */}
        <div className="flex justify-center p-4 bg-[#000]">
            <div 
              ref={previewRef}
              className="aspect-[9/16] w-[320px] relative bg-gradient-to-b from-[#1a1a1a] to-black flex flex-col items-center rounded-lg overflow-hidden text-white shadow-lg"
            >
                {/* Imagem de Fundo (Borrada) */}
                <div className="absolute inset-0 opacity-30">
                    {promotion.image_url && (
                         <img 
                            src={promotion.image_url} 
                            className="w-full h-full object-cover blur-xl" 
                            alt="bg" 
                            crossOrigin="anonymous" 
                         />
                    )}
                </div>

                {/* Conteúdo Frontal */}
                <div className="relative z-10 w-full h-full flex flex-col p-6 justify-between py-12">
                    
                    {/* Título (Sem Flash Day) */}
                    <div className="text-center mt-4">
                        <h1 className="text-3xl font-black uppercase italic tracking-tighter shadow-black drop-shadow-lg">
                            {promotion.title}
                        </h1>
                    </div>

                    {/* Imagem Central Destacada */}
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-[#E60000]/50 shadow-2xl my-4 group bg-black">
                         {promotion.image_url ? (
                            <img 
                                src={promotion.image_url} 
                                className="w-full h-full object-cover" 
                                alt="promo"
                                crossOrigin="anonymous"
                            />
                         ) : (
                             <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-neutral-700 font-bold">SEM FOTO</div>
                         )}
                         {/* Selo Disponível */}
                         <div className="absolute top-2 right-2 bg-green-500 text-black font-bold text-xs px-2 py-1 rounded transform rotate-3 shadow-lg">
                            DISPONÍVEL
                         </div>
                    </div>

                    {/* Preços e Info */}
                    <div className="text-center space-y-2 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10">
                        <p className="text-gray-300 text-sm leading-tight font-medium">{promotion.description}</p>
                        
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent my-3"></div>
                        
                        <div className="flex flex-col items-center gap-1">
                            {promotion.original_price && (
                                <span className="text-gray-500 line-through text-sm font-medium">
                                    de {formatPrice(promotion.original_price)}
                                </span>
                            )}
                            <span className="text-[#E60000] font-black text-5xl drop-shadow-[0_2px_10px_rgba(230,0,0,0.5)]">
                                {formatPrice(promotion.promo_price)}
                            </span>
                        </div>
                    </div>

                    {/* Footer do Story */}
                    <div className="text-center pt-4">
                         <div className="inline-block bg-white text-black font-bold text-xs px-6 py-2 rounded-full">
                            LINK NA BIO
                         </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Botões de Ação */}
        <div className="p-4 border-t border-neutral-800 flex gap-3 bg-[#101010]">
         <Button 
  onClick={handleDownload} 
  disabled={isDownloading}
  className="w-full bg-white !text-black hover:bg-gray-200 font-bold flex items-center justify-center gap-2"
>
  {isDownloading ? 'Gerando...' : (
    <>
      <Download size={18}/> Baixar Story
    </>
  )}
</Button>

        </div>

      </div>
    </div>
  );
};

export default InstagramPreview;