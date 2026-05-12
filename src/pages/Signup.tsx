import { SignupForm } from "@/components/signup-form";
import { useState } from "react";
import { supabase } from '@/lib/supabase';
import { useNavigate } from "react-router-dom";

export default function SignUp() {
    const navigate = useNavigate();
    const [email,setEmail] = useState('');
    const [fullname,setFullname] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState<string | null>(null);
    const [success,setSuccess] = useState<string | null>(null);

    const handleSignup = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setError(null);

        if(password != confirmPassword){
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        const { data,error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    display_name: fullname
                }
            }
        });

        if(error){
            setError(error.message);
        } else if(data.user && !data.session) {
            setSuccess("Account created! Please check your email for confirmation link.");
        }else {
            navigate('/');
        }
        setLoading(false);

    }
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm
        fullname={fullname}
        setFullname={setFullname}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        onSubmit={handleSignup}
        loading={loading}
        error={error || ""} 
        success={success}
        />
      </div>
    </div>
  )
}
