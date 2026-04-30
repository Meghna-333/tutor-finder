import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle, Star } from "lucide-react";
import { useState } from "react";
import { getTutorById } from "../data/mockTutors";
import { useAppStore } from "../store/useAppStore";

const RATING_LABELS: Record<
  number,
  { text: string; color: string; bg: string }
> = {
  1: { text: "Poor", color: "#ef4444", bg: "#fef2f2" },
  2: { text: "Fair", color: "#f97316", bg: "#fff7ed" },
  3: { text: "Good", color: "#eab308", bg: "#fefce8" },
  4: { text: "Very Good", color: "#3b82f6", bg: "#eff6ff" },
  5: { text: "Excellent!", color: "#22c55e", bg: "#f0fdf4" },
};

export default function ReviewPage() {
  const { tutorId } = useParams({ from: "/layout/review/$tutorId" });
  const navigate = useNavigate();
  const addReview = useAppStore((s) => s.addReview);

  const tutor = getTutorById(tutorId);

  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [animatingStar, setAnimatingStar] = useState<number | null>(null);

  const handleStarClick = (value: number) => {
    setRating(value);
    setAnimatingStar(value);
    setTimeout(() => setAnimatingStar(null), 300);
  };

  const handleSubmit = () => {
    if (!rating) return;
    addReview({
      id: `r-${Date.now()}`,
      tutorId,
      rating,
      comment: comment.trim(),
      authorName: "You",
      createdAt: new Date().toISOString(),
    });
    setSubmitted(true);
  };

  const activeStar = hoveredStar || rating;
  const ratingMeta = rating > 0 ? RATING_LABELS[rating] : null;

  if (!tutor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <p className="text-muted-foreground font-body">Tutor not found.</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div
        className="min-h-screen bg-background flex flex-col items-center justify-center p-6 gap-6"
        data-ocid="review.success_state"
      >
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center shadow-card"
          style={{
            background: "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
          }}
        >
          <CheckCircle className="w-12 h-12 text-white" strokeWidth={1.5} />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-display font-bold text-foreground">
            Review Submitted!
          </h2>
          <p className="text-muted-foreground font-body text-sm leading-relaxed">
            Thank you for helping the community
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate({ to: "/tutors" })}
          className="w-full max-w-xs h-[50px] rounded-xl font-display font-semibold text-white text-base transition-smooth active:scale-95"
          style={{
            background: "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
          }}
          data-ocid="review.back_button"
        >
          Back to Tutors
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background flex flex-col max-w-[480px] mx-auto"
      data-ocid="review.page"
    >
      {/* Header */}
      <header
        className="flex items-center gap-3 px-4 py-4 bg-card border-b border-border sticky top-0 z-10"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
      >
        <button
          type="button"
          onClick={() => navigate({ to: "/tutors" })}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-muted transition-smooth active:scale-90"
          aria-label="Go back"
          data-ocid="review.back_nav"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="font-display font-bold text-foreground text-lg">
          Write a Review
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 pb-8">
        {/* Tutor Card */}
        <div
          className="bg-card rounded-[14px] p-4 flex items-center gap-3"
          style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
          data-ocid="review.tutor_card"
        >
          <img
            src={tutor.imageUrl}
            alt={tutor.name}
            className="w-12 h-12 rounded-full object-cover bg-muted flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-display font-semibold text-foreground text-base truncate">
              {tutor.name}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {tutor.subjects.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="text-xs px-2.5 py-0.5 rounded-full font-body font-medium"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(108,99,255,0.1) 0%, rgba(79,158,248,0.1) 100%)",
                    color: "#6C63FF",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground font-body mt-1.5">
              You had a demo class with {tutor.name.split(" ")[0]}
            </p>
          </div>
        </div>

        {/* Star Rating Section */}
        <div
          className="bg-card rounded-[14px] p-5"
          style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
          data-ocid="review.rating_section"
        >
          <p className="font-display font-semibold text-foreground text-base text-center mb-5">
            How was your experience?
          </p>

          {/* Stars */}
          <div
            className="flex items-center justify-center gap-3"
            aria-label="Select rating"
          >
            {[1, 2, 3, 4, 5].map((value) => {
              const isFilled = value <= activeStar;
              const isAnimating = animatingStar === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleStarClick(value)}
                  onMouseEnter={() => setHoveredStar(value)}
                  onMouseLeave={() => setHoveredStar(0)}
                  aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                  data-ocid={`review.star.${value}`}
                  className="focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none"
                  style={{
                    transform: isAnimating ? "scale(1.25)" : "scale(1)",
                    transition:
                      "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                  }}
                >
                  <Star
                    size={44}
                    strokeWidth={isFilled ? 0 : 1.5}
                    style={{
                      fill: isFilled ? "#FBBF24" : "transparent",
                      stroke: isFilled ? "#FBBF24" : "#D1D5DB",
                      transition: "fill 0.15s ease, stroke 0.15s ease",
                      filter: isFilled
                        ? "drop-shadow(0 2px 4px rgba(251,191,36,0.4))"
                        : "none",
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* Rating label */}
          <div className="h-9 flex items-center justify-center mt-3">
            {ratingMeta && (
              <span
                className="text-sm font-display font-semibold px-4 py-1.5 rounded-full transition-smooth"
                style={{
                  color: ratingMeta.color,
                  background: ratingMeta.bg,
                }}
              >
                {ratingMeta.text}
              </span>
            )}
          </div>
        </div>

        {/* Comment Box */}
        <div
          className="bg-card rounded-[14px] p-5"
          style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
        >
          <div className="mb-3">
            <p className="font-display font-semibold text-foreground text-base">
              Share your experience
            </p>
            <p className="text-xs text-muted-foreground font-body mt-0.5">
              Help other students choose better
            </p>
          </div>

          <div className="relative">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 500))}
              placeholder="What did you like about this tutor?"
              rows={4}
              maxLength={500}
              className="w-full resize-none rounded-xl border border-border bg-input px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground transition-smooth focus:outline-none focus:border-primary"
              style={{ height: "100px" }}
              data-ocid="review.comment_input"
            />
            <div className="flex items-center justify-between mt-1.5">
              {comment.length > 0 && comment.length < 10 ? (
                <p className="text-xs" style={{ color: "#f97316" }}>
                  Add a bit more detail
                </p>
              ) : (
                <span />
              )}
              <p className="text-xs text-muted-foreground font-body ml-auto">
                {comment.length} / 500
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button — sticky at bottom */}
      <div className="px-4 pb-6 pt-3 bg-background border-t border-border">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!rating}
          className="w-full h-[50px] rounded-xl font-display font-semibold text-white text-base transition-smooth active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
          style={{
            background: rating
              ? "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)"
              : "#D1D5DB",
          }}
          data-ocid="review.submit_button"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
}
