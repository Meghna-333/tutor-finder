import List "mo:core/List";
import Types "../types/review";
import Common "../types/common";

module {
  public func submitReview(
    reviews : List.List<Types.Review>,
    nextId : Nat,
    req : Types.SubmitReviewRequest,
    reviewerId : Common.UserId,
    timestamp : Common.Timestamp,
  ) : Types.Review {
    let review : Types.Review = {
      id = nextId;
      tutorId = req.tutorId;
      reviewerId = reviewerId;
      rating = req.rating;
      comment = req.comment;
      createdAt = timestamp;
    };
    reviews.add(review);
    review
  };

  public func getReviewsForTutor(
    reviews : List.List<Types.Review>,
    tutorId : Common.TutorId,
  ) : [Types.Review] {
    reviews.toArray().filter(func(r : Types.Review) : Bool {
      r.tutorId == tutorId
    })
  };

  public func computeAverageRating(reviews : [Types.Review]) : Float {
    if (reviews.size() == 0) { return 0.0 };
    let total = reviews.foldLeft(0, func(acc : Nat, r : Types.Review) : Nat {
      acc + r.rating
    });
    total.toFloat() / reviews.size().toFloat()
  };
};
