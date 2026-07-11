"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Is YojanaSaathi a government website?",
    a: "No. YojanaSaathi is an independent, open-source project built by community contributors. We are not affiliated with the Government of India, any state government, or any government agency. We clearly mark this distinction throughout the site — always verify eligibility with the relevant government authority before applying.",
  },
  {
    q: "How is my eligibility calculated?",
    a: "By a deterministic rule engine — not an AI or LLM. Every eligibility decision is made by comparing your profile against published scheme rules (age limits, income thresholds, residency requirements, etc.). You get a clear, auditable reason for every match and every exclusion.",
  },
  {
    q: "Is my data safe?",
    a: "Your profile data is encrypted in transit and at rest. We never share your personal information with third parties. You can delete your account and all associated data at any time. See our Privacy Policy for details.",
  },
  {
    q: "Which schemes are covered?",
    a: "We currently map over 20 central and state schemes across agriculture, housing, health, education, pension, and women & child welfare categories. The scheme library is community-maintained and growing — contributions are welcome on GitHub.",
  },
  {
    q: "Does this guarantee I'll get benefits?",
    a: "No. Our eligibility check tells you which schemes you likely qualify for based on published rules. Final approval rests with the respective government authority. We provide pre-filled application drafts to make the process easier, but we cannot guarantee outcomes.",
  },
  {
    q: "How is this different from a LLM chatbot?",
    a: "We never use a language model to decide your eligibility. The rule engine is deterministic — same profile always produces the same results. We do use an LLM for one narrow task: polishing the language of benefit summaries and application drafts, with a hardcoded fallback if the LLM is unavailable.",
  },
];

function AccordionItem({
  faq,
  isOpen,
  onClick,
}: {
  faq: (typeof faqs)[0];
  isOpen: boolean;
  onClick: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    gsap.killTweensOf(el);
    gsap.to(el, {
      height: isOpen ? "auto" : 0,
      opacity: isOpen ? 1 : 0,
      duration: 0.25,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, [isOpen]);

  return (
    <div
      className={cn(
        "rounded-xl border transition-colors",
        isOpen
          ? "border-ink-navy/15 bg-white shadow-sm"
          : "border-ink-navy/8 bg-white/60 hover:bg-white hover:border-ink-navy/12"
      )}
    >
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="pr-4 text-sm font-semibold text-ink-navy sm:text-base">
          {faq.q}
        </span>
        <svg
          className={cn(
            "h-5 w-5 flex-shrink-0 text-slate-blue-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden"
        style={{ height: 0, opacity: 0 }}
      >
        <div className="border-t border-ink-navy/8 px-5 pb-4 pt-3">
          <p className="text-sm leading-relaxed text-slate-blue">{faq.a}</p>
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="border-t border-ink-navy/8 bg-warm-paper py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-navy sm:text-4xl">
            Common questions
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-blue">
            Quick answers to the things most people ask.
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              faq={faq}
              isOpen={open === i}
              onClick={() => setOpen(open === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
