import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Rocket, 
  Code2, 
  Cpu, 
  Clock, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  Globe2, 
  Globe, 
  Laptop,
  MessageCircle
} from 'lucide-react';
import { motion } from 'motion/react';

export const CourseOverview: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const whyJoinItems = [
    {
      icon: Cpu,
      title: 'Full-Stack Web Development',
      description: 'Master end-to-end web development from frontend UI to backend APIs, with modern frameworks and production best practices.',
    },
    {
      icon: Code2,
      title: 'Modern Web Stack',
      description: 'Build with Next.js 15, React 19, TypeScript, and Tailwind CSS using battle-tested architectural best practices.',
    },
    {
      icon: Globe,
      title: 'RESTful APIs & Backend',
      description: 'Build robust serverless API endpoints, handle authentication, and integrate third-party services for production-ready apps.',
    },
    {
      icon: Globe2,
      title: 'Zero-Cost Vercel Hosting',
      description: 'Deploy production applications effortlessly on the Vercel Free Plan with automated CI/CD workflows.',
    },
  ];

  const curriculumModules = [
    {
      step: '01',
      title: 'Frontend & Backend Foundations',
      topics: ['Next.js App Router & server components', 'Tailwind CSS for modern responsive UI', 'RESTful API routes, middleware & auth', 'Form validation, security & environment config'],
    },
    {
      step: '02',
      title: 'Deployment & Production Launch',
      topics: ['One-click Vercel deployment with CI/CD', 'Monitoring, analytics & admin dashboards', 'Performance optimization & best practices', 'Going live with your web application'],
    },
  ];

  const faqItems = [
    {
      q: 'Is this training suitable for beginners?',
      a: 'Yes! We start with foundational web standards and guide you step-by-step. Basic familiarity with JavaScript or HTML is recommended.',
    },
    {
      q: 'Will I be able to deploy my own projects on Vercel for free?',
      a: 'Absolutely. All code and tools taught in this course are optimized specifically to run inside Vercel and modern cloud free tiers.',
    },
    {
      q: 'Are live class recordings provided if I miss a session?',
      a: 'Yes, all registered students get lifetime access to recorded video sessions, code repositories, and slide decks.',
    },
    {
      q: 'Is there a certificate upon completion?',
      a: 'Yes, upon completing the final capstone project submission, you will receive a verified digital AI Builder Certificate.',
    },
  ];

  return (
    <div className="bg-[#111111] text-zinc-100 py-20 px-4 sm:px-6 lg:px-8 space-y-28 max-w-7xl mx-auto">
      
      {/* SECTION 1: WHY JOIN */}
      <section id="why-join" className="scroll-mt-24 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-widest font-bold text-[#C9A227] px-3 py-1 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/20">
            Why Join The Training
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Designed for Developers & Designers
          </h2>
          <p className="text-zinc-400 text-base leading-relaxed">
            Learn how to build and deploy real web applications from scratch using modern frameworks and best practices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyJoinItems.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                className="bg-[#161618] p-8 rounded-2xl border border-zinc-800 hover:border-[#C9A227]/50 transition-all shadow-xl group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#C9A227] group-hover:bg-[#C9A227] group-hover:text-black transition-colors">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#C9A227] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: WHAT YOU WILL LEARN (CURRICULUM) */}
      <section id="curriculum" className="scroll-mt-24 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-widest font-bold text-[#C9A227] px-3 py-1 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/20">
            Comprehensive Curriculum
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            What You Will Learn
          </h2>
          <p className="text-zinc-400 text-base">
            From zero setup to production deployment in 2 intensive, hands-on modules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {curriculumModules.map((m, idx) => (
            <div
              key={idx}
              className="bg-[#161618] p-8 rounded-2xl border border-zinc-800 space-y-6 relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
                <span className="text-3xl font-extrabold text-[#C9A227] font-display">
                  {m.step}
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
                  Module {idx + 1}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">{m.title}</h3>
              <ul className="space-y-3">
                {m.topics.map((t, tidx) => (
                  <li key={tidx} className="flex items-start gap-3 text-sm text-zinc-300">
                    <CheckCircle className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: DURATION & REQUIREMENTS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* DURATION CARD */}
        <div className="bg-[#161618] p-8 rounded-2xl border border-zinc-800 space-y-6">
          <div className="flex items-center gap-3 text-[#C9A227]">
            <Clock className="w-7 h-7" />
            <h3 className="text-2xl font-bold text-white">Course Duration</h3>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed">
            1 week of intensive, live cohort learning with hands-on labs and dedicated Q&A hours.
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm">
              <span className="text-zinc-400">Total Duration:</span>
              <strong className="text-white">1 Week (15+ Hours)</strong>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm">
              <span className="text-zinc-400">Live Sessions:</span>
              <strong className="text-white">Weekdays (Mon-Fri)</strong>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm">
              <span className="text-zinc-400">Time Commitment:</span>
              <strong className="text-white">~3 Hours / Day</strong>
            </div>
          </div>
        </div>

        {/* REQUIREMENTS CARD */}
        <div className="bg-[#161618] p-8 rounded-2xl border border-zinc-800 space-y-6">
          <div className="flex items-center gap-3 text-[#C9A227]">
            <Laptop className="w-7 h-7" />
            <h3 className="text-2xl font-bold text-white">Requirements</h3>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed">
            No expensive software or heavy infrastructure needed. Everything runs in the browser and free cloud tiers.
          </p>

          <ul className="space-y-3 pt-2">
            <li className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-200">
              <CheckCircle className="w-4 h-4 text-[#C9A227] shrink-0" />
              <span>A computer (Mac, Windows, or Linux) with Internet access</span>
            </li>
            <li className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-200">
              <CheckCircle className="w-4 h-4 text-[#C9A227] shrink-0" />
              <span>Basic knowledge of HTML/CSS or general programming concepts</span>
            </li>
            <li className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-zinc-200">
              <CheckCircle className="w-4 h-4 text-[#C9A227] shrink-0" />
              <span>Free GitHub and Vercel account (setup guided in class)</span>
            </li>
          </ul>
        </div>

      </section>

      {/* SECTION 4: FREQUENTLY ASKED QUESTIONS */}
      <section className="space-y-8 max-w-3xl mx-auto">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-zinc-400 text-sm">Everything you need to know about the upcoming registration.</p>
        </div>

        <div className="space-y-4">
          {faqItems.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-[#161618] rounded-xl border border-zinc-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-base font-semibold text-white hover:text-[#C9A227] transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-[#C9A227]" /> : <ChevronDown className="w-5 h-5 text-zinc-500" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-sm text-zinc-400 border-t border-zinc-800/50 mt-2 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA BANNER */}
      <div className="bg-gradient-to-r from-zinc-900 via-[#18181B] to-zinc-900 p-10 rounded-3xl border border-[#C9A227]/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-2">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Ready to Build Your First Web App?</h3>
          <p className="text-zinc-400 text-sm max-w-lg mx-auto">
            Reserve your seat now before the live cohort capacity is filled.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => {
              navigate('/register');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-8 py-4 rounded-xl font-bold text-base bg-[#C9A227] text-black hover:bg-[#d8b132] transition-all transform hover:scale-105 gold-glow shadow-lg inline-flex items-center gap-2"
          >
            <span>Register For Upcoming Cohort</span>
          </button>
          <a
            href="https://chat.whatsapp.com/HsrZXo4d6zR6Tbl9v9xrpd"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-xl font-bold text-base bg-zinc-900 text-zinc-100 hover:bg-zinc-800 transition-all border border-zinc-700 hover:border-[#C9A227]/50 inline-flex items-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Join WhatsApp Group</span>
          </a>
        </div>
      </div>

    </div>
  );
};
