import { useState } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
// import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import Properties from "@/components/PropertiesSection";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import HomeBlogSection from "@/components/HomeBlogSection";
import type { Property } from "@/types/property";

function Index() {
  const [searchResults, setSearchResults] = useState<Property[] | null>(null);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {/* Home / Hero */}
        <section id="home">
          <Hero onSearchResults={setSearchResults} />
        </section>

        {/* Services
        <section id="services">
          <Services />
        </section> */}

        {/* Properties */}
        <section id="properties">
          <Properties properties={searchResults ?? undefined} />
        </section>

        {/* Portfolio / Projects */}
        <section id="portfolio">
          <Portfolio />
        </section>

        {/* Blog on home */}
        <section id="blog">
          <HomeBlogSection />
        </section>

        {/* Testimonials */}
        <section id="testimonials">
          <Testimonials />
        </section>

        {/* About */}
        <section id="about">
          <About />
        </section>

        {/* Contact */}
        <section id="contact">
          <Contact />
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Index;
