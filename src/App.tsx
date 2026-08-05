import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { CourseOverview } from './components/CourseOverview';
import { JoinUs } from './components/JoinUs';

export default function App() {
  return (
    <div className="min-h-screen bg-[#111111] text-zinc-100 flex flex-col justify-between selection:bg-[#C9A227] selection:text-black">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={
            <div className="space-y-0">
              <HeroSection />
              <CourseOverview />
            </div>
          } />
          <Route path="/join" element={<JoinUs />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
