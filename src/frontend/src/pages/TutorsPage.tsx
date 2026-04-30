import { useNavigate } from "@tanstack/react-router";
import {
  Filter,
  Heart,
  MapPin,
  Shield,
  Star,
  Unlock,
  User,
} from "lucide-react";
import { useState } from "react";
import { mockTutors } from "../data/mockTutors";
import { useAppStore } from "../store/useAppStore";
import type { Tutor } from "../types";

// ─── Tag badge helpers ───────────────────────────────────────────────────────
function TagBadge({ tag }: { tag: Tutor["tag"] }) {
  if (!tag) return null;
  const styles: Record<NonNullable<Tutor["tag"]>, string> = {
    "Best Match": "bg-orange-50 text-orange-600 border border-orange-200",
    "Top Rated": "bg-purple-50 text-purple-600 border border-purple-200",
    New: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    Popular: "bg-blue-50 text-blue-600 border border-blue-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${styles[tag]}`}
    >
      {tag}
    </span>
  );
}

// ─── Subject chips ────────────────────────────────────────────────────────────
function SubjectChips({ subjects }: { subjects: Tutor["subjects"] }) {
  const visible = subjects.slice(0, 3);
  const extra = subjects.length - 3;
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {visible.map((s) => (
        <span
          key={s}
          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
          style={{
            background: "linear-gradient(135deg,#ede9fe,#dbeafe)",
            color: "#4f46e5",
          }}
        >
          {s}
        </span>
      ))}
      {extra > 0 && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground">
          +{extra} more
        </span>
      )}
    </div>
  );
}

// ─── Star row ─────────────────────────────────────────────────────────────────
function StarRow({
  rating,
  reviewCount,
}: { rating: number; reviewCount: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {([0, 1, 2, 3, 4] as const).map((i) => (
          <Star
            key={i}
            size={12}
            className={
              i < full
                ? "fill-amber-400 text-amber-400"
                : i === full && half
                  ? "fill-amber-200 text-amber-400"
                  : "fill-muted text-muted-foreground"
            }
          />
        ))}
      </div>
      <span className="text-xs font-bold text-foreground">
        {rating.toFixed(1)}
      </span>
      <span className="text-xs text-muted-foreground">
        ({reviewCount} reviews)
      </span>
    </div>
  );
}

// ─── Tutor Card ───────────────────────────────────────────────────────────────
function TutorCard({
  tutor,
  index,
  isSaved,
  onToggleSave,
}: {
  tutor: Tutor;
  index: number;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}) {
  const navigate = useNavigate();

  return (
    <div
      data-ocid={`tutor.item.${index + 1}`}
      className="bg-card rounded-[14px] mb-4 overflow-hidden transition-smooth hover:shadow-hover"
      style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
    >
      <div className="p-4">
        {/* TOP ROW */}
        <div className="flex items-start gap-3 relative">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-border bg-muted">
              <img
                src={tutor.imageUrl}
                alt={tutor.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "";
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              {!tutor.imageUrl && (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={24} className="text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pr-8">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-base font-bold text-foreground leading-tight truncate">
                {tutor.name}
              </span>
              {tutor.isVerified && (
                <Shield
                  size={14}
                  className="fill-blue-500 text-blue-500 flex-shrink-0"
                />
              )}
            </div>
            <SubjectChips subjects={tutor.subjects} />
            <p className="text-xs text-muted-foreground mt-1">
              {tutor.experience} yrs exp · {tutor.location.split(",")[0]}
            </p>
          </div>

          {/* Tag + Heart */}
          <div className="absolute right-0 top-0 flex flex-col items-end gap-2">
            {tutor.tag && <TagBadge tag={tutor.tag} />}
            <button
              type="button"
              data-ocid={`tutor.save_toggle.${index + 1}`}
              onClick={() => onToggleSave(tutor.id)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted/60 transition-smooth active:scale-90"
              aria-label={isSaved ? "Remove from saved" : "Save tutor"}
            >
              <Heart
                size={18}
                className={
                  isSaved
                    ? "fill-red-500 text-red-500"
                    : "text-muted-foreground"
                }
              />
            </button>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-3 border-t border-border" />

        {/* MIDDLE ROW */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <StarRow rating={tutor.rating} reviewCount={tutor.reviewCount} />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin size={11} className="flex-shrink-0" />
            <span>{tutor.distance.toFixed(1)} km away</span>
          </div>
          <span
            className="text-sm font-bold"
            style={{
              background: "linear-gradient(135deg,#6c63ff,#4f9ef8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ₹{tutor.pricePerHour}/hr
          </span>
        </div>

        {/* Trust badges */}
        {(tutor.isVerified || tutor.isBackgroundChecked) && (
          <div className="flex gap-2 mt-2.5 flex-wrap">
            {tutor.isVerified && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-semibold">
                <Shield size={9} className="fill-blue-500 text-blue-500" />
                Verified Profile
              </div>
            )}
            {tutor.isBackgroundChecked && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-semibold">
                <Shield
                  size={9}
                  className="fill-emerald-500 text-emerald-500"
                />
                Background Checked
              </div>
            )}
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex gap-2 mt-3">
          <button
            type="button"
            data-ocid={`tutor.save_button.${index + 1}`}
            onClick={() => onToggleSave(tutor.id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-[10px] border border-border text-xs font-semibold text-muted-foreground hover:bg-muted/40 transition-smooth active:scale-95 flex-shrink-0"
          >
            <Heart
              size={13}
              className={
                isSaved ? "fill-red-500 text-red-500" : "text-muted-foreground"
              }
            />
            {isSaved ? "Saved" : "Save"}
          </button>

          <button
            type="button"
            data-ocid={`tutor.view_profile_button.${index + 1}`}
            onClick={() =>
              navigate({
                to: "/booking/$tutorId",
                params: { tutorId: tutor.id },
              })
            }
            className="flex-1 px-3 py-2 rounded-[10px] border border-border text-xs font-semibold text-foreground hover:bg-muted/40 transition-smooth active:scale-95"
          >
            View Profile
          </button>

          <button
            type="button"
            data-ocid={`tutor.unlock_button.${index + 1}`}
            onClick={() =>
              navigate({
                to: "/unlock/$tutorId",
                params: { tutorId: tutor.id },
              })
            }
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-[10px] text-xs font-semibold text-white active:scale-95 transition-smooth hover:opacity-90"
            style={{
              background: "linear-gradient(135deg,#6c63ff 0%,#4f9ef8 100%)",
            }}
          >
            <Unlock size={12} />
            Unlock Contact
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TutorsPage() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<"list" | "swipe">("list");
  const savedTutors = useAppStore((s) => s.savedTutors);
  const toggleSavedTutor = useAppStore((s) => s.toggleSavedTutor);

  function handleViewToggle(view: "list" | "swipe") {
    setActiveView(view);
    if (view === "swipe") {
      navigate({ to: "/swipe" });
    }
  }

  return (
    <div
      data-ocid="tutors.page"
      className="min-h-screen bg-background flex flex-col"
      style={{ maxWidth: 480, margin: "0 auto" }}
    >
      {/* STICKY HEADER */}
      <div
        data-ocid="tutors.header"
        className="sticky top-0 z-20 bg-card border-b border-border"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
      >
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[20px] font-bold text-foreground font-display leading-tight">
                Top Matches for You
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {mockTutors.length} tutors found near you
              </p>
            </div>
            <button
              type="button"
              data-ocid="tutors.filter_button"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-border bg-card hover:bg-muted/40 transition-smooth active:scale-95"
              aria-label="Filter tutors"
            >
              <Filter size={16} className="text-muted-foreground" />
            </button>
          </div>

          {/* View Toggle Pills */}
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              data-ocid="tutors.list_view_tab"
              onClick={() => handleViewToggle("list")}
              className="flex-1 py-1.5 rounded-full text-sm font-semibold transition-smooth active:scale-95"
              style={
                activeView === "list"
                  ? {
                      background:
                        "linear-gradient(135deg,#6c63ff 0%,#4f9ef8 100%)",
                      color: "#fff",
                    }
                  : undefined
              }
              aria-pressed={activeView === "list"}
            >
              <span
                className={activeView === "list" ? "" : "text-muted-foreground"}
              >
                List View
              </span>
            </button>
            <button
              type="button"
              data-ocid="tutors.swipe_view_tab"
              onClick={() => handleViewToggle("swipe")}
              className="flex-1 py-1.5 rounded-full text-sm font-semibold transition-smooth active:scale-95 border border-border hover:bg-muted/30"
              style={
                activeView === "swipe"
                  ? {
                      background:
                        "linear-gradient(135deg,#6c63ff 0%,#4f9ef8 100%)",
                      color: "#fff",
                      border: "none",
                    }
                  : undefined
              }
              aria-pressed={activeView === "swipe"}
            >
              <span
                className={
                  activeView === "swipe" ? "" : "text-muted-foreground"
                }
              >
                Swipe View
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* SCROLLABLE TUTOR LIST */}
      <div
        data-ocid="tutors.list"
        className="flex-1 overflow-y-auto px-4 pt-4 pb-6"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {mockTutors.map((tutor, index) => (
          <TutorCard
            key={tutor.id}
            tutor={tutor}
            index={index}
            isSaved={savedTutors.has(tutor.id)}
            onToggleSave={toggleSavedTutor}
          />
        ))}

        {/* Bottom padding spacer */}
        <div className="h-4" />
      </div>
    </div>
  );
}
