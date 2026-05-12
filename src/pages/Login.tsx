import { useState} from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/login-form"

export default function Login() {
    const navigate = useNavigate();
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState<string | null>(null);

    const handleLogin = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if(error){
            setError(error.message);
        } else {
            navigate('/');
        }
        setLoading(false);
    }
    
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        onSubmit={handleLogin}
        loading={loading}
        error={error || ""}
        />
      </div>
    </div>
  )
}
