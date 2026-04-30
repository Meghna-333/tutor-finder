import Time "mo:core/Time";
import List "mo:core/List";
import ReviewLib "../lib/review";
import TutorLib "../lib/tutor";
import ReviewTypes "../types/review";
import TutorTypes "../types/tutor";
import Common "../types/common";

mixin (
  reviews : List.List<ReviewTypes.Review>,
  reviewIdCounter : List.List<Nat>,
  tutors : List.List<TutorTypes.Tutor>,
) {
  public shared ({ caller }) func submitReview(req : ReviewTypes.SubmitReviewRequest) : async ReviewTypes.Review {
    let nextId = reviewIdCounter.at(0);
    let review = ReviewLib.submitReview(reviews, nextId, req, caller.toText(), Time.now());
    reviewIdCounter.put(0, nextId + 1);
    // Recompute tutor rating
    let tutorReviews = ReviewLib.getReviewsForTutor(reviews, req.tutorId);
    let newRating = ReviewLib.computeAverageRating(tutorReviews);
    TutorLib.updateTutorRating(tutors, req.tutorId, newRating, tutorReviews.size());
    review
  };

  public query func getReviews(tutorId : Common.TutorId) : async [ReviewTypes.Review] {
    ReviewLib.getReviewsForTutor(reviews, tutorId)
  };
};
