import React from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { getAuthors } from "@/lib/articles-service";
import WhoWeAre from "@/components/public/WhoWeAre";
import { Target, Eye, Shield, Users, Award, TrendingUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function AboutPage() {
  const authors = await getAuthors();
  
  return (
    <div className="bg-white min-h-screen font-sans selection:bg-[#f36f21]/30 selection:text-slate-900">
      <Navbar />
      
      <main>
        {/* Elite Hero Section - Clinical Modernism */}
        <section className="relative min-h-[75vh] flex items-center bg-[#0a1d37] overflow-hidden">
          {/* Subtle noise texture & depth */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(243,111,33,0.1),transparent_70%)]" />
          
          <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10 py-32 w-full">
            <div className="max-w-4xl space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-[#f36f21]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Est. 2012</span>
              </div>
              
              <h1 className="font-playfair text-6xl sm:text-[92px] leading-[0.95] font-black text-white tracking-tighter">
                Palawan's Definitive <br />
                <span className="text-[#f36f21] italic font-medium">Journalistic</span> Voice.
              </h1>
              
              <p className="text-xl sm:text-2xl text-slate-300/80 leading-relaxed max-w-2xl font-light tracking-tight">
                Since our inception, Palawan Daily News has been committed to the pursuit of truth, 
                serving as the bridge between information and the people of our beloved province.
              </p>
            </div>
          </div>
          
          {/* Subtle design element: corner accent */}
          <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-white/[0.02] to-transparent" />
        </section>

        {/* Mission & Vision - Layered Glass containers */}
        <section className="max-w-7xl mx-auto px-6 sm:px-12 -mt-32 relative z-20 pb-40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-40">
            <div className="group relative bg-white rounded-[2.5rem] p-12 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.06)] border border-slate-100 transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_45px_100px_-25px_rgba(0,0,0,0.1)] overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100%] transition-colors duration-500 group-hover:bg-[#f36f21]/5" />
              <div className="relative space-y-8">
                <div className="w-16 h-16 bg-[#f36f21]/5 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-[#f36f21] group-hover:shadow-[0_15px_30px_rgba(243,111,33,0.3)]">
                  <Target className="h-8 w-8 text-[#f36f21] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h2 className="font-playfair text-4xl font-black text-slate-900 mb-6 tracking-tight">Our Mission</h2>
                  <p className="text-slate-500 leading-relaxed text-lg font-light">
                    To serve as the definitive voice of Palawan by providing accurate, timely, 
                    and comprehensive news coverage. We strive to empower our readers with 
                    knowledge that fosters a more informed, engaged, and progressive society.
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative bg-white rounded-[2.5rem] p-12 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.06)] border border-slate-100 transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_45px_100px_-25px_rgba(0,0,0,0.1)] overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100%] transition-colors duration-500 group-hover:bg-blue-500/5" />
              <div className="relative space-y-8">
                <div className="w-16 h-16 bg-blue-500/5 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-blue-600 group-hover:shadow-[0_15px_30px_rgba(37,99,235,0.3)]">
                  <Eye className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h2 className="font-playfair text-4xl font-black text-slate-900 mb-6 tracking-tight">Our Vision</h2>
                  <p className="text-slate-500 leading-relaxed text-lg font-light">
                    To be the most respected and innovative media organization in Palawan, 
                    recognized for our unwavering commitment to journalistic integrity, 
                    community service, and sustainable development through truth-telling.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Core Values Section - Clinical Layout */}
          <section className="mb-40">
            <div className="text-center mb-24 max-w-2xl mx-auto space-y-4">
              <div className="h-1.5 w-12 bg-[#f36f21] mx-auto rounded-full" />
              <h2 className="font-playfair text-5xl font-black text-slate-900 tracking-tighter">
                Our Core Philosophies
              </h2>
              <p className="text-slate-500 font-light text-xl tracking-tight leading-relaxed">
                The principles that guide our every reporting and editorial decision, 
                defining the standard of Palawan's journalism.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <ValueCard 
                icon={<Shield className="h-5 w-5" />}
                title="Integrity"
                description="We uphold the highest standards of honesty and transparency in every story."
                color="orange"
              />
              <ValueCard 
                icon={<Users className="h-5 w-5" />}
                title="Community"
                description="Rooted in Palawan, prioritizing news that impacts local lives first."
                color="blue"
              />
              <ValueCard 
                icon={<Award className="h-5 w-5" />}
                title="Excellence"
                description="Striking for perfection in reporting, from initial facts to final delivery."
                color="orange"
              />
              <ValueCard 
                icon={<TrendingUp className="h-5 w-5" />}
                title="Innovation"
                description="Embracing modern technology for smarter, faster, and more reliable news delivery."
                color="blue"
              />
            </div>
          </section>

          {/* Team Section */}
          <div className="mt-20">
             <WhoWeAre initialAuthors={authors} />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

function ValueCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: 'orange' | 'blue' }) {
  const iconColorClass = color === 'orange' ? 'text-[#f36f21]' : 'text-blue-600';
  const shadowClass = color === 'orange' ? 'group-hover:shadow-[0_15px_30px_rgba(243,111,33,0.15)]' : 'group-hover:shadow-[0_15px_30px_rgba(37,99,235,0.15)]';
  
  return (
    <div className="group relative bg-white p-10 rounded-[2rem] border border-slate-100/80 shadow-sm transition-all duration-500 hover:border-slate-900/5 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] flex flex-col items-start text-left">
      <div className={cn(
        "w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-8 transition-all duration-500 group-hover:bg-slate-900 group-hover:text-white group-hover:scale-105",
        iconColorClass,
        shadowClass
      )}>
        {icon}
      </div>
      <h3 className="font-bold text-slate-900 text-xl mb-4 tracking-tight">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed font-light transition-colors group-hover:text-slate-600">
        {description}
      </p>
      
      {/* Subtle corner flourish */}
      <div className={cn(
        "absolute bottom-0 right-0 w-0 h-0 border-t-[40px] border-l-[40px] border-t-transparent border-l-transparent transition-all duration-500",
        color === 'orange' ? "group-hover:border-b-[#f36f21]/10 group-hover:border-r-[#f36f21]/10" : "group-hover:border-b-blue-600/10 group-hover:border-r-blue-600/10"
      )} />
    </div>
  );
}
