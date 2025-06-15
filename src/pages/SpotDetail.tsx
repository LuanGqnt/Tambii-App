import { ArrowLeft, MapPin, User, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import { useSpots } from "@/hooks/useSpots";
import { useAuth } from "@/contexts/AuthContext"; 
import { SpotData } from "@/types/spot";
import { supabase } from "@/integrations/supabase/client";
import RatingStars from "@/components/RatingStars";
import { useState, useEffect } from "react";

const COMMENTS_LIMIT = 5;

export interface ReviewData {
  id: string;
  user_id: string;
  spot_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

const SpotDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, userProfile } = useAuth();
  const {
    spots,
    loading,
    fetchSpots,
    userReviews,
    submitReview,
    hasUserReviewed,
    fetchReviewsOfSpot,
    reviewsOfSpot,
    fetchUserReviews
  } = useSpots();

  const [spot, setSpot] = useState<SpotData | null>(null);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [ratingInput, setRatingInput] = useState<number | null>(null);
  const [commentInput, setCommentInput] = useState<string>("");

  useEffect(() => {
    if (!loading && spots.length > 0 && id) {
      const foundSpot = spots.find((s) => s.id === id);
      setSpot(foundSpot || null);
      if (foundSpot) {
        setAverageRating(foundSpot.average_rating || 0);
        setReviewCount(foundSpot.review_count || 0);
        fetchReviewsOfSpot(foundSpot.id);
      }
    }
    // eslint-disable-next-line
  }, [id, spots, loading]);

  useEffect(() => {
    if (!id) return;
    if (reviewsOfSpot[id]) {
      setReviews(reviewsOfSpot[id]);
    }
  }, [reviewsOfSpot, id]);

  // Submission of user's review
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spot || ratingInput == null) return;
    await submitReview(spot.id, ratingInput, commentInput);
    setShowReviewForm(false);
    setRatingInput(null);
    setCommentInput("");
    fetchSpots();
    fetchReviewsOfSpot(spot.id);
    fetchUserReviews();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-tambii-gray flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-tambii-dark flex items-center justify-center">
            <MapPin className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!spot) {
    return (
      <div className="min-h-screen bg-tambii-gray flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-tambii-dark mb-2">Spot not found</h2>
          <p className="text-gray-600 mb-4">The spot you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')} className="bg-tambii-dark hover:bg-tambii-dark/90">
            Go back home
          </Button>
        </div>
      </div>
    );
  }

  const userReview = user ? userReviews[spot.id] : null;
  const canComment = !!userReview;

  return (
    <div className="min-h-screen bg-tambii-gray">
      {/* Header */}
      <header className="relative z-10 flex items-center p-6 modern-card mx-4 mt-4 rounded-3xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="h-10 w-10 p-0 rounded-2xl hover:bg-gray-100 mr-4"
        >
          <ArrowLeft className="w-5 h-5 text-tambii-dark" />
        </Button>
        <h1 className="text-xl font-bold text-tambii-dark tracking-tight">{spot.name}</h1>
      </header>

      <div className="p-6 space-y-6">
        {/* Main Image */}
        <Card className="modern-card border-0 shadow-xl rounded-3xl overflow-hidden">
          <div className="relative h-80">
            <img 
              src={spot.image} 
              alt={spot.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Ratings overlay */}
            <div className="absolute top-4 right-4">
              <RatingStars rating={spot.average_rating || 0} />
              <span className="text-xs text-gray-700">{spot.review_count || 0} reviews</span>
            </div>
          </div>
        </Card>

        {/* Spot Information */}
        <Card className="modern-card border-0 shadow-lg rounded-2xl p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-3xl font-bold text-tambii-dark mb-3 tracking-tight">{spot.name}</h2>
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">{spot.location}</span>
              </div>
              {spot.author && (
                <div className="flex items-center text-gray-500 mb-4">
                  <User className="w-4 h-4 mr-2" />
                  <span className="text-sm">Posted by {spot.author}</span>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-tambii-dark mb-2">Description</h3>
              <p className="text-gray-700 text-base leading-relaxed">
                {spot.description}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-tambii-dark mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {spot.tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full px-3 py-1 text-sm font-medium"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Review Section */}
        <Card className="modern-card border-0 shadow-lg rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-tambii-dark">
              Reviews ({reviewCount})
            </h3>
            {!userReview && user && (
              <Button
                onClick={() => setShowReviewForm((s) => !s)}
                variant="default"
                size="sm"
                className="rounded-full"
              >
                Leave a Review
              </Button>
            )}
          </div>
          
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="mb-6">
              <div className="mb-2 flex items-center space-x-2">
                {[1,2,3,4,5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRatingInput(star)}
                    className={`p-1 ${ratingInput && ratingInput >= star ? "text-yellow-400" : "text-gray-300"}`}
                  >
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill={ratingInput && ratingInput >= star ? "#facc15" : "none"} stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                ))}
              </div>
              <Input
                className="mb-2"
                placeholder="Write your review (optional)..."
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
              />
              <Button type="submit" disabled={ratingInput == null}>Submit Review</Button>
            </form>
          )}

          {/* List reviews */}
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review, idx) => (
                <div key={review.id || idx} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-tambii-dark">
                          {review.user_id === user?.id ? "You" : (review.author ?? `User ${idx + 1}`)}
                        </span>
                        <RatingStars rating={review.rating} />
                        <span className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                      </div>
                      {review.comment &&
                        <p className="text-sm text-gray-700">{review.comment}</p>
                      }
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                No reviews yet. Be the first to share your thoughts!
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SpotDetail;
