import { useParams, useRouter } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  Gift,
  Lock,
  Mail,
  Phone,
  Shield,
  Star,
  Unlock,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { getTutorById } from "../data/mockTutors";
import {
  useAppStore,
  useFreeUnlocks,
  useUnlockedTutors,
} from "../store/useAppStore";

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={
            i <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "text-border"
          }
        />
      ))}
    </span>
  );
}

export default function UnlockPage() {
  const { tutorId } = useParams({ from: "/layout/unlock/$tutorId" });
  const router = useRouter();
  const tutor = getTutorById(tutorId);
  const unlockedTutors = useUnlockedTutors();
  const freeUnlocks = useFreeUnlocks();
  const unlockTutor = useAppStore((s) => s.unlockTutor);
  const decrementFreeUnlock = useAppStore((s) => s.useFreeUnlock);

  const alreadyUnlocked = unlockedTutors.has(tutorId);
  const [isUnlocked, setIsUnlocked] = useState(alreadyUnlocked);
  const [isLoading, setIsLoading] = useState(false);

  const hasFreeUnlock = freeUnlocks > 0 && !alreadyUnlocked;

  if (!tutor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-4 px-4">
        <Lock size={48} className="text-muted-foreground" />
        <p className="text-foreground font-display font-semibold text-lg">
          Tutor not found
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.history.back()}
          className="rounded-full"
        >
          Go Back
        </Button>
      </div>
    );
  }

  async function handleUnlock() {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    if (hasFreeUnlock) {
      decrementFreeUnlock();
    }
    unlockTutor(tutorId);
    setIsUnlocked(true);
    setIsLoading(false);
    toast.success("Contact details unlocked!", {
      description: `You can now contact ${tutor?.name} directly.`,
      duration: 4000,
    });
  }

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      style={{ maxWidth: 480, margin: "0 auto" }}
    >
      {/* Gradient Header */}
      <div
        className="relative flex items-center px-4 pt-12 pb-6"
        style={{
          background: "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
        }}
      >
        <button
          type="button"
          data-ocid="unlock.back_button"
          onClick={() => router.history.back()}
          className="absolute left-4 top-12 w-9 h-9 flex items-center justify-center rounded-full bg-white/20 text-white transition-smooth hover:bg-white/30 active:scale-95"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="flex-1 text-center text-white font-display font-bold text-lg tracking-tight">
          Unlock Contact
        </h1>
      </div>

      <div className="flex flex-col gap-4 px-4 pb-8 -mt-1">
        {/* Tutor Summary Card */}
        <div
          className="bg-card rounded-[14px] shadow-card p-4 flex items-center gap-3 -mt-5 relative z-10"
          data-ocid="unlock.tutor_card"
        >
          <div className="relative shrink-0">
            <img
              src={tutor.imageUrl}
              alt={tutor.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-border bg-muted"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.name)}&background=6C63FF&color=fff&size=56`;
              }}
            />
            {tutor.isVerified && (
              <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                <CheckCircle size={12} />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-display font-bold text-foreground text-base leading-tight">
                {tutor.name}
              </span>
              {tutor.isVerified && (
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 h-4 font-semibold"
                  data-ocid="unlock.verified_badge"
                >
                  ✓ Verified
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <StarRow rating={tutor.rating} />
              <span className="text-xs text-muted-foreground font-body">
                {tutor.rating} ({tutor.reviewCount} reviews)
              </span>
            </div>
            <div className="flex gap-1.5 flex-wrap mt-1.5">
              {tutor.subjects.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="text-[11px] px-2 py-0.5 rounded-full font-body font-medium"
                  style={{
                    background: "rgba(108,99,255,0.1)",
                    color: "#6C63FF",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {tutor.tag && (
            <span
              className="shrink-0 text-[10px] font-bold px-2 py-1 rounded-full text-white"
              style={{
                background: "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
              }}
            >
              {tutor.tag}
            </span>
          )}
        </div>

        {/* Free Unlock Badge */}
        {hasFreeUnlock && !isUnlocked && (
          <div
            className="rounded-[14px] px-4 py-3 flex items-center gap-3"
            style={{
              background: "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
            }}
            data-ocid="unlock.free_badge"
          >
            <Gift size={22} className="text-white shrink-0" />
            <div>
              <p className="text-white font-display font-bold text-sm leading-tight">
                🎁 You have 1 FREE unlock!
              </p>
              <p className="text-white/80 font-body text-xs mt-0.5">
                Your first contact unlock is on us
              </p>
            </div>
          </div>
        )}

        {/* Blurred Contact Section */}
        <div
          className="bg-card rounded-[14px] shadow-card overflow-hidden"
          data-ocid="unlock.contact_section"
        >
          <div className="px-4 pt-4 pb-2 border-b border-border">
            <h2 className="font-display font-semibold text-foreground text-sm">
              Contact Details
            </h2>
          </div>

          <div className="p-4 relative">
            {/* Blurred contact rows */}
            <div
              className={`flex flex-col gap-3 transition-all duration-500 ${isUnlocked ? "" : "pointer-events-none"}`}
              style={
                isUnlocked ? {} : { filter: "blur(8px)", userSelect: "none" }
              }
            >
              <a
                href={isUnlocked ? `tel:${tutor.phone}` : undefined}
                className="flex items-center gap-3 p-3 rounded-[10px] bg-muted/40"
                data-ocid="unlock.phone_row"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(108,99,255,0.12)" }}
                >
                  <Phone size={16} style={{ color: "#6C63FF" }} />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground font-body">
                    Phone
                  </p>
                  <p className="font-display font-semibold text-foreground text-sm">
                    {isUnlocked ? tutor.phone : "+91 XXXXX XXXXX"}
                  </p>
                </div>
                {isUnlocked && (
                  <span
                    className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
                    }}
                  >
                    Call
                  </span>
                )}
              </a>

              <a
                href={isUnlocked ? `mailto:${tutor.email}` : undefined}
                className="flex items-center gap-3 p-3 rounded-[10px] bg-muted/40"
                data-ocid="unlock.email_row"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(79,158,248,0.12)" }}
                >
                  <Mail size={16} style={{ color: "#4F9EF8" }} />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground font-body">
                    Email
                  </p>
                  <p className="font-display font-semibold text-foreground text-sm">
                    {isUnlocked ? tutor.email : "XXXX@XXXXX.com"}
                  </p>
                </div>
                {isUnlocked && (
                  <span
                    className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, #4F9EF8 0%, #6C63FF 100%)",
                    }}
                  >
                    Mail
                  </span>
                )}
              </a>
            </div>

            {/* Lock overlay */}
            {!isUnlocked && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-card"
                  style={{
                    background:
                      "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
                  }}
                >
                  <Lock size={20} className="text-white" />
                </div>
                <p className="text-muted-foreground font-body text-[13px] text-center px-4">
                  Unlock to view contact details
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pricing Card */}
        <div
          className="bg-card rounded-[14px] shadow-card p-4"
          data-ocid="unlock.pricing_card"
        >
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-display font-bold text-foreground text-base">
              Unlock Contact Details
            </h2>
          </div>

          <div className="flex items-end gap-1.5 mb-4">
            <span
              className="font-display font-extrabold text-[32px] leading-none"
              style={{
                background: "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ₹99
            </span>
            <span className="text-muted-foreground font-body text-sm pb-1">
              /one time
            </span>
            {hasFreeUnlock && !isUnlocked && (
              <span
                className="ml-2 text-[11px] font-bold px-2 py-0.5 rounded-full text-white pb-1"
                style={{
                  background:
                    "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
                }}
              >
                FREE for you!
              </span>
            )}
          </div>

          <ul className="flex flex-col gap-2 mb-5">
            {["Direct phone number", "Email address", "WhatsApp ready"].map(
              (f) => (
                <li key={f} className="flex items-center gap-2.5">
                  <CheckCircle
                    size={16}
                    style={{ color: "#6C63FF" }}
                    className="shrink-0"
                  />
                  <span className="font-body text-sm text-foreground">{f}</span>
                </li>
              ),
            )}
          </ul>

          {/* Unlock / Unlocked button */}
          {isUnlocked ? (
            <Button
              disabled
              className="w-full h-[50px] rounded-full font-display font-bold text-base"
              style={{ background: "#22c55e", color: "white", opacity: 1 }}
              data-ocid="unlock.unlocked_button"
            >
              <Unlock size={18} className="mr-2" />
              Contact Unlocked ✓
            </Button>
          ) : (
            <Button
              onClick={handleUnlock}
              disabled={isLoading}
              className="w-full h-[50px] rounded-full font-display font-bold text-base text-white transition-smooth active:scale-95 hover:opacity-90 disabled:opacity-70"
              style={{
                background: "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
                border: "none",
              }}
              data-ocid="unlock.unlock_button"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : hasFreeUnlock ? (
                <>
                  <Gift size={18} className="mr-2" />
                  Use Free Unlock
                </>
              ) : (
                <>
                  <Unlock size={18} className="mr-2" />
                  Unlock for ₹99
                </>
              )}
            </Button>
          )}
        </div>

        {/* Trust Elements */}
        <div className="flex flex-col gap-3" data-ocid="unlock.trust_section">
          <div className="flex items-center justify-between gap-2">
            {[
              { icon: <Lock size={14} />, label: "Secure Payment" },
              { icon: <Shield size={14} />, label: "Verified Tutor" },
              { icon: <Star size={14} />, label: "Rated 4.8+" },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex-1 flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-[10px] bg-muted/40"
              >
                <span style={{ color: "#6C63FF" }}>{icon}</span>
                <span className="text-[11px] font-body font-semibold text-muted-foreground text-center leading-tight">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <p className="text-center text-muted-foreground font-body text-xs">
            🎓 10,000+ students connected across India
          </p>
        </div>

        {/* Book a Session CTA (shown when unlocked) */}
        {isUnlocked && (
          <div
            className="rounded-[14px] p-4 flex items-center justify-between gap-3"
            style={{
              background:
                "linear-gradient(135deg, rgba(108,99,255,0.08) 0%, rgba(79,158,248,0.08) 100%)",
              border: "1.5px solid rgba(108,99,255,0.2)",
            }}
            data-ocid="unlock.book_cta"
          >
            <div>
              <p className="font-display font-bold text-foreground text-sm">
                Book a Trial Class
              </p>
              <p className="font-body text-xs text-muted-foreground mt-0.5">
                Schedule your first session with {tutor.name}
              </p>
            </div>
            <Button
              onClick={() => router.navigate({ to: `/booking/${tutorId}` })}
              className="shrink-0 h-9 px-4 rounded-full font-display font-bold text-xs text-white"
              style={{
                background: "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
                border: "none",
              }}
              data-ocid="unlock.book_button"
            >
              Book Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
