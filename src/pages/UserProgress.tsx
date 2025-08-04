import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Award, TrendingUp, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface UserProgressData {
  class_id: string;
  class_title: string;
  class_image_url: string;
  completed_lessons: number;
  total_lessons: number;
  progress_percentage: number;
  last_accessed: string;
}

const UserProgress = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState<UserProgressData[]>([]);
  const [stats, setStats] = useState({
    totalClasses: 0,
    completedClasses: 0,
    totalLessons: 0,
    completedLessons: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchUserProgress();
  }, [user, navigate]);

  const fetchUserProgress = async () => {
    if (!user) return;

    try {
      // Fetch user progress with class details
      const { data: progressQuery, error } = await supabase
        .from('user_progress')
        .select(`
          class_id,
          lesson_id,
          completed_at,
          bible_classes (
            title,
            image_url,
            total_lessons
          ),
          lessons (
            lesson_order
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      // Process the data to calculate progress per class
      const classProgress: { [key: string]: UserProgressData } = {};
      let totalCompletedLessons = 0;

      progressQuery?.forEach((progress: any) => {
        const classId = progress.class_id;
        
        if (!classProgress[classId]) {
          classProgress[classId] = {
            class_id: classId,
            class_title: progress.bible_classes?.title || 'Unknown Class',
            class_image_url: progress.bible_classes?.image_url || '',
            completed_lessons: 0,
            total_lessons: progress.bible_classes?.total_lessons || 0,
            progress_percentage: 0,
            last_accessed: progress.completed_at || new Date().toISOString(),
          };
        }

        if (progress.completed_at) {
          classProgress[classId].completed_lessons++;
          totalCompletedLessons++;
          
          // Update last accessed if this completion is more recent
          if (progress.completed_at > classProgress[classId].last_accessed) {
            classProgress[classId].last_accessed = progress.completed_at;
          }
        }
      });

      // Calculate progress percentages
      Object.values(classProgress).forEach((classData) => {
        if (classData.total_lessons > 0) {
          classData.progress_percentage = (classData.completed_lessons / classData.total_lessons) * 100;
        }
      });

      const progressArray = Object.values(classProgress);
      setProgressData(progressArray);

      // Calculate stats
      const completedClasses = progressArray.filter(p => p.progress_percentage === 100).length;
      const totalLessons = progressArray.reduce((sum, p) => sum + p.total_lessons, 0);

      setStats({
        totalClasses: progressArray.length,
        completedClasses,
        totalLessons,
        completedLessons: totalCompletedLessons,
      });
    } catch (error) {
      console.error('Error fetching user progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Will redirect to auth
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">My Progress</h1>
          <p className="text-muted-foreground text-lg">
            Track your Bible study journey and achievements
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClasses}</div>
              <p className="text-xs text-muted-foreground">
                Classes enrolled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Classes</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedClasses}</div>
              <p className="text-xs text-muted-foreground">
                Classes finished
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedLessons}</div>
              <p className="text-xs text-muted-foreground">
                Out of {stats.totalLessons} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalLessons > 0 ? Math.round((stats.completedLessons / stats.totalLessons) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Total completion
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Class Progress */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Class Progress</h2>
          
          {progressData.length === 0 ? (
            <Card className="text-center p-8">
              <CardContent>
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Classes Started Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start your Bible study journey by enrolling in a class
                </p>
                <Button onClick={() => navigate('/')}>
                  Browse Classes
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {progressData.map((classData) => (
                <Card key={classData.class_id} className="hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={classData.class_image_url || '/placeholder.svg'}
                      alt={classData.class_title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge variant={classData.progress_percentage === 100 ? 'default' : 'secondary'}>
                        {Math.round(classData.progress_percentage)}%
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-lg">{classData.class_title}</CardTitle>
                    <CardDescription>
                      {classData.completed_lessons} of {classData.total_lessons} lessons completed
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <Progress value={classData.progress_percentage} className="h-2" />
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Last accessed</span>
                        <span>
                          {new Date(classData.last_accessed).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => navigate(`/class/${classData.class_id}`)}
                      >
                        {classData.progress_percentage === 100 ? 'Review' : 'Continue'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProgress;