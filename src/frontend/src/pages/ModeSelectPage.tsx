import { useNavigate } from "@tanstack/react-router";
import { ChevronRight, Home, School } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import type { LearningMode } from "../types";

interface ModeCardProps {
  mode: LearningMode;
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  onSelect: (mode: LearningMode) => void;
  isSelected: boolean;
  ocid: string;
}

function ModeCard({
  mode,
  icon,
  title,
  description,
  badge,
  onSelect,
  isSelected,
  ocid,
}: ModeCardProps) {
  return (
    <motion.button
      data-ocid={ocid}
      whileTap={{ scale: 0.98 }}
      animate={isSelected ? { scale: [1, 0.98, 1] } : { scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={() => onSelect(mode)}
      className="w-full text-left focus:outline-none"
    >
      <div
        className={`
          flex items-center gap-4 w-full bg-card
          transition-all duration-200 cursor-pointer
          ${
            isSelected
              ? "border-2 border-[#6C63FF]/60"
              : "border border-border hover:border-[#6C63FF]/30"
          }
        `}
        style={{
          minHeight: "88px",
          borderRadius: "16px",
          padding: "16px",
          boxShadow: isSelected
            ? "0 8px 20px rgba(108,99,255,0.22)"
            : "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        {/* Icon circle */}
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-full"
          style={{
            width: "52px",
            height: "52px",
            background: "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
          }}
        >
          {icon}
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="font-display font-bold text-foreground"
              style={{ fontSize: "17px" }}
            >
              {title}
            </span>
            {badge && (
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full font-semibold"
                style={{
                  background: "rgba(34,197,94,0.12)",
                  color: "#16a34a",
                  fontSize: "11px",
                }}
              >
                {badge}
              </span>
            )}
          </div>
          <p
            className="text-muted-foreground font-body mt-0.5 leading-snug"
            style={{ fontSize: "13px" }}
          >
            {description}
          </p>
        </div>

        {/* Arrow */}
        <ChevronRight
          size={20}
          className="flex-shrink-0 text-muted-foreground transition-transform duration-200"
          style={
            isSelected
              ? { transform: "translateX(2px)", color: "#6C63FF" }
              : undefined
          }
        />
      </div>
    </motion.button>
  );
}

export default function ModeSelectPage() {
  const navigate = useNavigate();
  const setSelectedMode = useAppStore((s) => s.setSelectedMode);
  const [selected, setSelected] = useState<LearningMode | null>(null);

  const handleSelect = (mode: LearningMode) => {
    setSelected(mode);
    setSelectedMode(mode);

    // Short delay for animation feel before navigating
    setTimeout(() => {
      navigate({ to: "/requirements" });
    }, 180);
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      style={{ maxWidth: "480px", margin: "0 auto" }}
      data-ocid="mode_select.page"
    >
      {/* Gradient header strip */}
      <div
        className="flex-shrink-0 flex items-center justify-center"
        style={{
          height: "80px",
          background: "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex items-center gap-2"
        >
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: "28px",
              height: "28px",
              background: "rgba(255,255,255,0.2)",
            }}
          >
            <School size={16} color="white" />
          </div>
          <span
            className="font-display font-bold text-white"
            style={{ fontSize: "20px", letterSpacing: "-0.3px" }}
          >
            TutorFinder
          </span>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        {/* Header text */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
          className="mb-8"
        >
          <h1
            className="font-display font-bold text-foreground leading-tight mb-2"
            style={{ fontSize: "24px" }}
          >
            How do you want to learn?
          </h1>
          <p
            className="text-muted-foreground font-body"
            style={{ fontSize: "15px" }}
          >
            Choose what works best for you
          </p>
        </motion.div>

        {/* Mode cards */}
        <div className="flex flex-col" style={{ gap: "16px" }}>
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          >
            <ModeCard
              mode="home"
              icon={<Home size={24} color="white" strokeWidth={2} />}
              title="Learn at Home"
              description="Tutor comes to your doorstep"
              badge="Most Popular"
              onSelect={handleSelect}
              isSelected={selected === "home"}
              ocid="mode_select.learn_at_home.button"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
          >
            <ModeCard
              mode="tutor"
              icon={<School size={24} color="white" strokeWidth={2} />}
              title="Go to Tutor"
              description="Learn at tutor's location, save ₹100/hr"
              onSelect={handleSelect}
              isSelected={selected === "tutor"}
              ocid="mode_select.go_to_tutor.button"
            />
          </motion.div>
        </div>

        {/* Trust note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 flex flex-col items-center gap-1.5"
          style={{ paddingBottom: "16px" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "linear-gradient(135deg, #6C63FF, #4F9EF8)",
              }}
            />
            <span
              className="text-muted-foreground font-body text-center"
              style={{ fontSize: "13px" }}
            >
              Both modes are available across India
            </span>
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "linear-gradient(135deg, #6C63FF, #4F9EF8)",
              }}
            />
          </div>
          <span
            className="text-muted-foreground font-body"
            style={{ fontSize: "12px", opacity: 0.6 }}
          >
            500+ verified tutors in your city
          </span>
        </motion.div>
      </div>
    </div>
  );
}
