import { useProfile } from './api/hooks';
import { About } from './components/about/About';
import { Contact } from './components/contact/Contact';
import { ExperienceTimeline } from './components/experience/ExperienceTimeline';
import { Formation } from './components/formation/Formation';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { ProjectsGrid } from './components/projects/ProjectsGrid';
import { TechGrid } from './components/technologies/TechGrid';
import { Testimonials } from './components/testimonials/Testimonials';
import { Hero } from './components/hero/Hero';
import { useDynamicFavicon } from './hooks/useDynamicFavicon';

function App() {
  const { data: profile } = useProfile();
  useDynamicFavicon(profile?.logo);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <ExperienceTimeline />
        <Formation />
        <TechGrid />
        <ProjectsGrid />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
