import Common "common";

module {
  public type UnlockId = Nat;

  public type ContactUnlock = {
    id : UnlockId;
    tutorId : Common.TutorId;
    userId : Common.UserId;
    unlockedAt : Common.Timestamp;
    usedFreeUnlock : Bool;
  };

  public type UnlockStatus = {
    isUnlocked : Bool;
    hasFreeUnlock : Bool;
    freeUnlocksUsed : Nat;
  };

  public type UnlockResult = {
    #success : { phone : Text; email : Text; usedFreeUnlock : Bool };
    #alreadyUnlocked : { phone : Text; email : Text };
    #noFreeUnlockAvailable;
  };
};
