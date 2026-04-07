import type { Metadata } from "next";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { getAuthors } from "@/lib/articles-service";
import WhoWeAre from "@/components/public/WhoWeAre";
import { Target, Eye, Shield, Users, Award, TrendingUp, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About PDN - Palawan Daily News",
  description: "Learn about the mission, vision, and values of Palawan's premier news source.",
};

export default async function AboutPage() {
  const authors = await getAuthors();
  
  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen">
        {/* Hero Section - More Premium & Sophisticated */}
        <section className="relative min-h-[60vh] flex items-center bg-[#0f172a] text-white">
          {/* Subtle Background pattern/image overlay */}
          <div className="absolute inset-0 opacity-40 mix-blend-overlay">
            <img 
              src="https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1600&h=800&fit=crop" 
              alt="Professional journalism" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/80 via-[#0f172a]/60 to-[#0f172a]" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 py-20">
            <div className="max-w-4xl">
              <h1 className="font-playfair text-5xl sm:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
                Palawan's Definitive <br />
                <span className="text-red-600 italic">Journalistic</span> Voice.
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl font-light">
                Since our inception, Palawan Daily News has been committed to the pursuit of truth, 
                serving as the bridge between information and the people of our beloved province.
              </p>
            </div>
          </div>
          
          {/* Design element: subtle line */}
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-16 relative z-20 pb-24">
          {/* Mission & Vision - More Modern Design */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            <div className="group bg-white p-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 hover:border-red-100 hover:shadow-red-500/5 transition-all duration-500 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-red-600 group-hover:scale-110 transition-all duration-500 overflow-hidden relative mx-auto">
                <Target className="h-8 w-8 text-red-600 group-hover:text-white transition-colors relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-tr from-red-600 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h2 className="font-playfair text-3xl font-bold text-slate-900 mb-5 tracking-tight">Our Mission</h2>
              <p className="text-slate-600 leading-relaxed text-lg font-light">
                To serve as the definitive voice of Palawan by providing accurate, timely, 
                and comprehensive news coverage. We strive to empower our readers with 
                knowledge that fosters a more informed, engaged, and progressive society.
              </p>
            </div>

            <div className="group bg-white p-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 hover:border-blue-100 hover:shadow-blue-500/5 transition-all duration-500 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-500 overflow-hidden relative mx-auto">
                <Eye className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h2 className="font-playfair text-3xl font-bold text-slate-900 mb-5 tracking-tight">Our Vision</h2>
              <p className="text-slate-600 leading-relaxed text-lg font-light">
                To be the most respected and innovative media organization in Palawan, 
                recognized for our unwavering commitment to journalistic integrity, 
                community service, and sustainable development through truth-telling.
              </p>
            </div>
          </div>

          {/* Core Values Section - Elevated Icons & Layout */}
          <section className="mb-24">
            <div className="flex flex-col items-center mb-20">
              <div className="h-1 w-12 bg-red-600 mb-6 rounded-full" />
              <h2 className="font-playfair text-4xl sm:text-5xl font-black text-slate-900 text-center tracking-tight mb-4">
                Our Core Values
              </h2>
              <p className="text-slate-500 font-light text-lg text-center max-w-xl">
                The principles that guide our every reporting and editorial decision.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <ValueCard 
                icon={<Shield className="h-6 w-6" />}
                title="Integrity"
                description="We uphold the highest standards of honesty and transparency."
                color="red"
              />
              <ValueCard 
                icon={<Users className="h-6 w-6" />}
                title="Community First"
                description="Rooted in Palawan, prioritizing news that impacts local lives."
                color="blue"
              />
              <ValueCard 
                icon={<Award className="h-6 w-6" />}
                title="Excellence"
                description="Striking for perfection in reporting, from facts to final look."
                color="green"
              />
              <ValueCard 
                icon={<TrendingUp className="h-6 w-6" />}
                title="Innovation"
                description="Embracing modern technology for smarter news delivery."
                color="orange"
              />
            </div>
          </section>

          {/* Team Section */}
          <WhoWeAre initialAuthors={authors} />
        </section>
      </main>
      <Footer />
    </>
  );
}

function ValueCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: 'red' | 'blue' | 'green' | 'orange' }) {
  const colors = {
    red: "text-red-600 bg-red-50 group-hover:bg-red-600 group-hover:text-white shadow-red-100",
    blue: "text-blue-600 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white shadow-blue-100",
    green: "text-green-600 bg-green-50 group-hover:bg-green-600 group-hover:text-white shadow-green-100",
    orange: "text-orange-600 bg-orange-50 group-hover:bg-orange-600 group-hover:text-white shadow-orange-100",
  };

  return (
    <div className="group bg-slate-50 p-8 rounded-2xl border border-slate-200/50 hover:bg-white hover:shadow-xl hover:border-transparent transition-all duration-300 flex flex-col items-center text-center">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 shadow-lg ${colors[color]}`}>
        {icon}
      </div>
      <h3 className="font-bold text-slate-900 text-lg mb-3 tracking-tight group-hover:text-slate-900 transition-colors">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed font-light group-hover:text-slate-600 transition-colors">{description}</p>
    </div>
  );
}
