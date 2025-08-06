import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Clock, ChevronRight, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface MainTopic {
  id: string;
  title: string;
  description: string;
  image_url: string;
  instructor: string;
  duration_weeks: number;
  difficulty_level: string;
  total_lessons: number;
  display_order: number;
  background_color: string;
  is_active: boolean;
}

interface Category {
  id: string;
  title: string;
  description: string;
  image_url: string;
  display_order: number;
  content_count: number;
}

export default function Study() {
  const [mainTopics, setMainTopics] = useState<MainTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchMainTopics();
  }, [user, navigate]);

  const fetchMainTopics = async () => {
    try {
      const { data, error } = await supabase
        .from('main_topics')
        .select(`
          *,
          categories(count)
        `)
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setMainTopics(data || []);
    } catch (error) {
      console.error('Error fetching main topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTopicIcon = (title: string) => {
    if (title.toLowerCase().includes('people') || title.toLowerCase().includes('character')) {
      return <Users className="h-5 w-5" />;
    }
    return <BookOpen className="h-5 w-5" />;
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Star className="h-4 w-4 text-primary-foreground" />
            <span className="text-primary-foreground text-sm font-medium">24 Comprehensive Study Topics</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
            Deepen Your <span className="text-primary-glow">Faith</span>
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8">
            Explore the Bible through structured study topics, each containing multiple classes and lessons 
            designed to build your understanding of God's Word.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center gap-2 text-primary-foreground/80">
              <BookOpen className="h-5 w-5" />
              <span>{mainTopics.length} Study Topics</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/80">
              <Users className="h-5 w-5" />
              <span>Community Learning</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/80">
              <Clock className="h-5 w-5" />
              <span>Self-Paced</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Topics Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Bible Study <span className="text-primary">Topics</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our carefully curated topics. Each topic contains multiple classes 
              that you can explore at your own pace.
            </p>
          </div>
          
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-64 bg-muted rounded-lg mb-4"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : mainTopics.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No study topics available yet.</p>
              <p className="text-muted-foreground text-sm">Check back soon for new content!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mainTopics.map((topic) => (
                <Card 
                  key={topic.id}
                  className="group cursor-pointer transition-all duration-300 hover:shadow-hover hover:-translate-y-1 gradient-card border-0 overflow-hidden"
                  onClick={() => navigate(`/topic/${topic.id}`)}
                >
                  <div className="relative">
                    <div 
                      className="h-48 bg-gradient-to-br from-primary/20 to-primary-glow/30 relative overflow-hidden"
                      style={{ backgroundColor: topic.background_color || '#f8f9fa' }}
                    >
                      {topic.image_url ? (
                        <img 
                          src={topic.image_url} 
                          alt={topic.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-primary/60">
                            {getTopicIcon(topic.title)}
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-4 right-4">
                        <Badge className={getDifficultyColor(topic.difficulty_level)}>
                          {topic.difficulty_level || 'Beginner'}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-1">{topic.title}</h3>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {topic.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{topic.instructor || 'Community Study'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{topic.duration_weeks || 8} weeks</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <BookOpen className="h-4 w-4" />
                          <span>{topic.total_lessons || 0} lessons</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary-deep">
                          Explore <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-16 px-4 bg-content-warm/50">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            Quick <span className="text-primary">Access</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card 
              className="p-6 gradient-card shadow-card hover:shadow-hover transition-spring cursor-pointer border-0"
              onClick={() => navigate('/characters')}
            >
              <Users className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Bible Characters</h3>
              <p className="text-muted-foreground text-sm">
                Explore the lives and lessons of key biblical figures
              </p>
            </Card>
            
            <Card 
              className="p-6 gradient-card shadow-card hover:shadow-hover transition-spring cursor-pointer border-0"
              onClick={() => navigate('/progress')}
            >
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">My Progress</h3>
              <p className="text-muted-foreground text-sm">
                Track your study progress and completed lessons
              </p>
            </Card>
            
            <Card className="p-6 gradient-card shadow-card hover:shadow-hover transition-spring cursor-pointer border-0">
              <Star className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Study Notes</h3>
              <p className="text-muted-foreground text-sm">
                Access your personal notes and bookmarked lessons
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}