import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { mockPdnOwnershipFundingInfo } from "@/lib/mock-data";
import { ShieldCheck, Info, DollarSign, Users, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Ownership and Funding",
  description: "Ownership and funding information for Palawan Daily News.",
};

export default function OwnershipAndFundingPage() {
  const data = mockPdnOwnershipFundingInfo;

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-2">
            <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900">Transparency</span>
          </nav>
          
          <div className="max-w-3xl">
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {data.title}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed italic border-l-4 border-red-600 pl-6">
              "We believe that transparency in ownership and funding is the bedrock of journalistic integrity and public trust."
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-8 md:p-12">
                <div 
                  className="article-content prose prose-gray max-w-none 
                    prose-p:text-gray-600 prose-p:leading-relaxed prose-p:text-lg
                    prose-strong:text-gray-900 prose-strong:font-bold
                    prose-ul:list-disc prose-ul:pl-6 prose-li:text-gray-600 prose-li:mb-2
                    prose-a:text-red-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline" 
                  dangerouslySetInnerHTML={{ __html: data.bodyHtml }} 
                />
              </div>
            </section>

            {/* Diversity/Commitment Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm">
                <ShieldCheck className="h-8 w-8 text-red-600 mb-4" />
                <h3 className="font-playfair text-xl font-bold text-gray-900 mb-2">Editorial Independence</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Our newsroom operates with total independence. Advertisers and sponsors have no influence over the topics we cover or the tone of our reporting.
                </p>
              </div>
              <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm">
                <Users className="h-8 w-8 text-red-600 mb-4" />
                <h3 className="font-playfair text-xl font-bold text-gray-900 mb-2">Community Driven</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Founded in Palawan, for Palawan. Our primary goal is to serve our local community with accurate and timely information that matters.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar / Highlights */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-gray-900 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-red-600/20" />
              
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-red-500 mb-6 flex items-center gap-2">
                <Info className="h-3 w-3" /> Quick Highlights
              </h2>
              
              <div className="space-y-6">
                {data.highlights.map((h, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 shrink-0 bg-white/10 p-1.5 rounded-lg h-fit">
                      {i === 0 ? <Users className="h-4 w-4 text-red-400" /> : 
                       i === 1 ? <ShieldCheck className="h-4 w-4 text-red-400" /> : 
                       <DollarSign className="h-4 w-4 text-red-400" />}
                    </div>
                    <p className="text-[15px] text-gray-300 leading-snug font-medium">
                      {h}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-white/10">
                <div className="bg-white/5 rounded-xl p-4 flex items-start gap-3">
                  <div className="text-red-500 text-lg font-bold">!</div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    This is <strong>placeholder content</strong> for demonstration purposes. Please update your disclosure statement soon.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-600 rounded-2xl p-8 text-white group cursor-pointer hover:bg-red-700 transition-all shadow-lg">
              <h3 className="font-playfair text-xl font-bold mb-2">Have questions?</h3>
              <p className="text-sm text-red-100 mb-6 leading-relaxed">
                Contact our transparency committee if you have questions about our disclosures.
              </p>
              <Link href="/about/contact-us" className="inline-flex items-center gap-2 text-sm font-bold bg-white text-red-600 px-6 py-2.5 rounded-xl group-hover:gap-4 transition-all">
                Contact Us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}

