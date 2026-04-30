import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Booking,
  ClassLevel,
  LearningMode,
  RequirementsForm,
  Review,
  Subject,
} from "../types";

interface AppStore {
  // Mode selection
  selectedMode: LearningMode | null;
  setSelectedMode: (mode: LearningMode) => void;

  // Requirements form
  requirements: RequirementsForm;
  setRequirementsField: <K extends keyof RequirementsForm>(
    key: K,
    value: RequirementsForm[K],
  ) => void;
  resetRequirements: () => void;

  // Saved tutors
  savedTutors: Set<string>;
  toggleSavedTutor: (tutorId: string) => void;

  // Unlocked tutors
  unlockedTutors: Set<string>;
  unlockTutor: (tutorId: string) => void;

  // User
  currentUserPhone: string;
  setCurrentUserPhone: (phone: string) => void;

  // Free unlocks
  freeUnlocksRemaining: number;
  useFreeUnlock: () => void;

  // Bookings
  bookings: Booking[];
  addBooking: (booking: Booking) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Review) => void;
}

const defaultRequirements: RequirementsForm = {
  classLevel: "",
  subjects: [] as Subject[],
  budgetMin: 0,
  budgetMax: 1500,
  location: "",
  mode: null,
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      selectedMode: null,
      setSelectedMode: (mode) => set({ selectedMode: mode }),

      requirements: defaultRequirements,
      setRequirementsField: (key, value) =>
        set((state) => ({
          requirements: { ...state.requirements, [key]: value },
        })),
      resetRequirements: () => set({ requirements: defaultRequirements }),

      savedTutors: new Set<string>(),
      toggleSavedTutor: (tutorId) =>
        set((state) => {
          const next = new Set(state.savedTutors);
          if (next.has(tutorId)) next.delete(tutorId);
          else next.add(tutorId);
          return { savedTutors: next };
        }),

      unlockedTutors: new Set<string>(),
      unlockTutor: (tutorId) =>
        set((state) => {
          const next = new Set(state.unlockedTutors);
          next.add(tutorId);
          return { unlockedTutors: next };
        }),

      currentUserPhone: "",
      setCurrentUserPhone: (phone) => set({ currentUserPhone: phone }),

      freeUnlocksRemaining: 1,
      useFreeUnlock: () =>
        set((state) => ({
          freeUnlocksRemaining: Math.max(0, state.freeUnlocksRemaining - 1),
        })),

      bookings: [],
      addBooking: (booking) =>
        set((state) => ({ bookings: [...state.bookings, booking] })),

      reviews: [],
      addReview: (review) =>
        set((state) => ({ reviews: [...state.reviews, review] })),
    }),
    {
      name: "guruconnect-store",
      // Sets are not JSON-serializable, handle manually
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const parsed = JSON.parse(str);
          const state = parsed?.state ?? parsed;
          return {
            state: {
              ...state,
              savedTutors: new Set<string>(state.savedTutors ?? []),
              unlockedTutors: new Set<string>(state.unlockedTutors ?? []),
            },
          };
        },
        setItem: (name, value) => {
          const serializable = {
            ...value,
            state: {
              ...value.state,
              savedTutors: Array.from(value.state.savedTutors),
              unlockedTutors: Array.from(value.state.unlockedTutors),
            },
          };
          localStorage.setItem(name, JSON.stringify(serializable));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
);

// Selector helpers
export const useSelectedMode = () => useAppStore((s) => s.selectedMode);
export const useRequirements = () => useAppStore((s) => s.requirements);
export const useSavedTutors = () => useAppStore((s) => s.savedTutors);
export const useUnlockedTutors = () => useAppStore((s) => s.unlockedTutors);
export const useFreeUnlocks = () => useAppStore((s) => s.freeUnlocksRemaining);
