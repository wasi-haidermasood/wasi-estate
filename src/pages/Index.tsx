import { useState } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import Properties from "@/components/PropertiesSection";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import HomeBlogSection from "@/components/HomeBlogSection"; // <-- add this
import type { Property } from "@/types/property";

function Index() {
  const [searchResults, setSearchResults] = useState<Property[] | null>(null);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero onSearchResults={setSearchResults}/>
        <Services />
        <Properties properties={searchResults ?? undefined} />
        <Portfolio />
        <HomeBlogSection />
        <Testimonials />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;