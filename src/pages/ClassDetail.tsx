import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Navigation } from '@/components/Navigation';
import { ArrowLeft, Play, Clock, BookOpen, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface BibleClass {
  id: string;
  title: string;
  description: string;
  image_url: string;
  instructor: string;
  duration_weeks: number;
  difficulty_level: string;
  total_lessons: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  lesson_order: number;
  duration_minutes: number;
}

const ClassDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bibleClass, setBibleClass] = useState<BibleClass | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchClassData();
    }
  }, [id, user]);

  const fetchClassData = async () => {
    try {
      // Fetch class details
      const { data: classData, error: classError } = await supabase
        .from('bible_classes')
        .select('*')
        .eq('id', id)
        .single();

      if (classError) throw classError;
      setBibleClass(classData);

      // Fetch lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('class_id', id)
        .order('lesson_order');

      if (lessonsError) throw lessonsError;
      setLessons(lessonsData || []);

      // Fetch user progress if logged in
      if (user) {
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('class_id', id);

        if (!progressError) {
          setUserProgress(progressData || []);
        }
      }
    } catch (error) {
      console.error('Error fetching class data:', error);
    } finally {
      setLoading(false);
    }
  };

  const completedLessons = userProgress.filter(p => p.completed_at).length;
  const progressPercentage = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!bibleClass) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <p>Class not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Classes
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative">
              <img 
                src={bibleClass.image_url || '/placeholder.svg'} 
                alt={bibleClass.title}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <Button size="lg" className="bg-white text-black hover:bg-white/90">
                  <Play className="h-5 w-5 mr-2" />
                  Start Course
                </Button>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold">{bibleClass.title}</h1>
                <Badge className={getDifficultyColor(bibleClass.difficulty_level)}>
                  {bibleClass.difficulty_level}
                </Badge>
              </div>
              
              <div className="flex items-center gap-6 text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {bibleClass.duration_weeks} weeks
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  {bibleClass.total_lessons} lessons
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {bibleClass.instructor}
                </div>
              </div>

              {user && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Your Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {completedLessons} / {lessons.length} lessons
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              )}

              <p className="text-muted-foreground leading-relaxed">
                {bibleClass.description}
              </p>
            </div>

            {/* Lessons List */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Course Content</h2>
              <div className="space-y-3">
                {lessons.map((lesson) => {
                  const isCompleted = userProgress.some(p => p.lesson_id === lesson.id && p.completed_at);
                  
                  return (
                    <Card key={lesson.id} className={`cursor-pointer hover:shadow-md transition-shadow ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium text-muted-foreground">
                                Lesson {lesson.lesson_order}
                              </span>
                              {isCompleted && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  Completed
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-semibold">{lesson.title}</h3>
                            {lesson.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {lesson.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {lesson.duration_minutes} min
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">What you'll learn</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Deep biblical understanding</li>
                    <li>• Historical context</li>
                    <li>• Practical application</li>
                    <li>• Character development</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Requirements</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Open heart and mind</li>
                    <li>• Bible (any translation)</li>
                    <li>• Notebook for reflection</li>
                  </ul>
                </div>

                {!user ? (
                  <Button 
                    onClick={() => navigate('/auth')} 
                    className="w-full"
                  >
                    Sign In to Track Progress
                  </Button>
                ) : (
                  <Button className="w-full">
                    Continue Learning
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetail;