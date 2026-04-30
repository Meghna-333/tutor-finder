import * as RadixSlider from "@radix-ui/react-slider";
import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, MapPin, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import type { ClassLevel, Subject } from "../types";

const CLASS_OPTIONS: ClassLevel[] = [
  "Class 1-5",
  "Class 6, 8, 10",
  "Class 11-12",
  "Graduation",
  "Competitive Exams",
];

const SUBJECT_OPTIONS: Subject[] = [
  "Maths",
  "Physics",
  "Chemistry",
  "Biology",
  "Science",
  "English",
  "Hindi",
  "History",
  "Social Studies",
  "Geography",
  "Environmental Sciences",
  "Computer Science",
  "Computer Applications",
  "Economics",
  "Accountancy",
  "Business Studies",
  "Commercial Studies",
  "Music",
  "Drawing",
  "Psychology",
  "Sociology",
  "Legal Studies",
];

export default function RequirementsPage() {
  const navigate = useNavigate();
  const { requirements, setRequirementsField } = useAppStore();

  const [classLevel, setClassLevel] = useState<ClassLevel | "">(
    requirements.classLevel,
  );
  const [subjects, setSubjects] = useState<Subject[]>(requirements.subjects);
  const [budget, setBudget] = useState(
    requirements.budgetMax > 500 ? requirements.budgetMax : 2000,
  );
  const [location, setLocation] = useState(requirements.location);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isValid = classLevel !== "" && subjects.length > 0;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function toggleSubject(subject: Subject) {
    setSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject],
    );
  }

  function detectLocation() {
    if (!navigator.geolocation) return;
    setDetectingLocation(true);
    setLocation("Detecting...");
    navigator.geolocation.getCurrentPosition(
      () => {
        setDetectingLocation(false);
        setLocation("Your area, Delhi");
      },
      () => {
        setDetectingLocation(false);
        setLocation("");
      },
      { timeout: 8000 },
    );
  }

  function handleSubmit() {
    if (!isValid) return;
    setRequirementsField("classLevel", classLevel);
    setRequirementsField("subjects", subjects);
    setRequirementsField("budgetMax", budget);
    setRequirementsField("budgetMin", 500);
    setRequirementsField("location", location);
    navigate({ to: "/tutors" });
  }

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      style={{ maxWidth: 480, margin: "0 auto" }}
      data-ocid="requirements.page"
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 pt-12 pb-5"
        style={{
          background: "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
        }}
      >
        <button
          type="button"
          onClick={() => navigate({ to: "/mode-select" })}
          className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 transition-all active:scale-95"
          aria-label="Go back"
          data-ocid="requirements.back_button"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M11 14L6 9L11 4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div>
          <h1
            className="text-white font-semibold text-lg leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            What are you looking for?
          </h1>
          <p className="text-white/80 text-sm mt-0.5">
            Tell us about your learning needs
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        {/* Class Selector */}
        <div data-ocid="requirements.class_section">
          <p className="block text-sm font-semibold text-foreground mb-2">
            Class / Grade
          </p>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((o) => !o)}
              className="w-full h-[52px] bg-white border-2 rounded-xl px-4 flex items-center justify-between transition-all"
              style={{
                borderColor: dropdownOpen ? "#6C63FF" : "#E5E7EB",
                boxShadow: dropdownOpen
                  ? "0 0 0 3px rgba(108,99,255,0.12)"
                  : "none",
              }}
              data-ocid="requirements.class_select"
            >
              <span
                className="text-base"
                style={{
                  fontWeight: classLevel ? 600 : 400,
                  color: classLevel ? "#111827" : "#9CA3AF",
                }}
              >
                {classLevel || "Select your class"}
              </span>
              <ChevronDown
                size={18}
                className="transition-transform duration-200"
                style={{
                  transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                  color: "#6C63FF",
                }}
              />
            </button>

            {dropdownOpen && (
              <div
                className="absolute z-50 w-full mt-1 bg-white rounded-xl overflow-hidden"
                style={{
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  border: "1px solid #E5E7EB",
                }}
                data-ocid="requirements.class_dropdown"
              >
                {CLASS_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setClassLevel(opt);
                      setDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3.5 text-left text-sm transition-colors hover:bg-purple-50 flex items-center justify-between"
                    style={{
                      color: classLevel === opt ? "#6C63FF" : "#374151",
                    }}
                    data-ocid={`requirements.class_option.${CLASS_OPTIONS.indexOf(opt) + 1}`}
                  >
                    <span
                      style={{ fontWeight: classLevel === opt ? 600 : 400 }}
                    >
                      {opt}
                    </span>
                    {classLevel === opt && (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M3 8L6.5 11.5L13 5"
                          stroke="#6C63FF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Subjects Multi-select */}
        <div data-ocid="requirements.subjects_section">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-foreground">
              Subjects <span className="text-red-500">*</span>
            </p>
            {subjects.length > 0 && (
              <span className="text-xs text-purple-600 font-medium">
                {subjects.length} selected
              </span>
            )}
          </div>
          <div
            className="flex flex-wrap gap-2"
            data-ocid="requirements.subjects_list"
          >
            {SUBJECT_OPTIONS.map((subject, i) => {
              const selected = subjects.includes(subject);
              return (
                <button
                  key={subject}
                  type="button"
                  onClick={() => toggleSubject(subject)}
                  className="px-3.5 py-2 rounded-full text-sm font-medium transition-all active:scale-95 border"
                  style={
                    selected
                      ? {
                          background:
                            "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
                          color: "white",
                          border: "none",
                          boxShadow: "0 2px 8px rgba(108,99,255,0.3)",
                        }
                      : {
                          background: "white",
                          color: "#6B7280",
                          borderColor: "#E5E7EB",
                        }
                  }
                  data-ocid={`requirements.subject_chip.${i + 1}`}
                >
                  {subject}
                  {selected && (
                    <X
                      size={12}
                      className="inline ml-1.5 -mt-0.5"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
          {subjects.length === 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Select at least one subject to continue
            </p>
          )}
        </div>

        {/* Budget Slider */}
        <div data-ocid="requirements.budget_section">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-foreground">
              Monthly Budget
            </p>
            <span
              className="text-sm font-bold px-3 py-1 rounded-full"
              style={{
                background: "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
                color: "white",
              }}
              data-ocid="requirements.budget_display"
            >
              ₹{budget.toLocaleString("en-IN")}/month
            </span>
          </div>

          <div className="px-1">
            <RadixSlider.Root
              className="relative flex items-center select-none touch-none w-full"
              style={{ height: 28 }}
              min={500}
              max={5000}
              step={100}
              value={[budget]}
              onValueChange={(val) => setBudget(val[0])}
              data-ocid="requirements.budget_slider"
            >
              <RadixSlider.Track
                className="relative grow rounded-full"
                style={{ height: 6, background: "#E5E7EB" }}
              >
                <RadixSlider.Range
                  className="absolute h-full rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, #6C63FF 0%, #4F9EF8 100%)",
                  }}
                />
              </RadixSlider.Track>
              <RadixSlider.Thumb
                className="block rounded-full border-2 border-white focus:outline-none"
                style={{
                  width: 24,
                  height: 24,
                  background:
                    "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
                  boxShadow: "0 2px 8px rgba(108,99,255,0.5)",
                  cursor: "pointer",
                }}
                aria-label="Budget"
              />
            </RadixSlider.Root>
          </div>

          <div className="flex justify-between mt-2">
            <span className="text-xs text-muted-foreground">₹500</span>
            <span className="text-xs text-muted-foreground">₹5,000+</span>
          </div>
        </div>

        {/* Location */}
        <div data-ocid="requirements.location_section">
          <label
            htmlFor="location-input"
            className="block text-sm font-semibold text-foreground mb-2"
          >
            Your Location
          </label>
          <div
            className="flex items-center gap-3 h-[52px] bg-white border-2 rounded-xl px-4 transition-all focus-within:border-purple-400"
            style={{ borderColor: "#E5E7EB" }}
          >
            <MapPin
              size={18}
              style={{ color: "#6C63FF", flexShrink: 0 }}
              aria-hidden="true"
            />
            <input
              id="location-input"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your locality or city"
              className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
              style={{ fontFamily: "var(--font-body)" }}
              data-ocid="requirements.location_input"
            />
          </div>
          <button
            type="button"
            onClick={detectLocation}
            disabled={detectingLocation}
            className="mt-2 text-xs font-medium px-3 py-1.5 rounded-lg border-2 transition-all active:scale-95 disabled:opacity-50"
            style={{
              borderColor: "#6C63FF",
              color: "#6C63FF",
              background: "white",
            }}
            data-ocid="requirements.detect_location_button"
          >
            {detectingLocation ? "Detecting..." : "📍 Detect my location"}
          </button>
        </div>

        {/* Spacer for CTA */}
        <div className="h-4" />
      </div>

      {/* CTA Button */}
      <div
        className="px-4 pb-8 pt-3 bg-background"
        style={{ boxShadow: "0 -4px 20px rgba(0,0,0,0.06)" }}
      >
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full h-[50px] rounded-xl text-white font-semibold text-base transition-all active:scale-[0.98]"
          style={{
            background: isValid
              ? "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)"
              : "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
            opacity: isValid ? 1 : 0.45,
            boxShadow: isValid ? "0 4px 16px rgba(108,99,255,0.4)" : "none",
            fontFamily: "var(--font-display)",
          }}
          data-ocid="requirements.find_tutors_button"
        >
          Find Tutors →
        </button>
        {!isValid && (
          <p
            className="text-center text-xs text-muted-foreground mt-2"
            data-ocid="requirements.validation_hint"
          >
            {classLevel === "" && subjects.length === 0
              ? "Select class and at least one subject"
              : classLevel === ""
                ? "Select your class to continue"
                : "Select at least one subject"}
          </p>
        )}
      </div>
    </div>
  );
}
