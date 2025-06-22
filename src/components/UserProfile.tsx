
import { useState } from 'react';
import { User, LogOut, Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useSpots } from '@/hooks/useSpots';
import { useToast } from '@/hooks/use-toast';

interface UserProfileProps {
  onBack: () => void;
  onNavigateToSettings: () => void;
}

const UserProfile = ({ onBack, onNavigateToSettings }: UserProfileProps) => {
  const { user, userProfile, signOut } = useAuth();
  const { seedMockData } = useSpots();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    onBack();
  };

  const handleSeedData = async () => {
    setLoading(true);
    try {
      await seedMockData();
      toast({
        title: "Demo spots added!",
        description: "Some sample spots have been created for you to explore."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add demo spots.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-tambii-gray p-6">
      <Card className="modern-card border-0 shadow-xl rounded-3xl p-8 max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-tambii-dark flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-tambii-dark mb-2">Profile</h2>
          <p className="text-gray-600">{userProfile?.username || user?.email}</p>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
              {userProfile?.username || 'User'}
            </Badge>
          </div>

          <Button
            onClick={onNavigateToSettings}
            variant="outline"
            className="w-full rounded-2xl py-3 border-tambii-dark text-tambii-dark hover:bg-tambii-dark hover:text-white"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>

          {/* <Button
            onClick={handleSeedData}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 rounded-2xl py-3"
          >
            <Plus className="w-4 h-4 mr-2" />
            {loading ? 'Adding...' : 'Add Demo Spots'}
          </Button> */}

          <Button
            onClick={onBack}
            variant="outline"
            className="w-full rounded-2xl py-3"
          >
            Back to App
          </Button>

          <Button
            onClick={handleSignOut}
            variant="destructive"
            className="w-full rounded-2xl py-3"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default UserProfile;
