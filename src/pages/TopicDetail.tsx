import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Users, Clock, Plus, FolderOpen, FileText, ChevronRight } from "lucide-react";
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
  background_color: string;
}

interface Category {
  id: string;
  title: string;
  description: string;
  image_url: string;
  display_order: number;
  main_topic_id: string;
}

interface Content {
  id: string;
  title: string;
  description: string;
  content_type: string;
  display_order: number;
  parent_type: string;
  parent_id: string;
}

export default function TopicDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [topic, setTopic] = useState<MainTopic | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [contentMap, setContentMap] = useState<Record<string, Content[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (id) {
      fetchTopicData();
    }
  }, [id, user, navigate]);

  const fetchTopicData = async () => {
    try {
      // Fetch main topic
      const { data: topicData, error: topicError } = await supabase
        .from('main_topics')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (topicError) throw topicError;
      setTopic(topicData);

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('main_topic_id', id)
        .eq('is_active', true)
        .order('display_order');

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // Fetch content for each category
      const { data: contentData, error: contentError } = await supabase
        .from('content')
        .select('*')
        .eq('main_topic_id', id)
        .eq('is_active', true)
        .order('display_order');

      if (contentError) throw contentError;

      // Group content by parent_id
      const grouped = (contentData || []).reduce((acc, content) => {
        const key = content.parent_type === 'category' ? content.parent_id : `content_${content.parent_id}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(content);
        return acc;
      }, {} as Record<string, Content[]>);

      setContentMap(grouped);
    } catch (error) {
      console.error('Error fetching topic data:', error);
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

  const getContentIcon = (contentType: string) => {
    return contentType === 'subcategory' ? <FolderOpen className="h-4 w-4" /> : <FileText className="h-4 w-4" />;
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Topic Not Found</h1>
          <Button onClick={() => navigate('/study')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Topics
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      {/* Topic Header */}
      <section className="relative py-12 px-4 overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary-deep/90"
          style={{ backgroundColor: topic.background_color }}
        />
        {topic.image_url && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${topic.image_url})` }}
          />
        )}
        
        <div className="container mx-auto relative z-10">
          <Button 
            onClick={() => navigate('/study')} 
            variant="ghost" 
            className="text-primary-foreground hover:bg-white/20 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Topics
          </Button>
          
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge className={getDifficultyColor(topic.difficulty_level)}>
                  {topic.difficulty_level || 'Beginner'}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-primary-foreground border-white/30">
                  {categories.length} Classes
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                {topic.title}
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-6 max-w-3xl">
                {topic.description}
              </p>
              
              <div className="flex flex-wrap gap-6 text-primary-foreground/80">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{topic.instructor || 'Community Study'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{topic.duration_weeks || 8} weeks</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>{categories.length} classes</span>
                </div>
              </div>
            </div>
            
            {isAdmin && (
              <div className="flex gap-2">
                <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-primary-foreground border-white/30">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Class
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories/Classes Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Study <span className="text-primary">Classes</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore the different classes within this topic. Each class contains lessons and materials 
              to deepen your understanding.
            </p>
          </div>
          
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No classes available yet.</p>
              {isAdmin && (
                <Button className="mt-4" onClick={() => navigate(`/admin/topic/${id}`)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Class
                </Button>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => {
                const categoryContent = contentMap[category.id] || [];
                const lessonsCount = categoryContent.filter(c => c.content_type === 'lesson').length;
                const subcategoriesCount = categoryContent.filter(c => c.content_type === 'subcategory').length;
                
                return (
                  <Card 
                    key={category.id}
                    className="group cursor-pointer transition-all duration-300 hover:shadow-hover hover:-translate-y-1 gradient-card border-0 overflow-hidden"
                    onClick={() => navigate(`/category/${category.id}`)}
                  >
                    <div className="relative">
                      <div className="h-32 bg-gradient-to-br from-primary/20 to-primary-glow/30 relative overflow-hidden">
                        {category.image_url ? (
                          <img 
                            src={category.image_url} 
                            alt={category.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <FolderOpen className="h-8 w-8 text-primary/60" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {category.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        {lessonsCount > 0 && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            <span>{lessonsCount} lesson{lessonsCount !== 1 ? 's' : ''}</span>
                          </div>
                        )}
                        {subcategoriesCount > 0 && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FolderOpen className="h-4 w-4" />
                            <span>{subcategoriesCount} sub-class{subcategoriesCount !== 1 ? 'es' : ''}</span>
                          </div>
                        )}
                      </div>
                      
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary-deep w-full justify-between">
                        Explore Class
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}