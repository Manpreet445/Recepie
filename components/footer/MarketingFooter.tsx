import Wordmark from "@/components/shared/Wordmark";
import SectionDivider from "@/components/shared/SectionDivider";

export default function MarketingFooter() {
  return (
    <footer className="mt-auto bg-bg-deep">
      <SectionDivider glyph="◆" className="my-0 px-8" />

      <div className="max-w-5xl mx-auto px-8 py-16 text-center">
        <p className="kicker text-[10px] text-forest mb-4">
          Coming soon
        </p>
        <h3 className="font-headline text-2xl md:text-3xl text-text-primary mb-3">
          Join the kitchen.
        </h3>
        <p className="font-body text-sm text-text-secondary max-w-md mx-auto mb-8">
          Sign up for early access when we open reservations. We&apos;ll keep the kettle on.
        </p>

        <div className="flex items-center gap-3 justify-center max-w-sm mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 px-4 py-2.5 bg-bg-card border-[0.5px] border-[#6d7a73]/40 text-sm text-text-primary placeholder:text-text-tertiary focus:border-forest/40 focus:outline-none transition-colors"
          />
          <button className="px-5 py-2.5 bg-forest text-bg-page kicker text-xs hover:bg-forest-subtle transition-colors font-medium">
            Notify me
          </button>
        </div>

        <SectionDivider className="max-w-xs mx-auto" />

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
