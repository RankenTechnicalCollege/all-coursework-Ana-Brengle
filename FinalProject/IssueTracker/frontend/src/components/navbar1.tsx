"use client";

import {  BugIcon,Menu, UserRound, EllipsisVertical, LogOutIcon, LogOut} from "lucide-react";
import { Spinner } from "@/components/ui/spinner"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import { useNavigate, Link } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import type { Session } from "better-auth/types";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
  requiredRole?: string | string[]
}
interface ExtendedUser {
  id: string,
  email: string,
  fullName: string,
  role: string[],
  image?: string,
  createdAt?: Date,
  updatedAt?: Date
}
export interface ExtendedSession extends Omit<Session, 'user'> {
  user: ExtendedUser
}

interface Navbar1Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}

const Navbar1 = ({
  logo = {
    url: "https://www.shadcnblocks.com",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
    alt: "logo",
    title: "BUG TRACKER",
  },
  menu = [
    { title: "Home", url: "#" },
    {
      title: "Users",
      url: "#",
      items: [
        {
          title: "All Users",
          description: "The latest industry news, updates, and info",
          icon: <UserRound className="size-5 shrink-0" />,
          url: "/userList",
        }
        // {
        //   title: "Edit User",
        //   description: "Our mission is to innovate and empower the world",
        //   icon: <UserPen className="size-5 shrink-0" />,
        //   url: "#",
        //   requiredRole: ["Production Manager"]
        // },
        // {
        //   title: "Careers",
        //   description: "Browse job listing and discover our workspace",
        //   icon: <Sunset className="size-5 shrink-0" />,
        //   url: "#",
        // },
        // {
        //   title: "Support",
        //   description:
        //     "Get in touch with our support team or visit our community forums",
        //   icon: <Zap className="size-5 shrink-0" />,
        //   url: "#",
        // },
      ],
    },
    {
      title: "Bugs",
      url: "#",
      items: [
        {
          title: "View Bugs",
          description: "Get all the answers you need right here",
          icon: <BugIcon className="size-5 shrink-0" />,
          url: "/bugList",
        },
        // {
        //   title: "Create Bugs",
        //   description: "We are here to help you with any questions you have",
        //   icon: <SquareChevronRight className="size-5 shrink-0" />,
        //   url: "#",
        //   requiredRole: ["Developer", "Business Analyst", "Quality Analyst", "Product Manager", "Technical Manager"]
        // },
        // {
        //   title: "Edit Bug",
        //   description: "Check the current status of our services and APIs",
        //   icon: <BugPlay className="size-5 shrink-0" />,
        //   url: "#",
        //   requiredRole: ["Product Manager"]
        // },
        // {
        //   title: "Close Bug",
        //   description: "Our terms and conditions for using our services",
        //   icon: <BugOff className="size-5 shrink-0" />,
        //   url: "#",
        //   requiredRole: ["Product Manager"]
        // },
      ],
    },
    // {
    //   title: "Comments",
    //   url: "#",
    //   items: [
    //     {
    //       title: "View Comments",
    //       description: "Get all the answers you need right here",
    //       icon: <MessagesSquare className="size-5 shrink-0" />,
    //       url: "#",
    //       requiredRole: ["Developer", "Business Analyst", "Quality Analyst", "Product Manager"]
    //     },
    //     {
    //       title: "Add Comments",
    //       description: "Get all the answers you need right here",
    //       icon: <MessageCirclePlus className="size-5 shrink-0" />,
    //       url: "#",
    //       requiredRole: ["Developer", "Business Analyst", "Quality Analyst", "Product Manager"]
    //     }

    //   ]
    // },
    // {
    //   title: "Test Cases",
    //   url: "#",
    //   items: [
    //     {
    //       title: "View Test Cases",
    //       description: "Get all the answers you need right here",
    //       icon: <Biohazard className="size-5 shrink-0" />,
    //       url: "#",
    //       requiredRole: ["Quality Analyst"]
    //     },
    //     {
    //       title: "Add Test Cases",
    //       description: "Get all the answers you need right here",
    //       icon: <ShieldPlus className="size-5 shrink-0" />,
    //       url: "#",
    //       requiredRole: ["Quality Analyst"]
    //     },
    //     {
    //       title: "Edit Test Cases",
    //       description: "Get all the answers you need right here",
    //       icon: <FilePenLine className="size-5 shrink-0" />,
    //       url: "#",
    //       requiredRole: ["Quality Analyst"]
    //     },
    //     {
    //       title: "Delete Test Cases",
    //       description: "Get all the answers you need right here",
    //       icon: <BookMinus className="size-5 shrink-0" />,
    //       url: "#",
    //       requiredRole: ["Quality Analyst"]
    //     }
    //   ]
    // },
  ],
  auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Sign up", url: "/signup" },
  },
}: Navbar1Props) => {
  const {data:session, isPending} = authClient.useSession();
  const navigate = useNavigate();

  const extendedSession = session as ExtendedSession | null

  const hasRole = (requiredRole?: string | string[]) => {
    if (!requiredRole || !extendedSession?.user?.role) return true;
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return roles.some((role) => extendedSession.user.role.includes(role));
  };

  // Filter menu items based on user roles
  const filteredMenu = menu.filter((item) => {
    if (!extendedSession && item.requiredRole) return false;
    return hasRole(item.requiredRole);
  });

  const handleSignOut = async () => {
    await authClient.signOut();
    navigate("/")
  }
  return (
    <section className="py-4">
      <div className="container">
        {/* Desktop Menu */}
        <nav className="hidden items-center justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link to={logo.url} className="flex items-center gap-2">
              <img
                src={logo.src}
                className="max-h-8 dark:invert"
                alt={logo.alt}
              />
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </Link>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {filteredMenu.map((item) => renderMenuItem(item, extendedSession))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isPending ? (
              <span className="text-sm"><Spinner/></span>
            ): extendedSession ? (
              <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex items-center gap-2 p-1 rounded-lg hover:bg-muted">
                    <Avatar className="h-8 w-8 rounded-lg grayscale">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{extendedSession.user.fullName}</span>
                      <span className="text-muted-foreground truncate text-xs">
                        {extendedSession.user.email}
                      </span>
                    </div>
                    <EllipsisVertical className="ml-auto size-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  side="bottom"
                  align="end"
                  className="w-56 bg-background border border-border rounded-md shadow-md p-2"
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{extendedSession.user.fullName}</span>
                        <span className="text-muted-foreground truncate text-xs">
                          {extendedSession.user.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to="/user" className="flex items-center gap-2">
                      <UserRound className="mr-2" />
                      Account
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOutIcon className="mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* <span className="text-sm font-medium">
                Welcome, {extendedSession.user.fullName}</span>
                <Button variant="outline" size="sm"  onClick={handleSignOut}><LogOut/>Sign Out</Button> */}
                </>
            ) : (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link to={auth.login.url}>{auth.login.title}</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to={auth.signup.url}>{auth.signup.title}</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to={logo.url} className="flex items-center gap-2">
              <img
                src={logo.src}
                className="max-h-8 dark:invert"
                alt={logo.alt}
              />
            </Link >
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link to={logo.url} className="flex items-center gap-2">
                      <img
                        src={logo.src}
                        className="max-h-8 dark:invert"
                        alt={logo.alt}
                      />
                    </Link >
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {filteredMenu.map((item) => renderMobileMenuItem(item, extendedSession))}
                  </Accordion>

                <div className="flex items-center gap-3">
                  {isPending ? (
                    <span className="text-sm"><Spinner/></span>
                  ): extendedSession ? (
                    <>
                        <div className="border-b pb-3">
                          <p className="text-sm font-medium">
                            {extendedSession.user.fullName || extendedSession.user.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {extendedSession.user.email}
                          </p>
                        </div>
                        <Button variant="outline" onClick={handleSignOut}> <LogOut/>Sign Out</Button>
                      </>
                    ) : (
                      <>
                        <Button asChild variant="outline">
                          <Link to={auth.login.url}>{auth.login.title}</Link>
                        </Button>
                        <Button asChild>
                          <Link to={auth.signup.url}>{auth.signup.title}</Link>
                        </Button>
                      </>
                    )}
                  </div>  
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem, session: ExtendedSession | null) => {
  if (item.items) {
    const filteredSubItems = item.items.filter((subItem) => {
      if (!session && subItem.requiredRole) return false;
      if (!subItem.requiredRole) return true;
      const roles = Array.isArray(subItem.requiredRole) ? subItem.requiredRole : [subItem.requiredRole];
      return roles.some((role) => session?.user?.role?.includes(role));
    });

    // Don't render menu item if no sub-items are visible
    if (filteredSubItems.length === 0) return null;
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {filteredSubItems.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="bg-background hover:bg-muted hover:text-accent-foreground group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem, session: ExtendedSession | null) => {
  if (item.items) {
     const filteredSubItems = item.items.filter((subItem) => {
      if (!session && subItem.requiredRole) return false;
      if (!subItem.requiredRole) return true;
      const roles = Array.isArray(subItem.requiredRole) ? subItem.requiredRole : [subItem.requiredRole];
      return roles.some((role) => session?.user?.role?.includes(role));
    });

    // Don't render menu item if no sub-items are visible
    if (filteredSubItems.length === 0) return null;

    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {filteredSubItems.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link key={item.title} to={item.url} className="text-md font-semibold">
      {item.title}
    </Link >
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <Link
      className="hover:bg-muted hover:text-accent-foreground flex min-w-80 select-none flex-row gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors"
      to={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-muted-foreground text-sm leading-snug">
            {item.description}
          </p>
        )}
      </div>
    </Link >
  );
};

export { Navbar1 };
