import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Edit, Trash2, Users, Book, User } from 'lucide-react';

interface BibleClass {
  id: string;
  title: string;
  description: string;
  instructor: string;
  difficulty_level: string;
  duration_weeks: number;
  total_lessons: number;
  image_url: string;
}

interface BibleCharacter {
  id: string;
  name: string;
  description: string;
  testament: string;
  category: string;
  story_summary: string;
  image_url: string;
}

interface AdminUser {
  id: string;
  email: string;
  display_name: string;
  role: string;
}

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [classes, setClasses] = useState<BibleClass[]>([]);
  const [characters, setCharacters] = useState<BibleCharacter[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [classForm, setClassForm] = useState({
    title: '',
    description: '',
    instructor: '',
    difficulty_level: 'beginner',
    duration_weeks: 8,
    total_lessons: 12,
    image_url: ''
  });

  const [characterForm, setCharacterForm] = useState({
    name: '',
    description: '',
    testament: 'Old Testament',
    category: '',
    story_summary: '',
    image_url: ''
  });

  const [newAdminEmail, setNewAdminEmail] = useState('');

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/');
      return;
    }
    
    if (isAdmin) {
      fetchData();
    }
  }, [user, isAdmin, loading, navigate]);

  const fetchData = async () => {
    try {
      // Fetch classes
      const { data: classesData } = await supabase
        .from('main_topics')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch characters
      const { data: charactersData } = await supabase
        .from('bible_characters')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch admin users - simplified
      const { data: adminsData } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          profiles(display_name)
        `)
        .eq('role', 'admin');

      setClasses(classesData || []);
      setCharacters(charactersData || []);
      
      // Transform admin data - simplified
      const adminUsers = (adminsData || []).map((admin: any) => ({
        id: admin.user_id,
        email: 'Admin User', // Simplified - we can't easily get email from client
        display_name: admin.profiles?.display_name || 'No display name',
        role: admin.role
      }));
      
      setAdmins(adminUsers);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createClass = async () => {
    try {
      const { error } = await supabase
        .from('main_topics')
        .insert([classForm]);

      if (error) throw error;

      toast({ title: 'Success', description: 'Bible class created successfully' });
      setClassForm({
        title: '',
        description: '',
        instructor: '',
        difficulty_level: 'beginner',
        duration_weeks: 8,
        total_lessons: 12,
        image_url: ''
      });
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const createCharacter = async () => {
    try {
      const { error } = await supabase
        .from('bible_characters')
        .insert([characterForm]);

      if (error) throw error;

      toast({ title: 'Success', description: 'Bible character created successfully' });
      setCharacterForm({
        name: '',
        description: '',
        testament: 'Old Testament',
        category: '',
        story_summary: '',
        image_url: ''
      });
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const addAdmin = async () => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert([{ 
          user_id: newAdminEmail, // This will need to be updated with proper user lookup
          role: 'admin' 
        }]);

      if (error) {
        toast({ 
          title: 'Error', 
          description: 'Failed to add admin. Make sure the user exists and email is correct.',
          variant: 'destructive' 
        });
        return;
      }

      toast({ title: 'Success', description: 'Admin added successfully' });
      setNewAdminEmail('');
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your Bible study platform</p>
        </div>

        <Tabs defaultValue="classes" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="classes">Bible Classes</TabsTrigger>
            <TabsTrigger value="characters">Bible Characters</TabsTrigger>
            <TabsTrigger value="admins">Admin Users</TabsTrigger>
          </TabsList>

          <TabsContent value="classes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create New Bible Class
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={classForm.title}
                      onChange={(e) => setClassForm({...classForm, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="instructor">Instructor</Label>
                    <Input
                      id="instructor"
                      value={classForm.instructor}
                      onChange={(e) => setClassForm({...classForm, instructor: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select value={classForm.difficulty_level} onValueChange={(value) => setClassForm({...classForm, difficulty_level: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      value={classForm.image_url}
                      onChange={(e) => setClassForm({...classForm, image_url: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={classForm.description}
                    onChange={(e) => setClassForm({...classForm, description: e.target.value})}
                  />
                </div>
                <Button onClick={createClass} className="w-full">
                  Create Bible Class
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {classes.map((bibleClass) => (
                <Card key={bibleClass.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{bibleClass.title}</h3>
                        <p className="text-sm text-muted-foreground">by {bibleClass.instructor}</p>
                        <Badge variant="secondary">{bibleClass.difficulty_level}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="characters" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Bible Character
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="char_name">Name</Label>
                    <Input
                      id="char_name"
                      value={characterForm.name}
                      onChange={(e) => setCharacterForm({...characterForm, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="testament">Testament</Label>
                    <Select value={characterForm.testament} onValueChange={(value) => setCharacterForm({...characterForm, testament: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Old Testament">Old Testament</SelectItem>
                        <SelectItem value="New Testament">New Testament</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={characterForm.category}
                      onChange={(e) => setCharacterForm({...characterForm, category: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="char_image">Image URL</Label>
                    <Input
                      id="char_image"
                      value={characterForm.image_url}
                      onChange={(e) => setCharacterForm({...characterForm, image_url: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="char_description">Description</Label>
                  <Textarea
                    id="char_description"
                    value={characterForm.description}
                    onChange={(e) => setCharacterForm({...characterForm, description: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="story_summary">Story Summary</Label>
                  <Textarea
                    id="story_summary"
                    value={characterForm.story_summary}
                    onChange={(e) => setCharacterForm({...characterForm, story_summary: e.target.value})}
                  />
                </div>
                <Button onClick={createCharacter} className="w-full">
                  Add Bible Character
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {characters.map((character) => (
                <Card key={character.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{character.name}</h3>
                        <p className="text-sm text-muted-foreground">{character.testament}</p>
                        {character.category && (
                          <Badge variant="outline">{character.category}</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="admins" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Add New Admin
                </CardTitle>
                <CardDescription>
                  Enter the email of an existing user to make them an admin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="admin_email">Email Address</Label>
                  <Input
                    id="admin_email"
                    type="email"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="user@example.com"
                  />
                </div>
                <Button onClick={addAdmin} className="w-full">
                  Add Admin
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Admins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {admins.map((admin) => (
                    <div key={admin.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5" />
                        <div>
                          <p className="font-medium">{admin.display_name || 'No display name'}</p>
                          <p className="text-sm text-muted-foreground">{admin.email}</p>
                        </div>
                      </div>
                      <Badge>Admin</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;