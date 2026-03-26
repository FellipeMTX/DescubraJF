import { HeroBanner } from "@/components/ui/HeroBanner";
import { HomeHighlights } from "@/components/sections/HomeHighlights";
import { HomeExperiences } from "@/components/sections/HomeExperiences";
import { HomeEvents } from "@/components/sections/HomeEvents";

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <HomeHighlights />
      <HomeExperiences />
      <HomeEvents />
    </div>
  );
}
