import { useNavigate } from "@tanstack/react-router";
import {
  BadgeCheck,
  ChevronLeft,
  Heart,
  MapPin,
  ShieldCheck,
  Star,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";
import { mockTutors } from "../data/mockTutors";
import { useAppStore } from "../store/useAppStore";
import type { Tutor } from "../types";

const TAG_COLORS: Record<string, string> = {
  "Best Match": "bg-[#6C63FF] text-white",
  "Top Rated": "bg-[#f59e0b] text-white",
  Popular: "bg-[#10b981] text-white",
  New: "bg-[#4F9EF8] text-white",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={13}
          className={
            s <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/30 fill-muted-foreground/10"
          }
        />
      ))}
    </span>
  );
}

function TutorCard({
  tutor,
  onSwipe,
  isTop,
  onViewProfile,
}: {
  tutor: Tutor;
  onSwipe: (dir: "left" | "right") => void;
  isTop: boolean;
  onViewProfile: (id: string) => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const nopeOpacity = useTransform(x, [-120, -40], [1, 0]);
  const yesOpacity = useTransform(x, [40, 120], [0, 1]);
  const cardScale = useTransform(x, [-200, 0, 200], [0.97, 1, 0.97]);
  const dragRef = useRef(false);

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    const threshold = 80;
    if (info.offset.x > threshold) {
      onSwipe("right");
    } else if (info.offset.x < -threshold) {
      onSwipe("left");
    }
    dragRef.current = false;
  };

  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${tutor.name.replace(/\s/g, "")}`;

  return (
    <motion.div
      data-ocid="swipe.card"
      className="absolute inset-0 w-full"
      style={{ x, rotate, scale: cardScale }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: -200, right: 200 }}
      dragElastic={0.15}
      onDragStart={() => {
        dragRef.current = true;
      }}
      onDragEnd={handleDragEnd}
      initial={{
        scale: isTop ? 1 : 0.96,
        y: isTop ? 0 : 12,
        opacity: isTop ? 1 : 0.7,
      }}
      animate={{
        scale: isTop ? 1 : 0.96,
        y: isTop ? 0 : 12,
        opacity: isTop ? 1 : 0.75,
      }}
      exit={{
        x: x.get() > 0 ? 500 : -500,
        opacity: 0,
        rotate: x.get() > 0 ? 25 : -25,
        transition: { duration: 0.35, ease: "easeOut" },
      }}
    >
      <div
        className="w-full h-full rounded-2xl overflow-hidden bg-card select-none"
        style={{ boxShadow: "0 12px 28px rgba(0,0,0,0.15)" }}
      >
        {/* Image */}
        <div className="relative" style={{ aspectRatio: "4/3" }}>
          <img
            src={avatarUrl}
            alt={tutor.name}
            className="w-full h-full object-cover bg-muted"
            draggable={false}
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.72) 100%)",
            }}
          />
          {/* Tag */}
          {tutor.tag && (
            <div
              className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${TAG_COLORS[tutor.tag] ?? "bg-muted text-foreground"}`}
            >
              {tutor.tag}
            </div>
          )}
          {/* NOPE badge */}
          <motion.div
            className="absolute top-5 left-4 px-3 py-1.5 rounded-xl border-2 border-red-500 text-red-500 text-lg font-black uppercase tracking-widest rotate-[-15deg]"
            style={{ opacity: nopeOpacity }}
          >
            NOPE
          </motion.div>
          {/* YES badge */}
          <motion.div
            className="absolute top-5 right-4 px-3 py-1.5 rounded-xl border-2 border-emerald-500 text-emerald-500 text-lg font-black uppercase tracking-widest rotate-[15deg]"
            style={{ opacity: yesOpacity }}
          >
            YES!
          </motion.div>
          {/* Name + subjects overlay */}
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-white font-display font-bold text-[22px] leading-tight drop-shadow-sm">
              {tutor.name}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {tutor.subjects.map((s) => (
                <span
                  key={s}
                  className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm border border-white/25"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Info section */}
        <div className="px-4 py-3.5 bg-card">
          {/* Experience + Price */}
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-sm font-semibold text-foreground">
              {tutor.experience} yrs experience
            </span>
            <span
              className="text-base font-bold"
              style={{
                background: "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ₹{tutor.pricePerHour.toLocaleString("en-IN")}/hr
            </span>
          </div>

          {/* Rating row */}
          <div className="flex items-center gap-2 mb-2.5">
            <StarRating rating={tutor.rating} />
            <span className="text-sm font-bold text-foreground">
              {tutor.rating.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">
              ({tutor.reviewCount} reviews)
            </span>
            <span className="mx-1 text-muted-foreground/30">•</span>
            <MapPin size={12} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {tutor.distance} km away
            </span>
          </div>

          {/* Trust badges */}
          {(tutor.isVerified || tutor.isBackgroundChecked) && (
            <div className="flex flex-wrap gap-2 mb-2.5">
              {tutor.isVerified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
                  <ShieldCheck size={11} /> Verified
                </span>
              )}
              {tutor.isBackgroundChecked && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                  <BadgeCheck size={11} /> Background Checked
                </span>
              )}
            </div>
          )}

          {/* View Profile link */}
          <button
            type="button"
            className="text-xs font-semibold"
            style={{
              background: "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            data-ocid="swipe.view_profile_button"
            onClick={() => onViewProfile(tutor.id)}
          >
            View Full Profile →
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function SwipePage() {
  const navigate = useNavigate();
  const toggleSavedTutor = useAppStore((s) => s.toggleSavedTutor);
  const [currentIndex, setCurrentIndex] = useState(0);

  const total = mockTutors.length;
  const remaining = total - currentIndex;
  const currentTutor: Tutor | undefined = mockTutors[currentIndex];
  const nextTutor: Tutor | undefined = mockTutors[currentIndex + 1];

  const handleSwipe = (dir: "left" | "right") => {
    if (!currentTutor) return;
    if (dir === "right") {
      toggleSavedTutor(currentTutor.id);
    }
    setTimeout(() => {
      setCurrentIndex((i) => i + 1);
    }, 50);
  };

  const handleViewProfile = (tutorId: string) => {
    navigate({ to: "/booking/$tutorId", params: { tutorId } });
  };

  const allSwiped = currentIndex >= total;

  return (
    <div className="flex flex-col min-h-screen bg-background max-w-md mx-auto relative overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 pt-12 pb-4 bg-card border-b border-border z-10"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
      >
        <button
          type="button"
          onClick={() => navigate({ to: "/tutors" })}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-muted hover:bg-muted/70 transition-smooth"
          aria-label="Go back"
          data-ocid="swipe.back_button"
        >
          <ChevronLeft size={22} className="text-foreground" />
        </button>
        <h1 className="font-display font-bold text-lg text-foreground">
          Explore Tutors
        </h1>
        <div className="px-3 py-1 rounded-full bg-muted">
          <span className="text-xs font-semibold text-muted-foreground">
            {allSwiped ? total : currentIndex + 1} / {total}
          </span>
        </div>
      </div>

      {/* Card area */}
      <div className="flex-1 flex flex-col items-center justify-between px-6 pt-5 pb-6">
        {allSwiped ? (
          /* Empty state */
          <motion.div
            data-ocid="swipe.empty_state"
            className="flex-1 flex flex-col items-center justify-center text-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-2"
              style={{
                background:
                  "linear-gradient(135deg, #6C63FF22 0%, #4F9EF822 100%)",
              }}
            >
              <span className="text-4xl">🎉</span>
            </div>
            <h2 className="font-display font-bold text-xl text-foreground">
              You've seen all tutors!
            </h2>
            <p className="text-muted-foreground text-sm max-w-[240px]">
              Adjust your filters to discover more tutors near you.
            </p>
            <button
              type="button"
              onClick={() => navigate({ to: "/requirements" })}
              className="mt-2 px-6 py-3 rounded-[14px] font-display font-semibold text-white text-sm"
              style={{
                background: "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
              }}
              data-ocid="swipe.back_to_search_button"
            >
              Back to Search
            </button>
          </motion.div>
        ) : (
          <>
            {/* Card stack */}
            <div className="relative w-full" style={{ height: "62vh" }}>
              <AnimatePresence mode="popLayout">
                {nextTutor && (
                  <TutorCard
                    key={nextTutor.id}
                    tutor={nextTutor}
                    onSwipe={handleSwipe}
                    isTop={false}
                    onViewProfile={handleViewProfile}
                  />
                )}
                {currentTutor && (
                  <TutorCard
                    key={`${currentTutor.id}-${currentIndex}`}
                    tutor={currentTutor}
                    onSwipe={handleSwipe}
                    isTop={true}
                    onViewProfile={handleViewProfile}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Swipe hint */}
            <p className="text-xs text-muted-foreground mt-3 mb-2 font-body">
              Swipe right to save · Swipe left to skip
            </p>

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-8 mt-1">
              <motion.button
                type="button"
                whileTap={{ scale: 0.88 }}
                onClick={() => handleSwipe("left")}
                className="w-16 h-16 rounded-full flex items-center justify-center bg-card border-2 border-red-100"
                style={{ boxShadow: "0 6px 18px rgba(239,68,68,0.18)" }}
                aria-label="Skip tutor"
                data-ocid="swipe.skip_button"
              >
                <X size={28} className="text-red-500" strokeWidth={2.5} />
              </motion.button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.88 }}
                onClick={() => handleSwipe("right")}
                className="w-16 h-16 rounded-full flex items-center justify-center bg-card border-2 border-emerald-100"
                style={{ boxShadow: "0 6px 18px rgba(16,185,129,0.18)" }}
                aria-label="Save tutor"
                data-ocid="swipe.save_button"
              >
                <Heart
                  size={28}
                  className="text-emerald-500"
                  strokeWidth={2.5}
                />
              </motion.button>
            </div>

            {/* Remaining count */}
            <p className="text-xs text-muted-foreground mt-3 font-body">
              {remaining} tutor{remaining !== 1 ? "s" : ""} remaining
            </p>
          </>
        )}
      </div>
    </div>
  );
}
