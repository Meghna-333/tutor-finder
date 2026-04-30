import Common "common";

module {
  public type TutorId = Common.TutorId;

  public type Tutor = {
    id : TutorId;
    name : Text;
    subjects : [Text];
    experienceYears : Nat;
    rating : Float;
    reviewCount : Nat;
    distanceKm : Float;
    pricePerHour : Nat;
    isVerified : Bool;
    imageUrl : Text;
    phone : Text;
    email : Text;
  };

  public type TutorFilter = {
    subjects : ?[Text];
    maxBudget : ?Nat;
    location : ?Text;
    mode : ?Common.LearningMode;
  };
};
