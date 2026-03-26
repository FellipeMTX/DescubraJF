import { HeroBanner } from "@/components/ui/HeroBanner";
import { HomeHighlights } from "@/components/sections/HomeHighlights";
import { HomeExperiences } from "@/components/sections/HomeExperiences";
import { HomeEvents } from "@/components/sections/HomeEvents";
import { HomeDining } from "@/components/sections/HomeDining";
import { HomeLodging } from "@/components/sections/HomeLodging";

export default function Home() {
  return (
    <div className="bg-primary-50">
      <HeroBanner />
      <HomeHighlights />
      <HomeExperiences />
      <HomeLodging />
      <HomeDining />
      <HomeEvents />
    </div>
  );
}
