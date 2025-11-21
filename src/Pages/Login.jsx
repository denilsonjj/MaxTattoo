import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao entrar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#101010] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1A1A1A] border border-[#E60000]/20 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-[#E60000]/10 border border-[#E60000] rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-[#E60000]" />
          </div>
          <h1 className="text-2xl font-bold text-white">Área Restrita</h1>
          <p className="text-gray-400 text-sm mt-1">Admin Max Tattoo</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-gray-300 text-sm font-medium ml-1">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-[#101010]" required />
          </div>
          <div className="space-y-2">
            <label className="text-gray-300 text-sm font-medium ml-1">Senha</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-[#101010]" required />
          </div>
          <Button type="submit" className="w-full bg-[#E60000] hover:bg-[#C50000] text-white py-6 font-bold" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : 'Acessar Painel'}
          </Button>
        </form>
        <div className="mt-6 text-center">
             <button onClick={() => navigate('/')} className="text-gray-500 text-xs hover:text-white">← Voltar ao site</button>
        </div>
      </div>
    </div>
  );
}