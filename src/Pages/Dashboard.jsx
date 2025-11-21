import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import PortfolioManager from '../components/dashboard/PortfolioManager';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) navigate('/login');
    });
  }, [navigate]);

  const fetchImages = async () => {
    const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (data) setImages(data);
    if (error) console.error('Erro ao buscar imagens:', error);
  };

  useEffect(() => {
    if (session) fetchImages();
  }, [session]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#E60000] w-8 h-8"/></div>;
  if (!session) return null;

  return (
    <div className="p-8 w-full max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Portfólio</h1>
        <p className="text-gray-400">Adicione, remova e organize seus trabalhos.</p>
      </div>
      <PortfolioManager images={images} onUpdate={fetchImages} />
    </div>
  );
}