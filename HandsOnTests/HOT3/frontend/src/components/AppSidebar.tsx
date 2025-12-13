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
//import { useSidebar } from "@/components/ui/sidebar"
import {  BarcodeIcon} from "lucide-react"
import {APP_SIDEBAR} from '@/constants'


import { UserMenu } from "@/components/UserMenu"



export const AppSidebar = () => {

    return (
        <Sidebar variant="floating" collapsible="icon">
            <SidebarHeader className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-start items-center">
                    <SidebarMenu >
                    <SidebarMenuItem>
                        <BarcodeIcon className="bg-stone-500 rounded size-7"/>
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

                {/* Secondary*/}
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
                        <UserMenu/>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            

        </Sidebar>
    )
}