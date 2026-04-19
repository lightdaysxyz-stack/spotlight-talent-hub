import { SiteLayout } from "@/components/layout/SiteLayout";
import { Hero } from "@/components/landing/Hero";
import { FeaturedModels } from "@/components/landing/FeaturedModels";
import { WhySpotlight } from "@/components/landing/WhySpotlight";
import { Testimonials } from "@/components/landing/Testimonials";
import { Marquee } from "@/components/brutal/Marquee";
import { BollyDivider } from "@/components/brutal/BollyDivider";

const Index = () => (
  <SiteLayout>
    <Hero />
    <Marquee
      tone="yellow"
      items={[
        "CASTING NOW",
        "APPLY TODAY",
        "SPOTLIGHT IS LIVE",
        "BOLLYWOOD AWAITS",
        "LIGHTS · CAMERA · HIRED",
      ]}
    />
    <FeaturedModels />
    <BollyDivider className="container" />
    <WhySpotlight />
    <Marquee
      tone="pink"
      speed="fast"
      items={["SITARA", "JUNOON", "ROSHNI", "★ NEW ROLES DAILY ★", "PAID ON TIME"]}
    />
    <Testimonials />
  </SiteLayout>
);

export default Index;
