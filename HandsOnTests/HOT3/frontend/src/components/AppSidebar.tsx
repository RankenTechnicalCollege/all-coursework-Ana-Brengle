import {
  Sidebar,
  SidebarContent,
  //SidebarFooter,
  //SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupContent,
  SidebarGroup,
  SidebarFooter
} from "@/components/ui/sidebar"

//import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import {  BarcodeIcon, LogInIcon } from "lucide-react"
import {APP_SIDEBAR} from '@/constants'
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { AvatarImage } from "@radix-ui/react-avatar"
import { UserMenu } from "./UserMenu"

export const AppSidebar = () => {
    const { toggleSidebar} = useSidebar()
  useEffect(() => {
    toggleSidebar()
  }, [toggleSidebar])
    return (
        <Sidebar variant="floating" collapsible="icon">
            <SidebarHeader className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-start items-center">
                    <SidebarMenu>
                    <SidebarMenuItem>
                        <Button onClick={toggleSidebar}><BarcodeIcon/></Button>
                    </SidebarMenuItem>
                    </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {/* Primary */}
                <SidebarGroup>
                <SidebarGroupContent>
                   <SidebarMenu>
                    {APP_SIDEBAR.primaryNav.map(item => (<SidebarMenuItem key={item.title}>
                        <SidebarMenuButton tooltip={item.title} asChild>
                            <a href={item.url} className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                                <item.Icon />
                                <span className="flex items-center gap-2">
                                <span>{item.title}</span>
                                </span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>))}
                   </SidebarMenu>
                </SidebarGroupContent>
                </SidebarGroup>
                {/* Primary */}
                <SidebarGroup className="mt-auto">
                <SidebarGroupContent>
                     <SidebarMenu>
                    {APP_SIDEBAR.secondaryNav.map(item => (<SidebarMenuItem key={item.title}>
                        <SidebarMenuButton tooltip={item.title} asChild>
                            <a href={item.url} className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                                <item.Icon />
                                <span className="flex items-center gap-2">
                                <span>{item.title}</span>
                                </span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>))}
                   </SidebarMenu>

                </SidebarGroupContent>
            </SidebarGroup>
            </SidebarContent>

            {/**Side bar footer */}
            <SidebarFooter className="border-t">
                <SidebarMenu>
                    <SidebarMenuItem className="p-2">
                        <div className="flex justify-between  items-start gap-2">
                            <div className="grid grid-cols-[max-content_minmax(0, 1fr)] items-center gap-2">
                                <div className="relative inline-flex items-center">
                                    <Avatar className=" relative size-15">
                                        <AvatarImage className=''src={APP_SIDEBAR.curProfile.src}/>
                                    </Avatar>
                                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500"></span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold">
                                        {APP_SIDEBAR.curProfile.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground truncate">{APP_SIDEBAR.curProfile.email}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon-sm"><LogInIcon/></Button>
                        </div>
                        <UserMenu/>

                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            

        </Sidebar>
    )
}