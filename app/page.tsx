import HomeNav from "@/components/nav/HomeNav";
import MarketingFooter from "@/components/footer/MarketingFooter";
import Kicker from "@/components/shared/Kicker";
import SectionDivider from "@/components/shared/SectionDivider";
import { ModeCard } from "@/components/shared/Cards";
import { UtensilsCrossed, Refrigerator } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <HomeNav />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-8">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-teal/3 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-teal/[0.03] blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <Kicker numeral="I" className="mb-6">
            THE ATELIER
          </Kicker>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-text-primary leading-[1.05] mb-6">
            Intelligent
            <br />
            <span className="text-gradient-teal">meal design.</span>
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-lg mx-auto leading-relaxed mb-12">
            A dark-mode culinary atelier for the discerning home cook.
            AI-powered meal plans, pantry-driven recipes, and nutritional
            precision.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
            <ModeCard
              title="Meal Prep"
              subtitle="Protocol"
              description="Input your dossier. Receive a calibrated meal plan with macros, ingredients, and ritual instructions."
              href="/meal-prep/dossier"
              icon={<UtensilsCrossed className="w-5 h-5" />}
              accent="teal"
            />
            <ModeCard
              title="Pantry"
              subtitle="Inventory"
              description="Tell us what you have. We'll match your ingredients to recipes with precision and purpose."
              href="/pantry"
              icon={<Refrigerator className="w-5 h-5" />}
              accent="amber"
            />
          </div>
        </div>
      </section>

      <SectionDivider glyph="◆" />

      {/* Features strip */}
      <section className="max-w-5xl mx-auto px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Nutritional Precision",
              desc: "Mifflin-St Jeor TDEE calculations with goal-adjusted macros. Every calorie accounted for.",
            },
            {
              title: "AI Recipe Generation",
              desc: "Gemini-powered meal plans with editorial recipe rituals. Not just ingredients — technique.",
            },
            {
              title: "Pantry Intelligence",
              desc: "Match what you have to what you can make. Minimize waste, maximize flavor.",
            },
          ].map((feature) => (
            <div key={feature.title} className="text-center md:text-left">
              <h3 className="font-serif text-lg text-text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <MarketingFooter />
    </>
  );
}
