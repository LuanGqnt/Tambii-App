
import { useState } from "react";
import { ArrowLeft, Plus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useSpots } from "@/hooks/useSpots";
import { useAuth } from "@/contexts/AuthContext";

interface AddSpotFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

const AddSpotForm = ({ onBack, onSuccess }: AddSpotFormProps) => {
  const { createSpot } = useSpots();
  const { userProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    image: "",
    description: "",
    tags: [] as string[]
  });
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.location || !formData.image || !formData.description) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createSpot({
        ...formData,
        likes: 0,
        comments: 0,
        author: userProfile?.username || 'Anonymous'
      });

      if (!result.error) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating spot:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-tambii-gray">
      {/* Header */}
      <header className="relative z-10 flex items-center p-6 modern-card mx-4 mt-4 rounded-3xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="h-10 w-10 p-0 rounded-2xl hover:bg-gray-100 mr-4"
        >
          <ArrowLeft className="w-5 h-5 text-tambii-dark" />
        </Button>
        <h1 className="text-2xl font-bold text-tambii-dark tracking-tight">
          Share a Spot
        </h1>
      </header>

      <div className="p-6">
        <Card className="modern-card border-0 shadow-lg rounded-3xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-tambii-dark mb-2">
                Spot Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter the name of the place"
                className="rounded-2xl border-gray-200"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-tambii-dark mb-2">
                Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City, Province or specific address"
                  className="rounded-2xl border-gray-200 pl-10"
                  required
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-tambii-dark mb-2">
                Image URL *
              </label>
              <Input
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                placeholder="https://example.com/image.jpg"
                type="url"
                className="rounded-2xl border-gray-200"
                required
              />
              {formData.image && (
                <div className="mt-3">
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-2xl"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-tambii-dark mb-2">
                Description *
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what makes this place special..."
                className="rounded-2xl border-gray-200 min-h-[100px]"
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-tambii-dark mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, index) => (
                  <Badge 
                    key={index}
                    variant="secondary" 
                    className="bg-tambii-dark text-white rounded-full px-3 py-1 cursor-pointer hover:bg-tambii-dark/80"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag (e.g., beach, food, adventure)"
                  className="rounded-2xl border-gray-200"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addTag}
                  variant="outline"
                  className="rounded-2xl px-4"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !formData.name || !formData.location || !formData.image || !formData.description}
              className="w-full bg-tambii-dark hover:bg-tambii-dark/90 text-white rounded-2xl py-3 text-base font-medium"
            >
              {isSubmitting ? 'Sharing...' : 'Share Spot'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddSpotForm;
