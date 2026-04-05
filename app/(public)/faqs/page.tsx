"use client";

import { useState } from "react";

const FAQs = [
  {
    question: "Apa itu Sinara?",
    answer:
      "Sinara adalah sistem rekomendasi tempat magang berbasis web yang membantu mahasiswa menemukan tempat magang yang sesuai dengan skill yang dimiliki.",
  },
  {
    question: "Bagaimana cara kerja sistem rekomendasi di Sinara?",
    answer:
      "Sistem membandingkan skill yang dimasukkan oleh mahasiswa dengan kebutuhan skill dari tempat magang, kemudian menghitung tingkat kesesuaian untuk menghasilkan rekomendasi.",
  },
  {
    question: "Apakah Sinara menggunakan teknologi AI?",
    answer:
      "Ya. Sinara memanfaatkan teknik Natural Language Processing (NLP) untuk menganalisis dan mencocokkan data skill mahasiswa dengan deskripsi kebutuhan tempat magang.",
  },
  {
    question: "Apakah hasil rekomendasi di Sinara selalu akurat?",
    answer:
      "Tidak selalu. Hasil rekomendasi bergantung pada data yang dimasukkan oleh pengguna serta data tempat magang yang tersedia di sistem.",
  },
  {
    question: "Kenapa hasil rekomendasi saya berbeda dengan teman saya?",
    answer:
      "Karena setiap pengguna memiliki skill, pengalaman, dan input data yang berbeda sehingga sistem menghasilkan rekomendasi yang berbeda.",
  },
  {
    question: "Apa arti persentase kecocokan pada hasil rekomendasi?",
    answer:
      "Persentase kecocokan menunjukkan tingkat kesesuaian antara skill yang kamu miliki dengan kebutuhan dari tempat magang.",
  },
  {
    question: "Apakah urutan rekomendasi menunjukkan tempat magang terbaik?",
    answer:
      "Urutan menunjukkan tingkat kecocokan skill, tetapi keputusan terbaik tetap perlu mempertimbangkan minat pribadi dan faktor lain.",
  },
  {
    question: "Kenapa tempat magang yang saya inginkan tidak muncul dalam rekomendasi?",
    answer:
      "Hal ini bisa terjadi karena skill yang kamu masukkan belum sesuai dengan kebutuhan tempat tersebut atau data tempat tersebut belum tersedia di sistem.",
  },
  {
    question: "Apa arti rating pada divisi tempat magang?",
    answer:
      "Rating pada divisi menunjukkan tingkat kesesuaian antara jenis pekerjaan yang dilakukan pada divisi tersebut dengan bidang atau skill yang dimiliki oleh mahasiswa. Semakin tinggi nilai rating, maka semakin sesuai pekerjaan pada divisi tersebut dengan kompetensi atau bidang yang relevan. Rating ini bertujuan untuk membantu mahasiswa memilih divisi magang yang paling sesuai dengan kemampuan dan minat mereka.",
  },
  {
    question: "Apakah saya boleh menulis skill secara bebas?",
    answer:
      "Ya, tetapi disarankan menggunakan istilah skill yang umum agar sistem dapat mengenali dan mencocokkannya dengan lebih baik.",
  },
  {
    question: "Apakah kesalahan penulisan (typo) pada skill berpengaruh?",
    answer:
      "Ya. Kesalahan penulisan dapat membuat sistem tidak mengenali skill tersebut sehingga mempengaruhi hasil rekomendasi.",
  },
  {
    question: "Apakah semakin banyak skill yang dimasukkan hasilnya akan lebih baik?",
    answer:
      "Tidak selalu. Yang terpenting adalah relevansi skill dengan kebutuhan tempat magang.",
  },
  {
    question: "Apa itu feedback review mahasiswa dalam sistem Sinara?",
    answer:
      "Feedback review mahasiswa adalah pengalaman mahasiswa yang sudah menjalani magang di suatu tempat dan dibagikan sebagai informasi tambahan bagi mahasiswa lain.",
  },
  {
    question: "Apakah Sinara menjamin saya diterima di tempat magang?",
    answer:
      "Tidak. Sinara hanya memberikan rekomendasi tempat magang yang sesuai dengan skill, sedangkan keputusan penerimaan tetap ditentukan oleh pihak perusahaan.",
  },
  {
    question: "Apa keterbatasan dari sistem Sinara?",
    answer:
      "Sistem saat ini hanya mempertimbangkan kesesuaian skill dan belum mempertimbangkan faktor lain seperti lokasi, gaji, atau budaya kerja perusahaan, dan juga tidak memproses lamaran.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* Hero Section */}
      <section
        className="w-full px-10 pt-[70px] pb-[50px] text-center"
        style={{
          background: "linear-gradient(180deg, #E0E7FF 0%, #eef6ff 50%, #f8fafc 100%)",
        }}
      >
        <div className="w-[90%] max-w-[800px] mx-auto px-5">
          <h1 className="text-[2.2rem] font-bold text-[#18181b] leading-[1.3] mb-4 font-[Poppins,sans-serif]">
            Frequently Asked{" "}
            <span className="text-indigo-600">Questions</span>
          </h1>
          <p className="text-[15px] text-gray-500 leading-[1.7] max-w-[700px] mx-auto font-[Poppins,sans-serif]">
            Temukan jawaban untuk pertanyaan yang paling sering diajukan seputar
            sistem rekomendasi magang, pendaftaran, dan cara membaca hasil
            kesesuaian profil Anda.
          </p>
        </div>
      </section>

      {/* FAQ List */}
      <div className="max-w-[720px] mx-auto px-6 py-[52px] pb-20">
        <div className="flex flex-col gap-[10px]">
          {FAQs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`bg-white rounded-[14px] overflow-hidden transition-all duration-200 ${
                  isOpen
                    ? "border-[1.5px] border-indigo-400 shadow-[0_0_0_3px_rgba(99,102,241,0.08),0_1px_3px_rgba(79,70,229,0.07),0_4px_16px_rgba(79,70,229,0.06)]"
                    : "border-[1.5px] border-gray-200 shadow-[0_1px_3px_rgba(79,70,229,0.07),0_4px_16px_rgba(79,70,229,0.06)]"
                }`}
              >
                {/* Question Button */}
                <button
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className={`w-full flex items-center justify-between gap-4 px-5 py-[18px] bg-transparent border-none cursor-pointer text-left text-[14.5px] font-semibold transition-colors duration-200 font-[Poppins,sans-serif] ${
                    isOpen ? "text-indigo-600" : "text-[#18181b]"
                  }`}
                >
                  <span>{faq.question}</span>
                  <span
                    className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[18px] font-normal leading-none transition-all duration-300 ${
                      isOpen
                        ? "bg-indigo-600 text-white rotate-45"
                        : "bg-indigo-50 text-indigo-600"
                    }`}
                  >
                    +
                  </span>
                </button>

                {/* Answer - animated with grid trick */}
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pt-[14px] pb-[18px] text-[14px] leading-[1.75] text-gray-500 border-t border-indigo-50 font-[Poppins,sans-serif]">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}