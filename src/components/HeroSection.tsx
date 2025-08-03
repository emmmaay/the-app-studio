import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Award, Search } from "lucide-react";

export function HeroSection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        {/* Hero Content */}
        <div className="max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Deepen Your Faith Journey
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Discover comprehensive Bible studies designed to strengthen your understanding 
            and grow your relationship with God through structured, interactive learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gradient-primary shadow-elegant">
              <BookOpen className="h-5 w-5 mr-2" />
              Start Your Journey
            </Button>
            <Button variant="outline" size="lg">
              <Search className="h-5 w-5 mr-2" />
              Browse Studies
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="gradient-card shadow-card">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-primary mb-1">24</h3>
              <p className="text-muted-foreground">Comprehensive Classes</p>
            </CardContent>
          </Card>
          
          <Card className="gradient-card shadow-card">
            <CardContent className="p-6 text-center">
              <Users className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-primary mb-1">1,200+</h3>
              <p className="text-muted-foreground">Active Students</p>
            </CardContent>
          </Card>
          
          <Card className="gradient-card shadow-card">
            <CardContent className="p-6 text-center">
              <Award className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-primary mb-1">6</h3>
              <p className="text-muted-foreground">Study Sets</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}