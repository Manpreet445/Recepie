import Wordmark from "@/components/shared/Wordmark";

export default function MarketingFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-paper-deep">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center md:px-8">
        <p className="kicker mb-4 text-[10px] text-terracotta">Coming soon</p>
        <h2 className="display mb-3 text-3xl text-ink md:text-4xl">Join the kitchen.</h2>
        <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-ink-soft">
          We will send one note when accounts open — saved plans, your own recipe box, no
          weekly newsletter.
        </p>

        <form className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
          <div className="flex-1 text-left">
            <label htmlFor="notify-email" className="kicker mb-1.5 block text-[10px] text-ink-faint">
              Email address
            </label>
            <input
              id="notify-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="min-h-11 w-full rounded-sm border border-line-strong bg-surface px-4 text-sm text-ink transition-colors placeholder:text-ink-faint focus:border-terracotta focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="kicker mt-auto inline-flex min-h-11 cursor-pointer items-center justify-center rounded-sm bg-terracotta px-6 text-[11px] text-on-terracotta transition-colors hover:bg-terracotta-deep"
          >
            Notify me
          </button>
        </form>

        <div className="mt-16 flex flex-col items-center gap-4 border-t border-line pt-10">
          <Wordmark size="sm" />
          <p className="numeric text-[11px] text-ink-faint">
            © {new Date().getFullYear()} Recepie · Guest mode · Nothing is stored
          </p>
        </div>
      </div>
    </footer>
  );
}
