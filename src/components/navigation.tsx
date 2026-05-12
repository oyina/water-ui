import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Link} from 'react-router-dom';
import{ Droplets } from 'lucide-react'; 
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";

export function NavBar({ session }: { session: any }){
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SidebarTrigger className="md:hidden mr-4" />
                <div className="hidden md:flex h-16 items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <Droplets className="text-blue-600 h-6 w-6" />
                        Great Lakes Predict
                    </Link>
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link to="/predict/erie" className={navigationMenuTriggerStyle()}>
                                    Lake Erie
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link to="/predict/michigan_huron" className={navigationMenuTriggerStyle()}>
                                    Lake Michigan Huron
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link to="/predict/superior" className={navigationMenuTriggerStyle()}>
                                    Lake Superior
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link to="/predict/ontario" className={navigationMenuTriggerStyle()}>
                                    Lake Ontario
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            {session ? (
                                <>
                                   <NavigationMenuItem>
                                    
                                            <Button onClick={() => {supabase.auth.signOut()}}>
                                                Sign Out
                                            </Button>
                                      
                                    </NavigationMenuItem>  
                                </>
                            ):(
                                <>
                                <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link to="/login" className="">
                                    Login
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link to="/signup" className={navigationMenuTriggerStyle()}>
                                    Sign Up
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem> 
                            </>)}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                
            </div>
        </header>
        
    )
}
