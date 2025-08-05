import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, BookOpen, Users, Search, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      navigate('/auth');
    }
  };

  return (
    <nav className="gradient-primary shadow-elegant sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-primary-foreground" />
            <h1 className="text-xl font-bold text-primary-foreground">
              Bible Study Academy
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-primary-foreground/90 hover:text-primary-foreground transition-smooth">
              Classes
            </a>
            <a href="/characters" className="text-primary-foreground/90 hover:text-primary-foreground transition-smooth">
              Characters
            </a>
            <a href="/progress" className="text-primary-foreground/90 hover:text-primary-foreground transition-smooth">
              My Progress
            </a>
            {isAdmin && (
              <a href="/admin" className="text-primary-foreground/90 hover:text-primary-foreground transition-smooth">
                <Settings className="h-4 w-4 inline mr-1" />
                Admin
              </a>
            )}
            <Button variant="secondary" size="sm" onClick={handleAuthAction}>
              {user ? <LogOut className="h-4 w-4 mr-2" /> : <User className="h-4 w-4 mr-2" />}
              {user ? 'Sign Out' : 'Sign In'}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-primary-foreground hover:bg-white/10"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/20 py-4">
            <div className="flex flex-col space-y-3">
              <a href="/" className="text-primary-foreground/90 hover:text-primary-foreground transition-smooth">
                Classes
              </a>
              <a href="/characters" className="text-primary-foreground/90 hover:text-primary-foreground transition-smooth">
                Characters
              </a>
              <a href="/progress" className="text-primary-foreground/90 hover:text-primary-foreground transition-smooth">
                My Progress
              </a>
              {isAdmin && (
                <a href="/admin" className="text-primary-foreground/90 hover:text-primary-foreground transition-smooth">
                  <Settings className="h-4 w-4 inline mr-1" />
                  Admin
                </a>
              )}
              <Button variant="secondary" size="sm" className="w-fit" onClick={handleAuthAction}>
                {user ? <LogOut className="h-4 w-4 mr-2" /> : <User className="h-4 w-4 mr-2" />}
                {user ? 'Sign Out' : 'Sign In'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}