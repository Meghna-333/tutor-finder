import { useNavigate } from "@tanstack/react-router";
import { OTPInput, REGEXP_ONLY_DIGITS } from "input-otp";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAppStore } from "../store/useAppStore";

type Screen = "phone" | "otp";

const OTP_SLOT_IDS = ["d1", "d2", "d3", "d4", "d5", "d6"] as const;

export default function LoginPage() {
  const navigate = useNavigate();
  const setCurrentUserPhone = useAppStore((s) => s.setCurrentUserPhone);

  const [screen, setScreen] = useState<Screen>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start countdown when OTP screen mounts
  useEffect(() => {
    if (screen === "otp") {
      setResendTimer(30);
      setCanResend(false);
      timerRef.current = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screen]);

  const handleSendOtp = () => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      setPhoneError("Please enter a valid 10-digit mobile number");
      return;
    }
    setPhoneError("");
    setScreen("otp");
  };

  const handleVerifyOtp = () => {
    if (otp.length !== 6) {
      setOtpError("Please enter the 6-digit OTP");
      return;
    }
    setOtpError("");
    setCurrentUserPhone(`+91${phone}`);
    navigate({ to: "/mode-select" });
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtp("");
    setOtpError("");
    setResendTimer(30);
    setCanResend(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const maskedPhone = phone.replace(/\D/g, "").slice(0, 10);
  const displayMasked =
    maskedPhone.length >= 6
      ? `${maskedPhone.slice(0, 2)}XXXXXX${maskedPhone.slice(-2)}`
      : maskedPhone;

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-5"
      style={{
        background:
          "linear-gradient(180deg, #ffffff 0%, #F3F0FF 60%, #EBF4FF 100%)",
      }}
    >
      <div className="w-full max-w-[420px] flex flex-col min-h-screen py-10">
        {/* ── PHONE ENTRY SCREEN ── */}
        {screen === "phone" && (
          <div className="flex flex-col flex-1">
            {/* Logo block */}
            <div className="flex flex-col items-center mt-16 mb-12">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-[0_8px_24px_rgba(108,99,255,0.28)]"
                style={{
                  background:
                    "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
                }}
              >
                <BookOpen className="w-10 h-10 text-white" strokeWidth={1.8} />
              </div>
              <h1
                className="text-3xl font-bold tracking-tight"
                style={{
                  fontFamily: "var(--font-display)",
                  background:
                    "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                TutorFinder
              </h1>
              <p className="text-muted-foreground text-sm mt-2 font-body">
                Find the best tutors near you
              </p>
            </div>

            {/* Phone input card */}
            <div
              className="rounded-2xl p-6 flex flex-col gap-5"
              style={{
                background: "#fff",
                boxShadow: "0 4px 24px rgba(108,99,255,0.10)",
                border: "1px solid rgba(108,99,255,0.10)",
              }}
            >
              <div>
                <p
                  className="text-foreground font-semibold text-base mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Enter your mobile number
                </p>

                {/* Country code + input */}
                <div
                  className={`flex items-center gap-0 rounded-[14px] overflow-hidden border-2 transition-all duration-200 ${
                    phoneError
                      ? "border-red-400"
                      : "border-border focus-within:border-[#6C63FF]"
                  }`}
                  style={{ background: "#F8F8FF" }}
                >
                  <div className="flex items-center gap-1.5 px-3 py-3.5 border-r border-border bg-white/50 shrink-0">
                    <span className="text-lg leading-none">🇮🇳</span>
                    <span className="text-foreground font-semibold text-sm font-body">
                      +91
                    </span>
                  </div>
                  <input
                    data-ocid="login.phone_input"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => {
                      const val = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
                      setPhone(val);
                      if (phoneError) setPhoneError("");
                    }}
                    className="flex-1 px-4 py-3.5 bg-transparent text-foreground placeholder-muted-foreground font-body text-base outline-none"
                  />
                </div>

                {phoneError && (
                  <p
                    data-ocid="login.phone_field_error"
                    className="text-red-500 text-xs mt-1.5 font-body"
                  >
                    {phoneError}
                  </p>
                )}
              </div>

              <p className="text-muted-foreground text-xs text-center font-body">
                We'll send a 6-digit OTP to this number
              </p>

              {/* CTA Button */}
              <button
                data-ocid="login.send_otp_button"
                type="button"
                onClick={handleSendOtp}
                className="w-full h-[52px] rounded-[14px] text-white font-semibold text-base transition-all duration-200 active:scale-[0.98] hover:opacity-90 shadow-[0_4px_16px_rgba(108,99,255,0.35)]"
                style={{
                  background:
                    "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
                  fontFamily: "var(--font-display)",
                }}
              >
                Send OTP →
              </button>
            </div>

            {/* Terms */}
            <p className="text-muted-foreground text-xs text-center mt-6 font-body leading-relaxed px-4">
              By continuing, you agree to our{" "}
              <span className="text-[#6C63FF] underline cursor-pointer">
                Terms of Service
              </span>{" "}
              &amp;{" "}
              <span className="text-[#6C63FF] underline cursor-pointer">
                Privacy Policy
              </span>
            </p>
          </div>
        )}

        {/* ── OTP ENTRY SCREEN ── */}
        {screen === "otp" && (
          <div className="flex flex-col flex-1">
            {/* Back header */}
            <div className="flex items-center gap-3 mt-2 mb-10">
              <button
                data-ocid="login.back_button"
                type="button"
                onClick={() => {
                  setScreen("phone");
                  setOtp("");
                  setOtpError("");
                }}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-smooth"
                style={{ background: "#F3F0FF" }}
              >
                <ArrowLeft className="w-5 h-5 text-[#6C63FF]" />
              </button>
              <span
                className="text-lg font-semibold text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Verify your number
              </span>
            </div>

            {/* Icon */}
            <div className="flex flex-col items-center mb-8">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-[0_6px_20px_rgba(108,99,255,0.22)]"
                style={{
                  background:
                    "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
                }}
              >
                <BookOpen className="w-8 h-8 text-white" strokeWidth={1.8} />
              </div>
              <p className="text-muted-foreground text-sm font-body text-center">
                OTP sent to{" "}
                <span className="text-foreground font-semibold">
                  +91 {displayMasked}
                </span>
              </p>
            </div>

            {/* OTP Card */}
            <div
              className="rounded-2xl p-6 flex flex-col gap-5"
              style={{
                background: "#fff",
                boxShadow: "0 4px 24px rgba(108,99,255,0.10)",
                border: "1px solid rgba(108,99,255,0.10)",
              }}
            >
              <p
                className="text-foreground font-semibold text-base"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Enter 6-digit OTP
              </p>

              {/* OTP input */}
              <OTPInput
                data-ocid="login.otp_input"
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                value={otp}
                onChange={(val) => {
                  setOtp(val);
                  if (otpError) setOtpError("");
                }}
                containerClassName="flex items-center justify-center gap-2"
                render={({ slots }) => (
                  <>
                    {slots.map((slot, i) => (
                      <div
                        key={OTP_SLOT_IDS[i]}
                        className={`
                          w-12 h-14 flex items-center justify-center rounded-[12px]
                          text-xl font-bold text-foreground border-2 transition-all duration-200
                          ${
                            slot.isActive
                              ? "border-[#6C63FF] shadow-[0_0_0_3px_rgba(108,99,255,0.15)]"
                              : slot.char
                                ? "border-[#6C63FF]/50 bg-[#F3F0FF]/60"
                                : "border-border bg-muted/30"
                          }
                        `}
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {slot.char ?? ""}
                        {slot.hasFakeCaret && (
                          <div className="w-0.5 h-5 bg-[#6C63FF] animate-pulse ml-0.5" />
                        )}
                      </div>
                    ))}
                  </>
                )}
              />

              {otpError && (
                <p
                  data-ocid="login.otp_field_error"
                  className="text-red-500 text-xs text-center font-body"
                >
                  {otpError}
                </p>
              )}

              {/* Verify button */}
              <button
                data-ocid="login.verify_otp_button"
                type="button"
                onClick={handleVerifyOtp}
                className="w-full h-[52px] rounded-[14px] text-white font-semibold text-base transition-all duration-200 active:scale-[0.98] hover:opacity-90 shadow-[0_4px_16px_rgba(108,99,255,0.35)]"
                style={{
                  background:
                    "linear-gradient(135deg, #6C63FF 0%, #4F9EF8 100%)",
                  fontFamily: "var(--font-display)",
                }}
              >
                Verify OTP ✓
              </button>

              {/* Resend */}
              <div className="text-center">
                {canResend ? (
                  <button
                    data-ocid="login.resend_otp_button"
                    type="button"
                    onClick={handleResend}
                    className="text-[#6C63FF] font-semibold text-sm font-body underline"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <p className="text-muted-foreground text-sm font-body">
                    Resend OTP in{" "}
                    <span className="text-[#6C63FF] font-semibold">
                      {resendTimer}s
                    </span>
                  </p>
                )}
              </div>
            </div>

            <p className="text-muted-foreground text-xs text-center mt-6 font-body leading-relaxed px-4">
              Didn't receive? Check your SMS inbox or try a different number.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
