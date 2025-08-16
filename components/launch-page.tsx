"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Gavel, MoveRight, Scale, BookOpen, ShieldCheck, User, Globe, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { SplashCursor } from "./splash-cursor";
import toast from "react-hot-toast";
import ShiftingCountdown from "./ui/countdown-timer";
import { SplashCursor } from "./ui/splash-cursor";
import { Input } from "./ui/input";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { joinWaitlistThunk } from "@/store/reducers/waitlistSlice";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function LaunchPage() {

  ///////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////////
  const titles = useMemo(() => ["powerful", "reliable", "dynamic", "secure", "modern"], []);

  ///////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////
  const [titleNumber, setTitleNumber] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [referralLink, setReferralLink] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const params = useSearchParams();

  ///////////////////////////////////////////////////// USE EFFECTS /////////////////////////////////////////////////////////////
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev === titles.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  useEffect(() => {
    const ref = params?.get("ref");
    if (ref) setReferredBy(ref);
  }, [params]);

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Referral link copied");
    } catch {
      toast.error("Failed to copy link");
    }
  }

  ///////////////////////////////////////////////////// FUNCTION /////////////////////////////////////////////////////////////
  async function handleNotify(e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) {
    e?.preventDefault?.();
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    try {
      setSubmitting(true);
      const entry = await dispatch(joinWaitlistThunk({ email, name: name || undefined, referredBy: referredBy || undefined, signupSource: "landing_coming_soon" })).unwrap();
      setEmail("");
      if (entry?.referralCode) {
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        setReferralLink(`${origin}?ref=${entry.referralCode}`);
      }
    } catch {
    } finally {
      setSubmitting(false);
    }
  }

  ///////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////////
  return (
    <>
      <SplashCursor />

      <FloatingIcon Icon={Scale} delay={0} x={10} y={10} />
      <FloatingIcon Icon={FileText} delay={2} x={90} y={15} />
      <FloatingIcon Icon={Gavel} delay={4} x={20} y={40} />
      <FloatingIcon Icon={BookOpen} delay={6} x={15} y={85} />
      <FloatingIcon Icon={ShieldCheck} delay={8} x={50} y={95} />
      <FloatingIcon Icon={User} delay={10} x={90} y={95} />
      <FloatingIcon Icon={Briefcase} delay={12} x={70} y={30} />
      <FloatingIcon Icon={Globe} delay={14} x={80} y={70} />

      <div className="w-full relative min-h-screen flex items-center justify-center px-6">

        <div className="container mx-auto flex flex-col items-center text-center gap-10 max-w-4xl">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button variant="secondary" size="sm" className="gap-2 rounded-full px-4">
              QanoonMate is Coming <MoveRight className="w-4 h-4" />
            </Button>
          </motion.div>

          {/* Headline */}
          {/* Headline */}
          <motion.h1
            className="flex flex-col items-center text-center text-6xl md:text-8xl font-semibold tracking-tighter leading-tight md:leading-[1.1]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="flex gap-5">
              <span className="text-primary">Your</span>
              <span className="relative h-[1.2em] w-[6.5ch]"> {/* more width */}
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute inset-0 font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark text-left"
                    initial={{ opacity: 0, y: "-100%" }}
                    animate={
                      titleNumber === index
                        ? { y: 0, opacity: 1 }
                        : { y: titleNumber > index ? "-150%" : "150%", opacity: 0 }
                    }
                    transition={{ type: "spring", stiffness: 60 }}
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </div>
            <span>Legal Companion</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Launching <strong>August 20, 2025</strong>. Your AI-powered partner for legal knowledge, case management, and seamless lawyer–client collaboration.
          </motion.p>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <ShiftingCountdown />
          </motion.div>

          {/* Waitlist */}
          {referralLink ? (
            <motion.div
              className="w-full max-w-xl mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-full rounded-lg border bg-card text-card-foreground p-4 shadow-sm">
                <div className="text-left">
                  <h3 className="text-lg font-semibold">You are in!</h3>
                  <p className="text-sm text-muted-foreground mt-1">Share your referral link and invite friends:</p>
                </div>
                <div className="mt-3 flex gap-2">
                  <Input readOnly value={referralLink} className="h-10 flex-1" />
                  <Button variant="outline" className="h-10" onClick={() => copy(referralLink)}>Copy</Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <>
              <motion.form
                onSubmit={handleNotify}
                className="flex flex-col gap-3 mt-4 w-full max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Input
                  placeholder="Your name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10"
                />
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter your email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 flex-1"
                    required
                  />
                  <Button className="gap-3 h-10" type="submit" disabled={submitting}>
                    {submitting ? "Joining..." : "Join Waitlist"} <MoveRight className="w-4 h-4" />
                  </Button>
                </div>
                {referredBy ? (
                  <p className="text-xs text-muted-foreground">Referred by code: <span className="font-medium">{referredBy}</span></p>
                ) : null}
              </motion.form>
            </>
          )}

          <div className='mt-4' >
            <span className="text-muted-foreground" >Are you a beta user user? <Link href='/beta' className='text-primary underline'>Click here</Link></span>
          </div>

        </div>
      </div>
    </>
  );
}

export default LaunchPage;


function FloatingIcon({ Icon, delay, x, y }: { Icon: any; delay: number; x: number; y: number }) {
  return (
    <motion.div
      className="fixed text-primary/30"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{
        y: [0, -10, 0],
        x: [0, 5, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        repeat: Infinity,
        duration: 6,
        ease: "easeInOut",
        delay,
      }}
    >
      <Icon size={36} />
    </motion.div>
  );
}
