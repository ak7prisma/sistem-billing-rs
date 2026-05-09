"use client";

import { faqs } from "@/lib/data/faq";
import { FiMapPin, FiPhone, FiMail, FiClock, FiHelpCircle } from "react-icons/fi";

export default function AboutPage() {

  return (
    <div className="max-w-4xl mx-auto mt-6 md:mt-12 p-4 md:p-6 space-y-6 md:space-y-8 mb-20 md:mb-0">
      <div className="text-center mb-6 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wide text-slate-800 mb-2">
          Pusat <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-500 to-violet-500">Bantuan</span> & Info
        </h1>
        <p className="text-slate-500 font-medium text-sm md:text-base">Informasi layanan RS Satria Medika dan FAQ Pembayaran.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 md:mb-6 shadow-inner">
            <FiMapPin className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">RS Satria Medika</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Kami berkomitmen memberikan layanan kesehatan terbaik dan terpercaya dengan fasilitas modern serta tenaga medis profesional.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm font-bold text-slate-700 hover:text-violet-600 transition-colors group">
              <FiPhone className="w-5 h-5 text-violet-500 group-hover:scale-110 transition-transform" />
              <span>Call Center: 1500-123</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-slate-700 hover:text-violet-600 transition-colors group">
              <FiMail className="w-5 h-5 text-violet-500 group-hover:scale-110 transition-transform" />
              <span>cs@satriamedika.com</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-slate-700 hover:text-violet-600 transition-colors group">
              <FiClock className="w-5 h-5 text-violet-500 group-hover:scale-110 transition-transform" />
              <span>Layanan IGD 24 Jam</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
            Pertanyaan Populer <span className="text-violet-500 text-sm font-medium">(FAQ)</span>
          </h3>
          
          {faqs.map((faq) => (
            <div key={faq.a} className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-violet-200 transition-colors group">
              <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2 text-sm md:text-base group-hover:text-violet-600 transition-colors">
                <FiHelpCircle className="w-4 h-4 text-emerald-500" /> 
                {faq.q}
              </h4>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-medium">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}