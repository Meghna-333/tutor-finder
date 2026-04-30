export type LearningMode = "home" | "tutor";

export type Subject =
  | "Maths"
  | "Physics"
  | "Chemistry"
  | "English"
  | "Hindi"
  | "Biology"
  | "History"
  | "Computer Science"
  | "Science"
  | "Social Studies"
  | "Accountancy"
  | "Business Studies"
  | "Commercial Studies"
  | "Computer Applications"
  | "Drawing"
  | "Economics"
  | "Environmental Sciences"
  | "Geography"
  | "Legal Studies"
  | "Music"
  | "Psychology"
  | "Sociology";

export type ClassLevel =
  | "Class 1-5"
  | "Class 6, 8, 10"
  | "Class 11-12"
  | "Competitive Exams"
  | "Graduation";

export interface Tutor {
  id: string;
  name: string;
  subjects: Subject[];
  experience: number; // years
  rating: number; // 4.0–4.9
  reviewCount: number;
  distance: number; // km
  pricePerHour: number; // ₹
  isVerified: boolean;
  isBackgroundChecked: boolean;
  imageUrl: string;
  phone: string;
  email: string;
  bio: string;
  location: string;
  tag?: "Best Match" | "Top Rated" | "New" | "Popular";
}

export interface Booking {
  id: string;
  tutorId: string;
  tutorName: string;
  date: string; // ISO date string
  timeSlot: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  mode: LearningMode;
}

export interface Review {
  id: string;
  tutorId: string;
  rating: number; // 1–5
  comment: string;
  authorName: string;
  createdAt: string;
}

export interface UnlockStatus {
  tutorId: string;
  unlockedAt: string;
  amountPaid: number;
}

export interface RequirementsForm {
  classLevel: ClassLevel | "";
  subjects: Subject[];
  budgetMin: number;
  budgetMax: number;
  location: string;
  mode: LearningMode | null;
}

export interface AppState {
  selectedMode: LearningMode | null;
  requirements: RequirementsForm;
  savedTutors: Set<string>;
  unlockedTutors: Set<string>;
  currentUserPhone: string;
  freeUnlocksRemaining: number;
  bookings: Booking[];
  reviews: Review[];
}
