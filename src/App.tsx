import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import{ Droplets, Menu } from 'lucide-react';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import Home from './pages/Home';
import LakePrediction from './pages/LakePrediction';
import { useState, useEffect } from 'react';
import { type Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { NavBar } from "@/components/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import {MobileSideBar} from '@/components/mobile-sidebar';
import axios from 'axios';
// const Home = () => (
//   <div className="p-8">
//     <h1 className="text-3xl font-bold mb-4">Great Lakes Project</h1>
//     <p className="text-muted-foreground">Select a lake to view predictions for.</p>
//   </div> 
// );

// const Login = () => (
//   <div className="p-8">
//     <h1 className="text-3xl font-bold mb-4">Log In</h1>
//     <p className="text-muted-foreground">Log into browser</p>
//   </div> 
// );

// const LakePrediction = () => (
//   <div className="p-8">
//     <h1 className="text-3xl font-bold mb-4">Lake Prediction Model</h1>
//     <p className="text-muted-foreground">Enter your hydrological data</p>
//   </div> 
// );




const Layout = ({children,session}: {children:React.ReactNode, session:any}) => (
  <SidebarProvider defaultOpen={false}>
  <MobileSideBar session={session}/>
  <div className="w-full min-h-screen bg-background font-sans antialiased flex flex-col">
    <NavBar session={session} />
    <main className="flex-1 max-w-7xl w-full mx-auto">
      {children}
    </main>
  </div>
  </SidebarProvider>
);

function App() {
  const[session,setSession] = useState<Session | null>(null);

  const wakeServer = () => {
    console.log("Spinning up Render");
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    axios.get(`${apiUrl}/api/health`).then(res=> console.log("FastApi/Express Up")).catch(err => console.log("Ping failed",err.message));
  }

  useEffect(()=> {

    //check for active session
    supabase.auth.getSession().then(({ data:{session}}) =>{
      setSession(session);
      if(session){
        wakeServer();
      }
    });

    //listen for changes
    const { data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) =>{
      setSession(session);
      if( _event == 'SIGNED_IN' && session){
        wakeServer();
      }
    });

    

    return () => subscription.unsubscribe();

  }, []);
  return (
    <Router>
      <Layout session={session}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />}/>
          <Route path="/predict/:lakeName" element={<LakePrediction />} />
        </Routes>
      </Layout>
    </Router>
  )
};

export default App;