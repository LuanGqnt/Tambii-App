
import { User, LogOut, Settings, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfileProps {
  onBack: () => void;
  onNavigateToSettings: () => void;
  onNavigateToFeedback: () => void;
}

const UserProfile = ({ onBack, onNavigateToSettings, onNavigateToFeedback }: UserProfileProps) => {
  const { user, userProfile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    onBack();
  };

  return (
    <div className="min-h-screen bg-tambii-gray p-6">
      <Card className="modern-card border-0 shadow-xl rounded-3xl p-8 max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-tambii-dark flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-tambii-dark mb-2">Profile</h2>
          <div className="text-center">
            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
              {userProfile?.username || user?.email}
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            onClick={onNavigateToSettings}
            variant="outline"
            className="w-full rounded-2xl py-3 border-tambii-dark text-tambii-dark hover:bg-tambii-dark hover:text-white"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>

          <Button
            onClick={onNavigateToFeedback}
            variant="outline"
            className="w-full rounded-2xl py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Share Feedback
          </Button>

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
