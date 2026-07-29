import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Registration } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { CourseOverview } from './components/CourseOverview';
import { RegistrationForm } from './components/RegistrationForm';
import { SuccessView } from './components/SuccessView';
import { AdminDashboard } from './components/AdminDashboard';
import { TermsModal } from './components/TermsModal';

export default function App() {
  const navigate = useNavigate();
  const [lastRegistration, setLastRegistration] = useState<Registration | null>(null);

  const handleRegistrationSuccess = (reg: Registration) => {
    setLastRegistration(reg);
    navigate('/success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          <Route path="/register" element={<RegistrationForm onSuccess={handleRegistrationSuccess} />} />
          <Route path="/success" element={<SuccessView registration={lastRegistration} />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/terms" element={<TermsModal />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
