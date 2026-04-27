import { HeroBanner } from "@/components/ui/HeroBanner";
import { HomeExperiences } from "@/components/sections/HomeExperiences";
import { HomeLodging } from "@/components/sections/HomeLodging";
import { HomeDining } from "@/components/sections/HomeDining";
import { HomeEvents } from "@/components/sections/HomeEvents";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <HomeExperiences />
      <HomeLodging />
      <HomeDining />
      <HomeEvents />
    </>
  );
}
