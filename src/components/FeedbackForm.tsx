
import { useState } from 'react';
import { MessageSquare, Send, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface FeedbackFormProps {
  onBack: () => void;
}

const FeedbackForm = ({ onBack }: FeedbackFormProps) => {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      toast({
        title: "Please enter your feedback",
        description: "We'd love to hear your thoughts!",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Feedback submitted!",
        description: "Thank you for helping us improve Tambii."
      });
      setFeedback('');
      setIsSubmitting(false);
      onBack();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-tambii-gray p-6">
      <Card className="modern-card border-0 shadow-xl rounded-3xl p-8 max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-tambii-dark flex items-center justify-center">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-tambii-dark mb-2">Share Feedback</h2>
          <p className="text-gray-600">Help us make Tambii better for everyone</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="feedback" className="block text-sm font-medium text-tambii-dark mb-2">
              Your Feedback
            </label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what you think about Tambii... What features would you like to see? What can we improve?"
              className="min-h-[120px] rounded-2xl border-gray-200 focus:border-tambii-dark focus:ring-tambii-dark"
              maxLength={500}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {feedback.length}/500
            </div>
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl py-3 bg-tambii-dark hover:bg-tambii-dark/90"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>

            <Button
              type="button"
              onClick={onBack}
              variant="outline"
              className="w-full rounded-2xl py-3"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default FeedbackForm;
