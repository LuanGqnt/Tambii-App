import { useState } from 'react';
import { ArrowLeft, User, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UserSettingsProps {
  onBack: () => void;
}

const UserSettings = ({ onBack }: UserSettingsProps) => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: userProfile?.username || '',
    email: user?.email || '',
  });
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [rewritePasswordInput, setRewritePasswordInput] = useState<string>("");

  const handleInputChange = async (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    // Check if password matches with the second password
    if(passwordInput !== rewritePasswordInput) {
      toast({
        title: "Update error",
        description: "The password doesn't match",
        variant: "destructive",
      });
      return;
    }

    // Check if password is correct
    const user_ = supabase.auth.getUser();

    const { data, error} = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: passwordInput,
    });

    if(error) {
      toast({
        title: "Update error",
        description: "Incorrect password",
        variant: "destructive",
      });
      return;
    }

    formData.username = formData.username.trim();

    // Rule 1: No spaces in the username
    if (/\s/.test(formData.username)) {
      toast({
        title: "Update error",
        description: "Username cannot contain spaces.",
        variant: "destructive",
      });
      return;
    }

    // Rule 2: Check if username already exists
    const { data: existingUsers, error: fetchError } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', formData.username)
      .limit(1);

    if (fetchError) {
      toast({
        title: "Update error",
        description: "Failed to validate username. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (existingUsers && existingUsers.length > 0) {
      toast({
        title: "Update error",
        description: "Username already taken.",
        variant: "destructive",
      });
      return;
    }
  
    setLoading(true);
    try {
      // Update profile in the profiles table
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Profile updated!",
        description: "Your profile information has been saved successfully.",
      });

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-tambii-gray p-6">
      <Card className="modern-card border-0 shadow-xl rounded-3xl p-8 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-10 w-10 p-0 rounded-2xl hover:bg-gray-100 mr-4"
          >
            <ArrowLeft className="w-5 h-5 text-tambii-dark" />
          </Button>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-2xl bg-tambii-dark flex items-center justify-center mr-3">
              <User className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-tambii-dark">Settings</h2>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-tambii-dark font-medium">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="Enter your username"
              className="rounded-2xl border-gray-200 focus:border-tambii-dark"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-tambii-dark font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              disabled
              className="rounded-2xl border-gray-200 bg-gray-50 text-gray-500"
            />
            <p className="text-sm text-gray-500">
              Email cannot be changed
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-tambii-dark font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter your password"
              className="rounded-2xl border-gray-200 focus:border-tambii-dark"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="retype_password" className="text-tambii-dark font-medium">
              Retype Password
            </Label>
            <Input
              id="retype_password"
              type="password"
              value={rewritePasswordInput}
              onChange={(e) => setRewritePasswordInput(e.target.value)}
              placeholder="Enter your password again"
              className="rounded-2xl border-gray-200 focus:border-tambii-dark"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={loading || !formData.username.trim()}
            className="w-full bg-tambii-dark hover:bg-tambii-dark/90 rounded-2xl py-3"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default UserSettings;
