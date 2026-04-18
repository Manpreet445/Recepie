import Wordmark from "@/components/shared/Wordmark";
import SectionDivider from "@/components/shared/SectionDivider";

export default function MarketingFooter() {
  return (
    <footer className="mt-auto bg-bg-deep">
      <SectionDivider glyph="◆" className="my-0 px-8" />

      <div className="max-w-5xl mx-auto px-8 py-16 text-center">
        {/* CTA placeholder */}
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal mb-4">
          Coming soon
        </p>
        <h3 className="font-serif text-2xl md:text-3xl text-text-primary mb-3">
          Join the kitchen.
        </h3>
        <p className="text-sm text-text-secondary max-w-md mx-auto mb-8">
          Sign up for early access when we open reservations. We&apos;ll keep the kettle on.
        </p>

        <div className="flex items-center gap-3 justify-center max-w-sm mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 px-4 py-2.5 bg-bg-card border border-border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:border-teal/40 focus:outline-none transition-colors"
          />
          <button className="px-5 py-2.5 bg-teal text-bg-page font-mono text-xs uppercase tracking-[0.1em] rounded-lg hover:bg-teal-subtle transition-colors font-medium">
            Notify me
          </button>
        </div>

        <SectionDivider className="max-w-xs mx-auto" />

        {/* Bottom */}
        <div className="flex flex-col items-center gap-4">
          <Wordmark size="sm" />
          <p className="text-[10px] text-text-tertiary">
            © {new Date().getFullYear()} RECEPIE · Issue Nº 001 · Guest mode
          </p>
        </div>
      </div>
    </footer>
  );
}
