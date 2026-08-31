import Kicker from "@/components/shared/Kicker";
import { BookOpen } from "lucide-react";

export default function JournalPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Kicker numeral="VII" className="mb-5">
        The journal
      </Kicker>
      <h1 className="display mb-4 text-4xl text-ink md:text-5xl">Kitchen notes.</h1>
      <p className="mb-12 text-lg leading-relaxed text-ink-soft">
        A place for substitutions that worked, timings that did not, and the slow
        drift of a recipe into something of your own.
      </p>

      <div className="card flex flex-col items-center px-6 py-16 text-center">
        <span
          aria-hidden="true"
          className="mb-6 flex h-16 w-16 items-center justify-center rounded-pill bg-terracotta-wash"
        >
          <BookOpen className="h-7 w-7 text-terracotta" />
        </span>
        <h2 className="mb-3 font-headline text-2xl text-ink">Still being typeset.</h2>
        <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
          Soon you will be able to annotate any recipe, log what you swapped, and
          keep a running record of what actually worked in your kitchen.
        </p>
        <p className="kicker mt-8 rounded-pill border border-line-strong bg-surface-muted px-4 py-2 text-[10px] text-ink-faint">
          Expected in the next release
        </p>
      </div>
    </div>
  );
}
