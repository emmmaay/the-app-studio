import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { StudySetCard } from "@/components/StudySetCard";
import { supabase } from "@/integrations/supabase/client";

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

export default function Dashboard() {
  const [classes, setClasses] = useState<BibleClass[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('main_topics')
        .select('*')
        .order('title');

      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      
      {/* Study Sets Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bible Study <span className="text-primary">Sets</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Progress through our carefully structured study sets, each containing 4 comprehensive classes 
              designed to build upon each other for deep understanding.
            </p>
          </div>
          
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 bg-muted rounded-lg mb-4"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : classes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No classes available yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((bibleClass, index) => (
                <StudySetCard
                  key={bibleClass.id}
                  title={bibleClass.title}
                  description={bibleClass.description}
                  setNumber={index + 1}
                  classCount={bibleClass.total_lessons}
                  enrolledCount={Math.floor(Math.random() * 400) + 50} // Random for demo
                  imageUrl={bibleClass.image_url || '/placeholder.svg'}
                  onClick={() => navigate(`/class/${bibleClass.id}`)}
                />
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
            <div 
              className="p-6 gradient-card shadow-card rounded-lg hover:shadow-hover transition-spring cursor-pointer"
              onClick={() => navigate('/characters')}
            >
              <h3 className="text-lg font-semibold mb-2">Bible Characters</h3>
              <p className="text-muted-foreground text-sm">
                Explore the lives and lessons of key biblical figures
              </p>
            </div>
            <div 
              className="p-6 gradient-card shadow-card rounded-lg hover:shadow-hover transition-spring cursor-pointer"
              onClick={() => navigate('/progress')}
            >
              <h3 className="text-lg font-semibold mb-2">My Progress</h3>
              <p className="text-muted-foreground text-sm">
                Track your study progress and completed lessons
              </p>
            </div>
            <div className="p-6 gradient-card shadow-card rounded-lg hover:shadow-hover transition-spring cursor-pointer">
              <h3 className="text-lg font-semibold mb-2">Study Notes</h3>
              <p className="text-muted-foreground text-sm">
                Access your personal notes and bookmarked lessons
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}