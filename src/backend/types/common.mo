module {
  public type TutorId = Nat;
  public type UserId = Text; // phone number or principal text
  public type Timestamp = Int;

  public type LearningMode = {
    #learnAtHome;
    #goToTutor;
  };
};
