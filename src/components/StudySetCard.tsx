import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Clock } from "lucide-react";

interface StudySetCardProps {
  title: string;
  description: string;
  setNumber: number;
  classCount: number;
  enrolledCount: number;
  imageUrl?: string;
}

export function StudySetCard({ 
  title, 
  description, 
  setNumber, 
  classCount, 
  enrolledCount,
  imageUrl 
}: StudySetCardProps) {
  return (
    <Card className="gradient-card shadow-card hover:shadow-hover transition-spring group cursor-pointer">
      <div className="aspect-video bg-content-warm rounded-t-lg overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-content-warm to-content-accent">
            <BookOpen className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            Set {setNumber}
          </Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {classCount} classes
          </div>
        </div>
        <CardTitle className="text-lg group-hover:text-primary transition-smooth">
          {title}
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            {enrolledCount} students
          </div>
          <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
            Start Learning
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}