import Common "common";

module {
  public type ReviewId = Nat;

  public type Review = {
    id : ReviewId;
    tutorId : Common.TutorId;
    reviewerId : Common.UserId;
    rating : Nat; // 1-5
    comment : Text;
    createdAt : Common.Timestamp;
  };

  public type SubmitReviewRequest = {
    tutorId : Common.TutorId;
    rating : Nat;
    comment : Text;
  };
};
