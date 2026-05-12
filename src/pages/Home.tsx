import { Link } from 'react-router-dom';
import GaugeComponent from 'react-gauge-component';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Info } from 'lucide-react';

const lakesData = [
    {id: "erie", lake_name: "Erie", baseline: 89.02, min: -299.58, max: 724.46, lake_desc:"Despite its low land-to-lake ratio of 1.5:1, this massive lake reached a record high of 352.60 mm in 2001 and a record low of -90.66 mm in 1914, responding slowly to dry spells but remaining vulnerable to high evaporative moisture loss during ice-free winters."},
    {id: "michigan_huron", lake_name: "Michigan Huron", baseline: 68.79, min: -112.44, max: 304.83, lake_desc: "This 2:1 ratio land-to-lake system hit a maximum supply of 304.83 mm in 1960 and a record low of -112.44 mm during the 1952 regional drought, making it highly susceptible to extended dry periods that can lead to significant water level declines."},
    {id: "ontario", lake_name: "Ontario", baseline: 172.08, min: -104.88, max: 774.14, lake_desc: "Featuring the most extreme land-to-lake ratio at 3.4:1, Ontario holds the record NBS intensity of 774.14 mm from 1936 due to its intense funnel effect but can still face rapid supply drops to as low as -104.88 mm when basin runoff ceases during late-summer droughts."},
    {id: "superior", lake_name: "Superior", baseline: 67.88, min:-90.66, max: 352.60, lake_desc: "With a high land-to-lake ratio of 3.2:1, Erie is extremely sensitive to land-based runoff, as evidenced by its 724.46 mm peak during the 1913 flood and its -299.58 mm record low in 1952 caused by its shallow waters heating up and driving massive evaporation."},
];

export default function Home(){
    return(
        <div className="space-y-8 p-4 md:p-8">
            <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                    Great Lakes Model
                </h1>
                <p className="text-md text-mute-foreground">
                    The model is trained on a dataset of Great Lakes hydrological observations and Climate Forecast System Reanalysis (CFSR) meteorological features, including over-lake and land-basin precipitation, evaporation, and temperature from 1900 to 2025. Using data from the 1979–2010 period, the Gaussian model predicts Net Basin Supply (NBS) as the target.
                </p>
                <span className="text-xs">Note this is a personal project based on academic reaserch. Not for use in professional settings.</span>
                <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-full mt-4 border border-blue-100">
                    <Info className="w-4 h-4" />
                    <span>Select a lake below to predict its NBS</span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                {lakesData.map((lake) =>(
                    <Card key={lake.id} className="overflow-hidden border-border hover:border-primary/50 transition-colors shadow-sm text-center">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-2xl">{lake.lake_name}</CardTitle>
                            <CardDescription> {lake.lake_desc} </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 flex flex-cpol items-center">
                            <div className="w-full max-w-[250px] mx-auto relative">
                                {/* <GaugeComponent
                                    value={lake.baseline}
                                    minValue={lake.min}
                                    maxValue={lake.max}
                                    type="semicircle"
                                    arc={{
                                        gradient: true,
                                        width: 0.15,
                                        padding: 0,
                                        subArcs: [
                                            { limit: 25, color: "#00bcd4" },
                                            { limit: 50, color: "#2196f3" },
                                            { limit: 75, color: "#3f51b5" },
                                            { color: "#ffffffff" }
                                        ]
                                        }}
                                    pointer={{ type: "arrow", color: "#dfa810", maxFps: 30 }}
                                    labels={{
                                        valueLabel: { style: { fontSize: "24px", fill: "#e0e0e0" } },
                                        tickLabels: {
                                            type: "outer",
                                            ticks: [
                                                {value: lake.min},
                                                {value: lake.max}
                                            ],
                                            defaultTickValueConfig: { style: { fontSize: "9px", fill: "#aaa" } }
                                        }
                                        }}
                                    /> */}
                                    <GaugeComponent
                                        type="radial"
                                        value={lake.baseline}
                                        // 1. Explicitly set your mathematical boundaries
                                        minValue={lake.min}
                                        maxValue={lake.max}
                                        arc={{
                                            gradient: true,
                                            width: 0.15,
                                            padding: 0,
                                            subArcs: [
                                            { limit: lake.baseline -(lake.baseline * .75), color: '#00bcd4' }, 
                                            { limit: lake.baseline + (lake.baseline * 1.75), color: '#2196f3' }, 
                                            { color: '#3f51b5' } 
                                            ],
                                            //colorArray: ["#00bcd4", "#2196f3", "#3f51b5"],
                                            //nbSubArcs: 3
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
                                                { value: lake.min },
                                                { value: 0 },
                                                { value: lake.baseline},
                                                { value: lake.max }
                                            ],
                                            defaultTickValueConfig: { 
                                                style: { fontSize: "9px", fill: "#aaa" } 
                                            }
                                            }
                                        }}
                                        />
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/10 border-t">
                            <Button asChild className="w-full group" variant="secondary">
                                <Link to={`/predict/${lake.id}`}>
                                    Run Model for {lake.lake_name}
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}

            </div>
        </div>

    )
}
