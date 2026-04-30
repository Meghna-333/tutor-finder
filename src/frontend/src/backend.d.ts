import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type BookingId = bigint;
export type Timestamp = bigint;
export interface CreateBookingRequest {
    date: string;
    studentPhone: string;
    tutorId: TutorId;
    timeSlot: string;
}
export interface TutorFilter {
    subjects?: Array<string>;
    mode?: LearningMode;
    location?: string;
    maxBudget?: bigint;
}
export type TutorId = bigint;
export type UserId = string;
export interface Tutor {
    id: TutorId;
    subjects: Array<string>;
    name: string;
    pricePerHour: bigint;
    email: string;
    imageUrl: string;
    experienceYears: bigint;
    distanceKm: number;
    isVerified: boolean;
    rating: number;
    phone: string;
    reviewCount: bigint;
}
export type UnlockResult = {
    __kind__: "alreadyUnlocked";
    alreadyUnlocked: {
        email: string;
        phone: string;
    };
} | {
    __kind__: "success";
    success: {
        email: string;
        usedFreeUnlock: boolean;
        phone: string;
    };
} | {
    __kind__: "noFreeUnlockAvailable";
    noFreeUnlockAvailable: null;
};
export interface UnlockStatus {
    freeUnlocksUsed: bigint;
    hasFreeUnlock: boolean;
    isUnlocked: boolean;
}
export interface Booking {
    id: BookingId;
    studentId: UserId;
    date: string;
    createdAt: Timestamp;
    studentPhone: string;
    tutorId: TutorId;
    timeSlot: string;
}
export interface SubmitReviewRequest {
    comment: string;
    tutorId: TutorId;
    rating: bigint;
}
export type ReviewId = bigint;
export interface Review {
    id: ReviewId;
    createdAt: Timestamp;
    reviewerId: UserId;
    comment: string;
    tutorId: TutorId;
    rating: bigint;
}
export enum LearningMode {
    goToTutor = "goToTutor",
    learnAtHome = "learnAtHome"
}
export interface backendInterface {
    checkUnlockStatus(tutorId: TutorId): Promise<UnlockStatus>;
    createBooking(req: CreateBookingRequest): Promise<Booking>;
    getBookings(studentId: UserId): Promise<Array<Booking>>;
    getReviews(tutorId: TutorId): Promise<Array<Review>>;
    getTutorById(id: TutorId): Promise<Tutor | null>;
    getTutors(filter: TutorFilter | null): Promise<Array<Tutor>>;
    submitReview(req: SubmitReviewRequest): Promise<Review>;
    unlockContact(tutorId: TutorId): Promise<UnlockResult>;
}
