import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, BookOpen, Search, Filter } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface BibleCharacter {
  id: string;
  name: string;
  description: string;
  story_summary: string;
  key_verses: string[];
  image_url: string;
  testament: 'old' | 'new';
  category: string;
}

const BibleCharacters = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<BibleCharacter[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<BibleCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTestament, setSelectedTestament] = useState<'all' | 'old' | 'new'>('all');

  useEffect(() => {
    fetchCharacters();
  }, []);

  useEffect(() => {
    filterCharacters();
  }, [characters, searchTerm, selectedTestament]);

  const fetchCharacters = async () => {
    try {
      const { data, error } = await supabase
        .from('bible_characters')
        .select('*')
        .order('name');

      if (error) throw error;
      setCharacters((data || []) as BibleCharacter[]);
    } catch (error) {
      console.error('Error fetching characters:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCharacters = () => {
    let filtered = characters;

    if (searchTerm) {
      filtered = filtered.filter(character =>
        character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        character.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        character.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTestament !== 'all') {
      filtered = filtered.filter(character => character.testament === selectedTestament);
    }

    setFilteredCharacters(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-80 bg-muted rounded"></div>
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
          <h1 className="text-4xl font-bold mb-4">Bible Characters</h1>
          <p className="text-muted-foreground text-lg">
            Explore the lives and stories of key biblical figures
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search characters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedTestament === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedTestament('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={selectedTestament === 'old' ? 'default' : 'outline'}
                onClick={() => setSelectedTestament('old')}
                size="sm"
              >
                Old Testament
              </Button>
              <Button
                variant={selectedTestament === 'new' ? 'default' : 'outline'}
                onClick={() => setSelectedTestament('new')}
                size="sm"
              >
                New Testament
              </Button>
            </div>
          </div>
        </div>

        {/* Characters Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCharacters.map((character) => (
            <Card key={character.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                <img
                  src={character.image_url || '/placeholder.svg'}
                  alt={character.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant={character.testament === 'old' ? 'default' : 'secondary'}>
                    {character.testament === 'old' ? 'OT' : 'NT'}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{character.name}</CardTitle>
                  {character.category && (
                    <Badge variant="outline" className="text-xs">
                      {character.category}
                    </Badge>
                  )}
                </div>
                <CardDescription className="line-clamp-2">
                  {character.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {character.story_summary}
                  </p>
                  
                  {character.key_verses && character.key_verses.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Key Verses:</h4>
                      <div className="flex flex-wrap gap-1">
                        {character.key_verses.slice(0, 2).map((verse, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {verse}
                          </Badge>
                        ))}
                        {character.key_verses.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{character.key_verses.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4"
                    onClick={() => {
                      // Future: navigate to character detail page
                      console.log('View character details:', character.id);
                    }}
                  >
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCharacters.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No characters found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BibleCharacters;