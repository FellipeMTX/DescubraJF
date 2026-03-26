import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout/Layout";

function Lazy({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

const Home = lazy(() => import("./pages/Home"));
const ExperienceList = lazy(() => import("./pages/experiences/ExperienceList"));
const ExperienceDetail = lazy(() => import("./pages/experiences/ExperienceDetail"));
const RouteList = lazy(() => import("./pages/routes/RouteList"));
const RouteDetail = lazy(() => import("./pages/routes/RouteDetail"));
const EventList = lazy(() => import("./pages/events/EventList"));
const EventDetail = lazy(() => import("./pages/events/EventDetail"));
const DiningList = lazy(() => import("./pages/dining/DiningList"));
const DiningDetail = lazy(() => import("./pages/dining/DiningDetail"));
const LodgingList = lazy(() => import("./pages/lodging/LodgingList"));
const LodgingDetail = lazy(() => import("./pages/lodging/LodgingDetail"));
const History = lazy(() => import("./pages/city/History"));
const TouristInfo = lazy(() => import("./pages/city/TouristInfo"));
const HowToGetHere = lazy(() => import("./pages/city/HowToGetHere"));
const Press = lazy(() => import("./pages/city/Press"));
const AboutSetur = lazy(() => import("./pages/city/AboutSetur"));
const MapsAndGuides = lazy(() => import("./pages/MapsAndGuides"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const ExperienceAdmin = lazy(() => import("./pages/admin/ExperienceAdmin"));
const BannerAdmin = lazy(() => import("./pages/admin/BannerAdmin"));

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Lazy><Home /></Lazy> },
      { path: "experiencias", element: <Lazy><ExperienceList /></Lazy> },
      { path: "experiencias/:slug", element: <Lazy><ExperienceDetail /></Lazy> },
      { path: "roteiros", element: <Lazy><RouteList /></Lazy> },
      { path: "roteiros/:slug", element: <Lazy><RouteDetail /></Lazy> },
      { path: "agenda", element: <Lazy><EventList /></Lazy> },
      { path: "agenda/:slug", element: <Lazy><EventDetail /></Lazy> },
      { path: "onde-comer", element: <Lazy><DiningList /></Lazy> },
      { path: "onde-comer/:slug", element: <Lazy><DiningDetail /></Lazy> },
      { path: "onde-ficar", element: <Lazy><LodgingList /></Lazy> },
      { path: "onde-ficar/:slug", element: <Lazy><LodgingDetail /></Lazy> },
      { path: "juiz-de-fora/historia", element: <Lazy><History /></Lazy> },
      { path: "juiz-de-fora/informacoes", element: <Lazy><TouristInfo /></Lazy> },
      { path: "juiz-de-fora/como-chegar", element: <Lazy><HowToGetHere /></Lazy> },
      { path: "juiz-de-fora/imprensa", element: <Lazy><Press /></Lazy> },
      { path: "juiz-de-fora/setur", element: <Lazy><AboutSetur /></Lazy> },
      { path: "mapas-e-guias", element: <Lazy><MapsAndGuides /></Lazy> },
      { path: "contato", element: <Lazy><Contact /></Lazy> },
      { path: "*", element: <Lazy><NotFound /></Lazy> },
    ],
  },
  {
    path: "admin",
    element: <Lazy><AdminLayout /></Lazy>,
    children: [
      { index: true, element: <Lazy><ExperienceAdmin /></Lazy> },
      { path: "banners", element: <Lazy><BannerAdmin /></Lazy> },
    ],
  },
]);
