import { Avatar } from "@/components/ui/avatar"
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
import { PlusIcon } from "lucide-react"
import { APP_SIDEBAR } from "@/constants"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

export const UserMenu = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <DropdownMenuContent>
                    <div className="relative inline-flex items-center">
                                    <Avatar className=" relative size-15">
                                        <AvatarImage className=''src={APP_SIDEBAR.curProfile.src}/>
                                    </Avatar>
                                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500"></span>
                    </div>

                </DropdownMenuContent>
            </DropdownMenuTrigger>
        </DropdownMenu>
    )
} 