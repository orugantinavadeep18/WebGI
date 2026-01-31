import { useState, useEffect } from "react";
import { Star, Send, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { apiCall } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export default function ReviewSystem({ propertyId, onReviewsUpdated }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [propertyId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      console.log(`📖 Fetching reviews for property: ${propertyId}`);
      
      let data;
      try {
        // Try properties endpoint first
        data = await apiCall(`/properties/${propertyId}/reviews`, {
          method: "GET",
        });
      } catch (err) {
        // Fallback to rentals endpoint
        console.log("Trying rentals endpoint...");
        data = await apiCall(`/rentals/${propertyId}/reviews`, {
          method: "GET",
        });
      }

      console.log(`✓ Reviews fetched:`, data);
      setReviews(data.reviews || []);

      // Calculate average rating
      if (data.reviews && data.reviews.length > 0) {
        const avg =
          data.reviews.reduce((sum, r) => sum + r.rating, 0) /
          data.reviews.length;
        setAvgRating(avg.toFixed(1));
      } else {
        setAvgRating(0);
      }
    } catch (error) {
      console.error("❌ Error fetching reviews:", error);
      toast.error("Failed to load reviews");
      setReviews([]);
      setAvgRating(0);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    try {
      console.log(`📝 Submitting review for property: ${propertyId}`);
      console.log(`User: ${user?.email}, Rating: ${rating}, Comment: ${comment}`);
      
      let reviewResponse;
      try {
        reviewResponse = await apiCall(`/properties/${propertyId}/reviews`, {
          method: "POST",
          body: JSON.stringify({
            rating,
            comment,
          }),
        });
      } catch (err) {
        console.log("Trying rentals endpoint...");
        reviewResponse = await apiCall(`/rentals/${propertyId}/reviews`, {
          method: "POST",
          body: JSON.stringify({
            rating,
            comment,
          }),
        });
      }

      console.log(`✓ Review submitted successfully!`);
      toast.success("Review submitted successfully!");
      
      // Add review to state without full page reload
      const newReview = {
        _id: reviewResponse.review._id,
        userId: user.id || user._id,
        rating: parseInt(rating),
        comment,
        userName: user.name || user.email,
        createdAt: new Date(),
      };
      
      setReviews([newReview, ...reviews]);
      
      // Update average rating
      const allReviews = [newReview, ...reviews];
      const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      setAvgRating(avg.toFixed(1));
      
      setComment("");
      setRating(5);
    } catch (error) {
      console.error("❌ Error submitting review:", error);
      toast.error(error.message || "Failed to submit review");
    }
  };

  const deleteReview = async (reviewId) => {
    if (!confirm("Delete this review?")) return;

    try {
      console.log(`🗑️ Deleting review: ${reviewId} from property: ${propertyId}`);
      
      try {
        await apiCall(`/properties/${propertyId}/reviews/${reviewId}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.log("Trying rentals endpoint...");
        await apiCall(`/rentals/${propertyId}/reviews/${reviewId}`, {
          method: "DELETE",
        });
      }

      console.log(`✓ Review deleted successfully!`);
      toast.success("Review deleted");
      
      // Remove review from state without full page reload
      const updatedReviews = reviews.filter(r => r._id !== reviewId);
      setReviews(updatedReviews);
      
      // Update average rating
      if (updatedReviews.length > 0) {
        const avg = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
        setAvgRating(avg.toFixed(1));
      } else {
        setAvgRating(0);
      }
    } catch (error) {
      console.error("❌ Error deleting review:", error);
      toast.error(error.message || "Failed to delete review");
    }
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Guest Reviews</h3>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(avgRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-2xl font-bold">{avgRating}</span>
            <span className="text-sm text-gray-600">
              ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
            </span>
          </div>
        </div>
      </div>

      {/* Submit Review Form */}
      {user && (
        <div className="bg-white p-6 rounded-lg border">
          <h4 className="font-bold mb-4">Share Your Experience</h4>
          <form onSubmit={submitReview} className="space-y-4">
            {/* Rating Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium mb-2">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this property..."
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm min-h-24"
              />
            </div>

            <Button type="submit" className="gap-2 w-full md:w-auto">
              <Send className="h-4 w-4" />
              Submit Review
            </Button>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h4 className="font-bold">All Reviews</h4>

        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <p>No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="bg-white p-4 rounded-lg border">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{review.userName || "Anonymous"}</p>
                    <p className="text-xs text-gray-600">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {(user?.id === review.userId || user?._id === review.userId) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteReview(review._id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <Badge variant="outline">{review.rating} stars</Badge>
              </div>

              <p className="text-sm text-gray-700">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
