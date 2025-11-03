import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavigationHeader from '@/components/NavigationHeader';
import HomestayCard from '@/components/HomestayCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { useAppContext } from '@/contexts/AppContext';
import { Search, SlidersHorizontal } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Homestay {
  id: string;
  title: string;
  location: string;
  rating: number;
  price: number;
  host: string;
  guests: number;
  amenities: string[];
  image: string;
}

const Homestays = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(searchQuery, 500);
  const { addToSearchHistory } = useAppContext();

  useEffect(() => {
    fetchHomestays();
  }, [debouncedSearch, priceRange]);

  const fetchHomestays = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('homestays')
        .select('*');

      // Search by location or title
      if (debouncedSearch) {
        query = query.or(`location.ilike.%${debouncedSearch}%,title.ilike.%${debouncedSearch}%`);
      }

      // Filter by price range
      query = query
        .gte('price_per_night', priceRange[0])
        .lte('price_per_night', priceRange[1]);

      const { data, error } = await query;

      if (error) throw error;

      // Transform data to match component props
      const transformedData: Homestay[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        location: item.location,
        rating: Number(item.rating),
        price: Number(item.price_per_night),
        host: item.host_name,
        guests: item.max_guests,
        amenities: item.amenities || [],
        image: item.image_url || ''
      }));

      setHomestays(transformedData);
    } catch (error) {
      console.error('Error fetching homestays:', error);
      toast.error('Failed to load homestays');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedSearch) {
      addToSearchHistory(debouncedSearch);
    }
  }, [debouncedSearch, addToSearchHistory]);

  const filteredHomestays = homestays;

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-display font-bold mb-4">Find Your Perfect Homestay</h1>
            <p className="text-xl text-muted-foreground">Discover authentic accommodations around the world</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-card rounded-2xl shadow-travel p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by location or homestay name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12"
                />
              </div>
              <Button variant="outline" className="h-12">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-muted-foreground">
              {loading ? 'Loading...' : `${filteredHomestays.length} homestays found`}
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 bg-muted animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredHomestays.map((homestay) => (
                  <Link key={homestay.id} to={`/homestay/${homestay.id}`}>
                    <HomestayCard {...homestay} />
                  </Link>
                ))}
              </div>

              {filteredHomestays.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-xl text-muted-foreground">No homestays found matching your criteria</p>
                  <Button onClick={() => setSearchQuery('')} className="mt-4">Clear Search</Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Homestays;
