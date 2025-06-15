import { useState, useEffect } from "react";
import { ArrowLeft, Heart, MessageCircle, MapPin, User, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import { useSpots } from "@/hooks/useSpots";
import { useAuth } from "@/contexts/AuthContext"; 
import { SpotData } from "@/types/spot";
import { supabase } from "@/integrations/supabase/client";

const COMMENTS_LIMIT = 5;

export interface CommentData {
    author: string;
    user_id: string;
    spot_id: string;
    comment: string;
    created_at: string;
};

const SpotDetail = () => {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const { spots, loading, fetchSpots, hasLikedSpot, toggleLike } = useSpots();
  const [spot, setSpot] = useState<SpotData | null>(null);
  const { user, userProfile } = useAuth();
  
  const [commentInput, setCommentInput] = useState<string>("");
  const [comments, setComments] = useState<CommentData[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [liveCommentCount, setLiveCommentCount] = useState<number>(0);

  const [liked, setLiked] = useState<Boolean>(false);

  const handleCommentSend = async () => {
    if (!user) return { error: 'User not authenticated' };
    if (!spot) return { error: 'No spot selected' };
    if(commentInput.trim() === "") return;

    const commentData = {
      author: userProfile?.username ?? 'Anonymous',
      user_id: user.id,
      spot_id: spot.id,
      comment: commentInput,
      created_at: new Date().toISOString(),
    };

    // Adds the comment to the database
    const { error: insertError } = await supabase
      .from("comments")
      .insert([commentData]);

    if (insertError) {
      console.error("Failed to insert comment:", insertError);
      alert("Error sending comment");
      return;
    }

    // Step 2: Count comments for the current spot
    // !! THIS COULD BE REFACTORED, THE PROBLEM HERE IS THAT IT'S ACTUALLY GETTING THE WHOLE COMMENTS??? IDK LOLOL
    const { count, error: countError } = await supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("spot_id", spot.id);

    if (countError || count === null) {
      console.error("Error counting comments:", countError);
      return;
    }

    // Step 3: Set comment_count to actual count
    const { error: updateError } = await supabase
      .from("spots")
      .update({ comments: count })
      .eq("id", spot.id);

    if (updateError) {
      console.error("Error updating comment count:", updateError);
      return;
    }

    console.log("Comment added successfully!");
    setCommentInput(""); // Clear the input field
    setLiveCommentCount(prev => prev + 1);

    // Optional: Refresh comments list
    fetchComments(true);
  };

  const fetchComments = async (initial = false) => {
    if (commentsLoading || (!initial && !hasMore)) return;
    setCommentsLoading(true);

    let query = supabase
      .from("comments")
      .select("*")
      .eq("spot_id", spot?.id)
      .order("created_at", { ascending: false }) // newest first
      .limit(COMMENTS_LIMIT);

    if (!initial && comments.length > 0) {
      const last = comments[comments.length - 1];
      query = query.lt("created_at", last.created_at);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Failed to load comments:", error.message);
    } else {
      if (initial) {
        setComments(data);
      } else {
        setComments((prev) => [...prev, ...data]);
      }

      // If fewer than limit, no more to load
      if (data.length < COMMENTS_LIMIT) {
        setHasMore(false);
      }
    }

    setCommentsLoading(false);
  };

  const timeAgo = (date: Date) => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals: [number, string][] = [
      [60, "second"],
      [60 * 60, "minute"],
      [60 * 60 * 24, "hour"],
      [60 * 60 * 24 * 30, "day"],
      [60 * 60 * 24 * 365, "month"],
      [Infinity, "year"],
    ];

    for (let i = 0; i < intervals.length; i++) {
      const [threshold, label] = intervals[i];

      if (seconds < threshold) {
        const divisor = i === 0 ? 1 : intervals[i - 1][0];
        const value = Math.floor(seconds / divisor);
        return `${value} ${label}${value !== 1 ? "s" : ""} ago`;
      }
    }

    return "Now";
  }

  // overriden
  // const hasUserLikedSpot = async (userId: string, spotId: string): Promise<boolean> => {
  //   const { data, error } = await supabase
  //     .from("likes")
  //     .select("id")
  //     .eq("user_id", userId)
  //     .eq("spot_id", spotId)
  //     .maybeSingle(); // we only care if one exists

  //   if (error) {
  //     console.error("Error checking like status:", error);
  //     setLiked(false);
  //     return;
  //   }

  //   setLiked(!!data); // true if a like entry exists
  // };

  const handleLikeClick = async () => {
    if(!user) return;
    if(!spot) return;

    await toggleLike(spot.id);
    fetchSpots(); 
  }
  
  useEffect(() => {
    if (!loading && spots.length > 0 && id) {
      // const foundSpot = spots.find(s => s.id === parseInt(id));
      const foundSpot = spots.find(s => s.id === id);
      setSpot(foundSpot || null);
    }    
  }, [id, spots, loading]);  

  // Fetching the comments
  useEffect(() => {
    if(!spot) {
      console.log('Spot is null');
      return;
    }

    setHasMore(true);
    fetchComments(true);
    setLiveCommentCount(spot.comments);

    if(hasLikedSpot(spot.id))
      setLiked(true);
    else
      setLiked(false);
  }, [spot]);

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
        <h1 className="text-xl font-bold text-tambii-dark tracking-tight">
          {spot.name}
        </h1>
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
            
            {/* Stats overlay */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <div 
                className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 cursor-pointer"
                onClick={handleLikeClick}  
              >
                <Heart className={liked ? "w-3 h-3 text-red-500 fill-current" : "w-3 h-3 text-red-500"} />
                <span className="text-xs font-medium text-gray-800">{spot.likes}</span>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                <MessageCircle className="w-3 h-3 text-blue-500" />
                <span className="text-xs font-medium text-gray-800">{liveCommentCount}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Spot Information */}
        <Card className="modern-card border-0 shadow-lg rounded-2xl p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-3xl font-bold text-tambii-dark mb-3 tracking-tight">
                {spot.name}
              </h2>
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

        {/* Comments Section */}
        <Card className="modern-card border-0 shadow-lg rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-tambii-dark mb-4">
            Comments ({liveCommentCount})
          </h3>
          
          {/* Mock comments for demonstration */}
          <div className="space-y-4">
            {comments.length > 0 ? (
              <>
                {comments.map((comment, index) => (
                    <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-tambii-dark">
                              {comment.author ?? `User ${index + 1}`}
                            </span>
                            <span className="text-xs text-gray-500">{timeAgo(new Date(comment.created_at))}</span> {/* Replace with actual timestamp if available */}
                          </div>
                          <p className="text-sm text-gray-700">
                            {comment.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                ))}

                {/* Load more comments */}
                {hasMore && (
                  <button
                    onClick={() => fetchComments()}
                    className="text-blue-500 text-sm hover:underline mt-2"
                  >
                    Load more comments
                  </button>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No comments yet. Be the first to share your thoughts!
              </p>
            )}
          </div>
          
          {/* Comment Box */}

          {user ? (
            <div className="mt-6 border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-tambii-dark mb-2">Leave a comment</h4>
              <div className="flex items-center space-x-2">
                <Input
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Write your thoughts here..."
                  className="flex-1"
                />
                <Button
                  onClick={handleCommentSend}
                  className="flex items-center gap-1 px-4"
                  variant="default"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : <></>}

        </Card>
      </div>
    </div>
  );
};

export default SpotDetail;
