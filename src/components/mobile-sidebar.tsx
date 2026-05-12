
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link} from 'react-router-dom';
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";

export function MobileSideBar({session}:{session:any}) {
  return (
    <Sidebar className="md:hidden">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/">
                        Home
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/predict/erie">
                        Lake Erie
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/predict/michigan_huron">
                        Lake Michigan Huron
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/predict/superior">
                        Lake Superior
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/predict/ontario">
                        Lake Ontario
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                 {session ? (
                    <>
                    <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                                <Button onClick={() => {supabase.auth.signOut()}}>
                                    Sign Out
                                </Button>
                        </SidebarMenuButton>
                </SidebarMenuItem>  
                    </>
                ):(
                    <>
                    <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                        <Link to="/login" className="">
                        Login
                        </Link>
                           </SidebarMenuButton>
                </SidebarMenuItem>  
                  <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                        <Link to="/signup" >
                        Sign Up
                        </Link>
                         </SidebarMenuButton>
                </SidebarMenuItem>  
                </>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}