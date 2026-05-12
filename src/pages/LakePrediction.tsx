import { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { type Session } from '@supabase/supabase-js';
import axios from 'axios';
import GaugeComponent from "react-gauge-component";
import {Droplets} from 'lucide-react';


import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from "@/components/ui/button";

const lakesData = {
  "erie": {
    id: "erie",
    lake_name: "Erie",
    lake_desc: "With a high land-to-lake ratio of 3.2:1, Erie is extremely sensitive to land-based runoff, as evidenced by its 724.46 mm peak during the 1913 flood and its -299.58 mm record low in 1952 caused by its shallow waters heating up and driving massive evaporation.",
    baseline: 89.02,
    min: -299.58,
    max: 724.46,
    defaults: {
      precip: 91.85,
      evap: 49.65,
      airtemp: 282.23,
      land_precip: 92.96,
      land_evap: 66.08,
      land_airtemp: 281.91
    }
  },
  "michigan_huron": {
    id: "michigan_huron",
    lake_name: "Michigan Huron",
    lake_desc: "This 2:1 ratio land-to-lake system hit a maximum supply of 304.83 mm in 1960 and a record low of -112.44 mm during the 1952 regional drought, making it highly susceptible to extended dry periods that can lead to significant water level declines.",
    baseline: 68.79,
    min: -112.44,
    max: 304.83,
    defaults: {
      precip: 83.16,
      evap: 46.77,
      airtemp: 279.90,
      land_precip: 84.41,
      land_evap: 60.52,
      land_airtemp: 279.45
    }
  },
  "ontario": {
    id: "ontario",
    lake_name: "Ontario",
    lake_desc: "Featuring the most extreme land-to-lake ratio at 3.4:1, Ontario holds the record NBS intensity of 774.14 mm from 1936 due to its intense \"funnel effect\" but can still face rapid supply drops to as low as -104.88 mm when basin runoff ceases during late-summer droughts.",
    baseline: 172.08,
    min: -104.88,
    max: 774.14,
    defaults: {
      precip: 96.50,
      evap: 52.55,
      airtemp: 281.45,
      land_precip: 97.36,
      land_evap: 64.20,
      land_airtemp: 280.12
    }
  },
  "superior": {
    id: "superior",
    lake_name: "Superior",
    lake_desc: "Despite its low land-to-lake ratio of 1.5:1, this massive lake reached a record high of 352.60 mm in 2001 and a record low of -90.66 mm in 1914, responding slowly to dry spells but remaining vulnerable to high evaporative moisture loss during ice-free winters.",
    baseline: 67.88,
    min: -90.66,
    max: 352.60,
    defaults: {
      precip: 76.38,
      evap: 37.19,
      airtemp: 276.65,
      land_precip: 77.75,
      land_evap: 52.59,
      land_airtemp: 276.13
    }
  }
};

const formatLakeName = (slug: string) => {
  const formattedName = slug
    .replace(/_/g, ' ') 
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return `Lake ${formattedName}`;
};

export default function LakePrediction(){
    const { lakeName } = useParams();
    
    //input states
    const[inputs,setInputs] = useState({
        precip:'', evap: '', airTemp: '',
        landPrecip: '', landEvap: '', landAirTemp: ''
    });

    const [loading,setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [prediction,setPrediction] = useState<number | null>(null);
    const [source,setSource] = useState<string | null>(null);

    if(!lakeName) return <Navigate to="/" />;

    const handlePredict = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data: {session}} = await supabase.auth.getSession();

            if(!session){
                throw new Error("You must be signed in to run the model.");
            }
            console.log(lakeName.toLowerCase());
            const payload = {
                lake: lakeName.toLowerCase(),
                inputs : [
                    parseFloat(inputs.precip),
                    parseFloat(inputs.evap),
                    parseFloat(inputs.airTemp),
                    parseFloat(inputs.landPrecip),
                    parseFloat(inputs.landEvap),
                    parseFloat(inputs.landAirTemp)
                ]
            };

            //post express
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await axios.post(`${apiUrl}/predict/`,payload, {
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                }
            });

            setPrediction(response.data.result);
            setSource(response.data.source);
        } catch(err: any){
            console.error(err);
            setError(err.response?.data?.error || err.message || "Failed to fetch prediction.");
        } finally {
            setLoading(false);
        }

    };
    
    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setInputs({...inputs, [e.target.id]: e.target.value});
    };

    const[session,setSession] = useState<Session | null>(null);
    useEffect(()=> {
    
        //check for active session
        supabase.auth.getSession().then(({ data:{session}}) =>{
          setSession(session);
        });
    
        //listen for changes
        const { data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) =>{
          setSession(session);
        })
    
        return () => subscription.unsubscribe();
    
      }, []);

    return(
        <div className="p-4 md:p-8 max-w-6xl space-y-6">
            <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto mb-12">
                <h1 className="text-3xl font-bold tracking-tight">{formatLakeName(lakeName)} Prediction</h1>
                <p className="text-md text-mute-foreground">
                    {lakesData[lakeName].lake_desc}
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 space-y-6">
                    <Card className="h-full flex flex-col items-center justify-center p-6 text-center shadow-md border-blue-100">
                        <div className="space-y-4 w-full flex flex-col items-center">
                                <h2 className="text-2xl font-bold">Predicted Level</h2>
                                <div className="w-full max-w-[300px]">
                                    <GaugeComponent
                                        type="radial"
                                        value={prediction ? prediction : lakesData[lakeName].baseline}
                                        // 1. Explicitly set your mathematical boundaries
                                        minValue={lakesData[lakeName].min}
                                        maxValue={lakesData[lakeName].max}
                                        arc={{
                                            gradient: true,
                                            width: 0.15,
                                            padding: 0,
                                            subArcs: [
                                            { limit: lakesData[lakeName].baseline -(lakesData[lakeName].baseline * .75), color: '#00bcd4' }, 
                                            { limit: lakesData[lakeName].baseline + (lakesData[lakeName].baseline * 1.75), color: '#2196f3' }, 
                                            { color: '#3f51b5' } 
                                            ]
                                        }}
                                        pointer={{ 
                                            type: "arrow", 
                                            color: "#dfa810" 
                                        }}
                                        labels={{
                                            valueLabel: { 
                                            style: { fontSize: "45px", fill: "#000000", textShadow: "none" },
                                            formatTextValue: (value) => value + ' mm' 
                                            },
                                            tickLabels: {
                                            type: "outer",
                                            ticks: [
                                                { value: lakesData[lakeName].min },
                                                { value: 0 },
                                                { value: lakesData[lakeName].baseline},
                                                { value: lakesData[lakeName].max }
                                            ],
                                            defaultTickValueConfig: { 
                                                style: { fontSize: "9px", fill: "#aaa" } 
                                            }
                                            }
                                        }}
                                        />
                                </div>
                                {prediction ? (
                                    <div className="mt-4 p-4 bg-slate-50 rounded-lg w-full">
                                    <p className="text-sm text-muted-foreground uppercase tracking wider font-semibold"> Data Source</p>
                                    <p className={`text-lg font-bold ${source == 'cache' ?'text-green-600': 'text-blue-600'}`}>
                                        {source == 'cache' ? 'Supabase Cache': 'FastAPI Engine (Predicted)'}
                                    </p>
                                </div>
                                ):(
                                    <div className="text-muted-foreground flex flex-col items-center gap-4 py-12">
                                        <p>Enter parameters and run the forecast to see results.</p>
                                    </div>
                                )}
                            </div>
                    </Card>
                </div>
                <Card className="lg:col-span-7">
                    <CardHeader>
                        <CardTitle className="font-semibold">Hydrological Feaures</CardTitle>
                        <CardDescription>Enter parameters and run the forecast to see results. Type in  place holder values to test model.</CardDescription>
                        <CardContent className="px-0">
                            <form onSubmit={session ? handlePredict : null} className="space-y-6">
                                <div className="space-y-4 p-4 border rounded-lg bg-slate-50/50">
                                    <h3 className="font-semibold flex items-center gap-2">
                                         Lake Features
                                    </h3> 
                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="precip">Precipitation</Label>
                                            <Input id="precip" 
                                            type="number" 
                                            step="any" 
                                            required 
                                            value={inputs.precip} 
                                            onChange={handleInputChange} 
                                            placeholder={lakesData[lakeName].defaults["precip"]}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="evap">Evaporation</Label>
                                            <Input 
                                            id="evap" 
                                            type="number" 
                                            step="any" 
                                            required 
                                            value={inputs.evap}
                                            onChange={handleInputChange} 
                                            placeholder={lakesData[lakeName].defaults["evap"]}
                                        />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="airTemp">Air Temperature</Label>
                                            <Input 
                                            id="airTemp" 
                                            type="number" 
                                            step="any" 
                                            required 
                                            value={inputs.airTemp} 
                                            onChange={handleInputChange} 
                                            placeholder={lakesData[lakeName].defaults["airtemp"]}
                                           />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4 p-4 border rounded-lg bg-slate-50/50">
                                    <h3 className="font-semibold flex items-center gap-2">
                                       Land Features
                                    </h3> 
                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="landPrecip">Precipitation</Label>
                                            <Input 
                                            id="landPrecip" 
                                            type="number" 
                                            step="any" 
                                            required 
                                            value={inputs.landPrecip} 
                                            onChange={handleInputChange} 
                                            placeholder={lakesData[lakeName].defaults["land_precip"]} 
                                           
                                             />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="landEvap">Evaporation</Label>
                                            <Input 
                                            id="landEvap" 
                                            type="number" 
                                            step="any" 
                                            required 
                                            value={inputs.landEvap} 
                                            onChange={handleInputChange} 
                                            placeholder={lakesData[lakeName].defaults["land_evap"]} 
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="landAirTemp">Air Temperature</Label>
                                            <Input 
                                            id="landAirTemp"
                                            step="any" 
                                            required 
                                            value={inputs.landAirTemp} 
                                            onChange={handleInputChange} 
                                            placeholder={lakesData[lakeName].defaults["land_airtemp"]} 
                                            />
                                        </div>
                                    </div>
                                </div>
                                {error && <p className="text-sm font-medium text-red-500 p-3 rounded-md">{error}</p>}
                                {session ? (
                                    <Button type="submit" size="lg" className="w-full text-lg cursor-pointer" disabled={loading}>{loading ? "Calculating.." : "Run ML Forecast" }</Button>):
                                (
                                     <Link to="/login"><Button size="lg" className="w-full text-lg cursor-pointer" >Login to Forecast</Button></Link>
                                )}
                                
                            </form>
                        </CardContent>
                    </CardHeader>
                </Card>
            </div>
        </div>
    )

}
