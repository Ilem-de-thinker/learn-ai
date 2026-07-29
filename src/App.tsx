import React, { useState, useEffect } from 'react';
import { ViewState, Registration } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { CourseOverview } from './components/CourseOverview';
import { RegistrationForm } from './components/RegistrationForm';
import { SuccessView } from './components/SuccessView';
import { AdminDashboard } from './components/AdminDashboard';
import { TermsModal } from './components/TermsModal';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>(() => {
    return window.location.pathname === '/admin' ? 'admin' : 'home';
  });
  const [lastRegistration, setLastRegistration] = useState<Registration | null>(null);

  useEffect(() => {
    if (currentView === 'admin') {
      window.history.pushState(null, '', '/admin');
    } else if (currentView === 'home') {
      window.history.pushState(null, '', '/');
    }
  }, [currentView]);

  const handleRegistrationSuccess = (reg: Registration) => {
    setLastRegistration(reg);
    setCurrentView('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#111111] text-zinc-100 flex flex-col justify-between selection:bg-[#C9A227] selection:text-black">
      
      {/* Navigation Bar */}
      <Navbar
        currentView={currentView}
        setView={setCurrentView}
      />

      {/* Main View Switcher */}
      <main className="flex-1">
        {currentView === 'home' && (
          <div className="space-y-0">
            <HeroSection setView={setCurrentView} />
            <CourseOverview setView={setCurrentView} />
          </div>
        )}

        {currentView === 'register' && (
          <RegistrationForm
            onSuccess={handleRegistrationSuccess}
            setView={setCurrentView}
          />
        )}

        {currentView === 'success' && (
          <SuccessView
            registration={lastRegistration}
            setView={setCurrentView}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard />
        )}

        {currentView === 'terms' && (
          <TermsModal setView={setCurrentView} />
        )}
      </main>

      {/* Footer */}
      <Footer setView={setCurrentView} />

    </div>
  );
}
