import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut
} from "@/components/ui/dropdown-menu"
import { LogOutIcon} from "lucide-react"
import { APP_SIDEBAR } from "@/constants"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "./ui/button"


interface UserMenuProps {
    profile?: { src: string }
}

export const UserMenu = ({ profile = APP_SIDEBAR.allProfiles[0] }: UserMenuProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div className="relative">
                    <Avatar className="relative w-10 h-10">
                        <AvatarImage className=''src={profile.src}/>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-60">
                <DropdownMenuGroup>
                    {APP_SIDEBAR.userMenu.itemsPrimary.map((item) => (
                        <DropdownMenuItem key={item.title}>
                            <item.Icon className="mr-2 h-4 w-4"/><span>{item.title}</span>
                            {item.kbd && (
                                <DropdownMenuShortcut>{item.kbd}</DropdownMenuShortcut>
                            )
                            }
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>

                <DropdownMenuSeparator/>
                <DropdownMenuRadioGroup value={APP_SIDEBAR.curProfile.email} className="space-y-1">
                    <DropdownMenuLabel>Switch Account</DropdownMenuLabel>
                    {APP_SIDEBAR.allProfiles.map((profile) => (
                        <DropdownMenuRadioItem key={profile.email} value={profile.email} className="data-[state=checked] : bg-secondary">
                            <div className="relative inline-flex items-center">
                                    <Avatar className="relative size-13 rounded">
                                        <AvatarImage className=''src={profile.src}/>
                                    </Avatar>
                                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500"></span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold">
                                        {profile.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground truncate">{profile.email}</p>
                                </div>
                        </DropdownMenuRadioItem>
                    ))}
                    <DropdownMenuItem asChild>
                        <Button variant='outline' size='sm' className="w-full">
                            <LogOutIcon/>Sign Out 
                        </Button>

                    </DropdownMenuItem>
                </DropdownMenuRadioGroup>


            </DropdownMenuContent>
        </DropdownMenu>
    )
} 