import type { Metadata } from "next";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhoWeAre from "@/components/public/WhoWeAre";
import { mockPdnContactInfo } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Palawan Daily News.",
};

export default function ContactUsPage() {
  const info = mockPdnContactInfo;

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <nav className="text-sm text-gray-500 mb-4">
          <span className="text-gray-500">Home</span> <span>/</span>{" "}
          <span className="text-gray-700">Contact Us</span>
        </nav>

        <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 bg-white border border-gray-100 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">{info.officeName}</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Address</p>
                {info.addressLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <div className="pt-3">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Email</p>
                <p className="font-medium">{info.email}</p>
              </div>
              {(info.telephone || info.mobile) && (
                <div className="pt-3">
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Phone</p>
                  {info.telephone && <p>Tel: {info.telephone}</p>}
                  {info.mobile && <p>Mobile: {info.mobile}</p>}
                </div>
              )}
            </div>
          </section>

          <aside className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3">Business Hours</h2>
            <ul className="text-sm text-gray-700 space-y-2">
              {info.businessHours.map((row) => (
                <li key={row}>{row}</li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-600 leading-relaxed">
                This page uses <strong>dummy reference data</strong>. Replace `mockPdnContactInfo` in `src/lib/mock-data.ts`
                with your official contact details when ready.
              </p>
            </div>
          </aside>
        </div>

        <WhoWeAre />
      </main>
      <Footer />
    </>
  );
}

