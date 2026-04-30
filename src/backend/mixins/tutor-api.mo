import List "mo:core/List";
import TutorLib "../lib/tutor";
import TutorTypes "../types/tutor";
import Common "../types/common";

mixin (
  tutors : List.List<TutorTypes.Tutor>,
) {
  public query func getTutors(filter : ?TutorTypes.TutorFilter) : async [TutorTypes.Tutor] {
    TutorLib.getTutors(tutors, filter)
  };

  public query func getTutorById(id : Common.TutorId) : async ?TutorTypes.Tutor {
    TutorLib.getTutorById(tutors, id)
  };
};
