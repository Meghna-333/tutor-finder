import List "mo:core/List";
import Types "../types/tutor";
import Common "../types/common";

module {
  public func initSampleTutors(tutors : List.List<Types.Tutor>) {
    let samples : [Types.Tutor] = [
      {
        id = 1;
        name = "Rahul Sharma";
        subjects = ["Mathematics", "Physics"];
        experienceYears = 8;
        rating = 4.8;
        reviewCount = 124;
        distanceKm = 1.2;
        pricePerHour = 500;
        isVerified = true;
        imageUrl = "https://i.pravatar.cc/150?img=11";
        phone = "+91 98765 43210";
        email = "rahul.sharma@example.com";
      },
      {
        id = 2;
        name = "Priya Mehta";
        subjects = ["Chemistry", "Biology"];
        experienceYears = 5;
        rating = 4.6;
        reviewCount = 87;
        distanceKm = 2.4;
        pricePerHour = 450;
        isVerified = true;
        imageUrl = "https://i.pravatar.cc/150?img=20";
        phone = "+91 87654 32109";
        email = "priya.mehta@example.com";
      },
      {
        id = 3;
        name = "Amit Kumar";
        subjects = ["English", "History"];
        experienceYears = 10;
        rating = 4.9;
        reviewCount = 210;
        distanceKm = 0.8;
        pricePerHour = 600;
        isVerified = true;
        imageUrl = "https://i.pravatar.cc/150?img=33";
        phone = "+91 76543 21098";
        email = "amit.kumar@example.com";
      },
      {
        id = 4;
        name = "Sneha Patel";
        subjects = ["Mathematics", "Computer Science"];
        experienceYears = 3;
        rating = 4.4;
        reviewCount = 45;
        distanceKm = 3.1;
        pricePerHour = 400;
        isVerified = false;
        imageUrl = "https://i.pravatar.cc/150?img=44";
        phone = "+91 65432 10987";
        email = "sneha.patel@example.com";
      },
      {
        id = 5;
        name = "Vikram Singh";
        subjects = ["Physics", "Mathematics"];
        experienceYears = 12;
        rating = 4.7;
        reviewCount = 178;
        distanceKm = 1.5;
        pricePerHour = 700;
        isVerified = true;
        imageUrl = "https://i.pravatar.cc/150?img=55";
        phone = "+91 54321 09876";
        email = "vikram.singh@example.com";
      },
      {
        id = 6;
        name = "Ananya Reddy";
        subjects = ["Biology", "Chemistry"];
        experienceYears = 6;
        rating = 4.5;
        reviewCount = 92;
        distanceKm = 2.0;
        pricePerHour = 480;
        isVerified = true;
        imageUrl = "https://i.pravatar.cc/150?img=60";
        phone = "+91 43210 98765";
        email = "ananya.reddy@example.com";
      },
      {
        id = 7;
        name = "Deepak Gupta";
        subjects = ["Economics", "Commerce"];
        experienceYears = 7;
        rating = 4.3;
        reviewCount = 64;
        distanceKm = 4.2;
        pricePerHour = 350;
        isVerified = false;
        imageUrl = "https://i.pravatar.cc/150?img=70";
        phone = "+91 32109 87654";
        email = "deepak.gupta@example.com";
      },
      {
        id = 8;
        name = "Kavya Nair";
        subjects = ["English", "Social Science"];
        experienceYears = 4;
        rating = 4.6;
        reviewCount = 53;
        distanceKm = 1.8;
        pricePerHour = 420;
        isVerified = true;
        imageUrl = "https://i.pravatar.cc/150?img=47";
        phone = "+91 21098 76543";
        email = "kavya.nair@example.com";
      },
      {
        id = 9;
        name = "Rohan Verma";
        subjects = ["Computer Science", "Mathematics"];
        experienceYears = 9;
        rating = 4.8;
        reviewCount = 135;
        distanceKm = 2.7;
        pricePerHour = 550;
        isVerified = true;
        imageUrl = "https://i.pravatar.cc/150?img=15";
        phone = "+91 10987 65432";
        email = "rohan.verma@example.com";
      },
      {
        id = 10;
        name = "Meena Iyer";
        subjects = ["Hindi", "Sanskrit"];
        experienceYears = 15;
        rating = 4.9;
        reviewCount = 289;
        distanceKm = 0.5;
        pricePerHour = 300;
        isVerified = true;
        imageUrl = "https://i.pravatar.cc/150?img=32";
        phone = "+91 09876 54321";
        email = "meena.iyer@example.com";
      },
    ];
    for (t in samples.values()) {
      tutors.add(t);
    };
  };

  public func getTutors(
    tutors : List.List<Types.Tutor>,
    filter : ?Types.TutorFilter,
  ) : [Types.Tutor] {
    let all = tutors.toArray();
    switch (filter) {
      case null { all };
      case (?f) {
        all.filter(func(t : Types.Tutor) : Bool {
          let subjectMatch = switch (f.subjects) {
            case null { true };
            case (?subs) {
              subs.size() == 0 or subs.any(func(s : Text) : Bool {
                t.subjects.any(func(ts : Text) : Bool { ts == s })
              })
            };
          };
          let budgetMatch = switch (f.maxBudget) {
            case null { true };
            case (?budget) { t.pricePerHour <= budget };
          };
          subjectMatch and budgetMatch
        })
      };
    };
  };

  public func getTutorById(
    tutors : List.List<Types.Tutor>,
    id : Common.TutorId,
  ) : ?Types.Tutor {
    tutors.find(func(t : Types.Tutor) : Bool { t.id == id })
  };

  public func updateTutorRating(
    tutors : List.List<Types.Tutor>,
    tutorId : Common.TutorId,
    newRating : Float,
    newReviewCount : Nat,
  ) {
    tutors.mapInPlace(func(t : Types.Tutor) : Types.Tutor {
      if (t.id == tutorId) {
        { t with rating = newRating; reviewCount = newReviewCount }
      } else {
        t
      }
    });
  };
};
