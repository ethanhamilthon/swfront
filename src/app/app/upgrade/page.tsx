import { Pricing } from "@/feature/pricing";
import { PricingTitles } from "@/feature/pricing/titles";

export default function Upgrade() {
  return (
    <main className="container flex items-center py-12 flex-col gap-6">
      <PricingTitles />
      <Pricing />
    </main>
  );
}
