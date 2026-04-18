import Kicker from "@/components/shared/Kicker";
import SectionDivider from "@/components/shared/SectionDivider";
import { BookOpen } from "lucide-react";

export default function JournalPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Kicker numeral="VII" className="mb-3">
        THE JOURNAL
      </Kicker>
      <h1 className="font-serif text-3xl md:text-4xl text-text-primary mb-2">
        Kitchen notes.
      </h1>
      <p className="text-sm text-text-secondary mb-8">
        A space for reflections, substitutions, and the quiet evolution of your cooking practice.
      </p>

      <SectionDivider />

      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-bg-card border border-border flex items-center justify-center mb-6">
          <BookOpen className="w-7 h-7 text-text-tertiary" />
        </div>
        <h3 className="font-serif text-xl text-text-primary mb-2">
          Coming in the next issue.
        </h3>
        <p className="text-sm text-text-secondary max-w-sm leading-relaxed">
          The Journal is being typeset. Soon you&apos;ll be able to annotate recipes,
          log substitutions, and keep a running record of what worked — and what didn&apos;t.
        </p>
        <div className="mt-8 px-4 py-2 bg-bg-card border border-border rounded-full">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
            Est. Issue Nº 002
          </span>
        </div>
      </div>
    </div>
  );
}
