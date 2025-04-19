import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function MainNavigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  // Handle scroll events for transparent/solid header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm" 
          : "bg-white dark:bg-gray-900"
      }`}
    >
      {/* Skip to content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:bg-primary focus:text-white focus:z-50 focus:p-4 focus:m-4 focus:rounded-md"
      >
        Skip to content
      </a>
      
      <div className="container px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-md bg-gradient-to-r from-primary to-[#0fae96] flex items-center justify-center text-white font-bold mr-2">
              AW
            </div>
            <span className="font-bold text-xl tracking-tight">
              AccessWeb<span className="text-primary">Pro</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink 
                  className={navigationMenuTriggerStyle()} 
                  onClick={() => window.location.href = '/'}
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:grid-cols-2">
                    <li>
                      <Link href="/tools/checker">
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">WCAG Checker</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Test websites against WCAG accessibility standards
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/tools/colors">
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Color Palette</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Create and test accessible color combinations
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/tools/images">
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Image Alt Checker</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Find and fix missing image alternative text
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/tools/standards">
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">WCAG Reference</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Detailed guide to WCAG 2.1 success criteria
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Integrations</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:grid-cols-2">
                    <li>
                      <Link href="/integrations/shopify">
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Shopify</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Improve accessibility in Shopify themes
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/integrations/wordpress">
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">WordPress</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Enhance WordPress site accessibility
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/integrations/api">
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">API</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Integrate accessibility checks into your workflow
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/integrations/enterprise">
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Enterprise</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Custom solutions for larger organizations
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:grid-cols-2">
                    <li>
                      <Link href="/resources/documentation">
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Documentation</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Technical guides and API documentation
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/resources/blog">
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Blog</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Latest accessibility news and best practices
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/resources/guides">
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Guides</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Step-by-step tutorials for implementing accessibility
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/resources/help">
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Help Center</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            FAQs and troubleshooting assistance
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/pricing">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Pricing
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            
            <Link href="/signup">
              <Button variant="default" className="bg-gradient-to-r from-[#0066FF] to-[#0fae96] hover:from-[#0052cc] hover:to-[#0c9a86] border-none rounded-full">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <nav className="flex flex-col gap-4 mt-6">
                <Link href="/">
                  <Button variant="ghost" className="w-full justify-start">Home</Button>
                </Link>
                
                <div className="space-y-1">
                  <div className="font-medium text-sm px-4 py-2">Tools</div>
                  <Link href="/tools/checker">
                    <Button variant="ghost" className="w-full justify-start pl-6">WCAG Checker</Button>
                  </Link>
                  <Link href="/tools/colors">
                    <Button variant="ghost" className="w-full justify-start pl-6">Color Palette</Button>
                  </Link>
                  <Link href="/tools/images">
                    <Button variant="ghost" className="w-full justify-start pl-6">Image Alt Checker</Button>
                  </Link>
                  <Link href="/tools/standards">
                    <Button variant="ghost" className="w-full justify-start pl-6">WCAG Reference</Button>
                  </Link>
                </div>
                
                <div className="space-y-1">
                  <div className="font-medium text-sm px-4 py-2">Integrations</div>
                  <Link href="/integrations/shopify">
                    <Button variant="ghost" className="w-full justify-start pl-6">Shopify</Button>
                  </Link>
                  <Link href="/integrations/wordpress">
                    <Button variant="ghost" className="w-full justify-start pl-6">WordPress</Button>
                  </Link>
                  <Link href="/integrations/api">
                    <Button variant="ghost" className="w-full justify-start pl-6">API</Button>
                  </Link>
                  <Link href="/integrations/enterprise">
                    <Button variant="ghost" className="w-full justify-start pl-6">Enterprise</Button>
                  </Link>
                </div>
                
                <div className="space-y-1">
                  <div className="font-medium text-sm px-4 py-2">Resources</div>
                  <Link href="/resources/documentation">
                    <Button variant="ghost" className="w-full justify-start pl-6">Documentation</Button>
                  </Link>
                  <Link href="/resources/blog">
                    <Button variant="ghost" className="w-full justify-start pl-6">Blog</Button>
                  </Link>
                  <Link href="/resources/guides">
                    <Button variant="ghost" className="w-full justify-start pl-6">Guides</Button>
                  </Link>
                  <Link href="/resources/help">
                    <Button variant="ghost" className="w-full justify-start pl-6">Help Center</Button>
                  </Link>
                </div>
                
                <Link href="/pricing">
                  <Button variant="ghost" className="w-full justify-start">Pricing</Button>
                </Link>
                
                <div className="pt-6 space-y-3">
                  <Link href="/login">
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full bg-gradient-to-r from-[#0066FF] to-[#0fae96] hover:from-[#0052cc] hover:to-[#0c9a86] border-none rounded-full">
                      Start Free Trial
                    </Button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}