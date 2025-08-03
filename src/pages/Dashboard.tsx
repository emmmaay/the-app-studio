import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { StudySetCard } from "@/components/StudySetCard";

// Sample data - you can edit this easily
const studySets = [
  {
    id: 1,
    title: "Foundation Studies",
    description: "Core biblical foundations and principles for new believers and those wanting to strengthen their faith roots.",
    setNumber: 1,
    classCount: 4,
    enrolledCount: 340,
    imageUrl: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=500&q=80"
  },
  {
    id: 2,
    title: "Old Testament Survey",
    description: "Journey through the Old Testament exploring God's relationship with His people throughout history.",
    setNumber: 2,
    classCount: 4,
    enrolledCount: 285,
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&q=80"
  },
  {
    id: 3,
    title: "New Testament Survey",
    description: "Exploring the New Testament from the Gospels through Revelation and early church formation.",
    setNumber: 3,
    classCount: 4,
    enrolledCount: 412,
    imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500&q=80"
  },
  {
    id: 4,
    title: "Christian Living",
    description: "Practical Christian life applications for daily living, relationships, and spiritual growth.",
    setNumber: 4,
    classCount: 4,
    enrolledCount: 198,
    imageUrl: "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=500&q=80"
  },
  {
    id: 5,
    title: "Discipleship Training",
    description: "Growing in spiritual maturity and learning to disciple others in their faith journey.",
    setNumber: 5,
    classCount: 4,
    enrolledCount: 156,
  },
  {
    id: 6,
    title: "Leadership & Ministry",
    description: "Developing leadership and ministry skills for serving effectively in God's kingdom.",
    setNumber: 6,
    classCount: 4,
    enrolledCount: 89,
    imageUrl: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=500&q=80"
  }
];

export default function Dashboard() {
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studySets.map((set) => (
              <StudySetCard
                key={set.id}
                title={set.title}
                description={set.description}
                setNumber={set.setNumber}
                classCount={set.classCount}
                enrolledCount={set.enrolledCount}
                imageUrl={set.imageUrl}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Quick Access Section */}
      <section className="py-16 px-4 bg-content-warm/50">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            Quick <span className="text-primary">Access</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 gradient-card shadow-card rounded-lg hover:shadow-hover transition-spring cursor-pointer">
              <h3 className="text-lg font-semibold mb-2">Bible Characters</h3>
              <p className="text-muted-foreground text-sm">
                Explore the lives and lessons of key biblical figures
              </p>
            </div>
            <div className="p-6 gradient-card shadow-card rounded-lg hover:shadow-hover transition-spring cursor-pointer">
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