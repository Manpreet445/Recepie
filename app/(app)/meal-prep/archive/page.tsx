import Kicker from "@/components/shared/Kicker";
import StatusBadge from "@/components/shared/StatusBadge";
import { mockArchive } from "@/lib/mocks/data";
import { Calendar, Flame, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ArchivePage() {
  return (
    <div>
      <Kicker numeral="VI" className="mb-3">
        THE ARCHIVE
      </Kicker>
      <h1 className="font-serif text-3xl md:text-4xl text-text-primary mb-2">
        Saved protocols.
      </h1>
      <p className="text-sm text-text-secondary mb-8">
        Your library of generated meal plans. Each protocol is preserved for reference and reuse.
      </p>

      <div className="space-y-4">
        {mockArchive.map((plan) => {
          const goalVariant = plan.goal === "cut" ? "deficit" : plan.goal === "bulk" ? "surplus" : "maintenance";

          return (
            <Link
              key={plan.id}
              href="/meal-prep/protocol"
              className="group flex items-center justify-between p-5 bg-bg-card border border-border rounded-xl hover:border-border-strong transition-all"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-serif text-lg text-text-primary group-hover:text-teal transition-colors">
                    {plan.title}
                  </h3>
                  <StatusBadge variant={goalVariant}>{plan.goal}</StatusBadge>
                </div>
                <div className="flex items-center gap-4 text-xs text-text-tertiary">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(plan.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <span>{plan.durationDays} days · {plan.mealsPerDay} meals/day</span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    {plan.macroTargets.kcal} kcal
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-text-tertiary group-hover:text-text-secondary group-hover:translate-x-0.5 transition-all" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
