'use client'
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="font-[Poppins,sans-serif] bg-gray-50">

      {/* ===================== */}
      {/* HERO */}
      {/* ===================== */}
      <section className="bg-[#E0E7FF] px-6 md:px-10 py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

          <div>
            <p className="font-semibold text-gray-500 mb-2">Halo, Sahabat Mahasiswa</p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Temukan Magang Impian Sesuai Skill Kamu !!
            </h1>
            <p className="text-gray-500 text-lg max-w-lg mt-3">
              Kami membantumu menemukan divisi magang yang benar-benar sesuai dengan kemampuan dan minatmu.
              Dapatkan ranking posisi yang paling relevan untukmu.
            </p>

            <div className="flex gap-4 mt-8 mb-8 flex-wrap">
              <Link
                href="/register"
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-base text-white"
                style={{ background: "linear-gradient(90deg, #2563eb, #06b6d4)", boxShadow: "0 2px 10px rgba(37,99,235,0.25)" }}
              >
                Mulai Sekarang <span>→</span>
              </Link>
              <Link
                href="/panduan"
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-base text-blue-700 bg-blue-100 border border-blue-400 hover:bg-blue-200 transition"
              >
                Pelajari Cara Kerja
              </Link>
            </div>

            <div className="flex gap-10 mt-2">
              <div>
                <span className="font-bold text-3xl text-gray-900">300+</span><br />
                <span className="text-gray-500 font-medium text-sm">Perusahaan Terdaftar</span>
              </div>
              <div>
                <span className="font-bold text-3xl text-gray-900">50+</span><br />
                <span className="text-gray-500 font-medium text-sm">Mahasiswa Terbantu</span>
              </div>
            </div>
          </div>

          <div>
            <Image
              src="/beranda/hero.png"
              alt="hero"
              width={500}
              height={400}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* ===================== */}
      {/* PROBLEM */}
      {/* ===================== */}
      <section className="px-6 md:px-10 py-20">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
            Kenapa Banyak Mahasiswa Salah Pilih Tempat Magang?
          </h2>
          <p className="text-gray-500 text-lg max-w-3xl mb-10">
            Banyak mahasiswa memilih magang hanya berdasarkan nama perusahaan atau tren. Padahal, kecocokan skill dan minat jauh lebih menentukan pengalaman dan perkembangan karier.
          </p>

          <div className="flex flex-col gap-8 w-full items-center">
            {[
              {
                img: "/beranda/problem-1.png",
                title: "Terlalu Banyak Pilihan, Terlalu Sedikit Panduan",
                desc: "Banyaknya lowongan magang membuat bingung tanpa panduan jelas, sehingga mahasiswa cenderung memilih yang populer.",
              },
              {
                img: "/beranda/problem-2.png",
                title: "Mendaftar Tanpa Mengukur Kecocokan",
                desc: "Mahasiswa sering mendaftar tanpa mempertimbangkan skill dan minat sehingga pengalaman kurang maksimal.",
              },
              {
                img: "/beranda/problem-3.png",
                title: "Bingung Menentukan Divisi yang Paling Cocok",
                desc: "Banyak mahasiswa belum tahu divisi yang sesuai dengan potensi dan minat mereka.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row items-center md:items-start gap-8 w-full max-w-4xl bg-white rounded-2xl shadow-md p-8 text-left"
              >
                <div className="flex-shrink-0">
                  <Image
                    src={item.img}
                    alt={item.title}
                    width={180}
                    height={140}
                    className="rounded-2xl object-cover bg-indigo-50"
                  />
                </div>
                <div>
                  <p className="font-semibold text-xl mb-3">{item.title}</p>
                  <p className="text-gray-500 text-base leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== */}
      {/* SOLUSI */}
      {/* ===================== */}
      <section className="bg-[#E0E7FF] px-6 md:px-10 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center leading-tight mb-4">
            Bagaimana Sistem Ini Membantu Kamu<br />Memilih dengan Lebih Tepat?
          </h2>
          <p className="text-gray-500 text-lg text-center max-w-3xl mx-auto mb-12">
            Kami tidak hanya menampilkan daftar lowongan. Sistem ini dirancang untuk membantu kamu memahami posisi mana yang benar-benar selaras dengan kemampuan dan minatmu.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                img: "/beranda/solusi-1.png",
                title: "Rekomendasi Berbasis Skill yang Objektif",
                desc: "Sistem menganalisis kebutuhan skill pada setiap divisi, lalu mencocokkannya dengan skill yang kamu pilih. Hasilnya berupa tingkat kecocokan yang dihitung secara objektif.",
              },
              {
                img: "/beranda/solusi-2.png",
                title: "Fokus pada Divisi, Bukan Sekadar Nama Perusahaan",
                desc: "Setiap perusahaan memiliki beberapa divisi dengan kebutuhan skill yang berbeda. Oleh karena itu, rekomendasi yang diberikan berdasarkan kecocokan pada level divisi.",
              },
              {
                img: "/beranda/solusi-3.png",
                title: "Ranking yang Jelas dan Mudah Dipahami",
                desc: "Hasil rekomendasi ditampilkan berbentuk ranking berdasarkan tingkat kecocokan. Setiap pilihan dilengkapi persentase kesesuaian agar mudah dipahami.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center min-h-[380px]">
                <Image
                  src={item.img}
                  alt={item.title}
                  width={270}
                  height={210}
                  className="rounded-2xl mb-4 mx-auto"
                />
                <p className="font-semibold text-lg mb-3">{item.title}</p>
                <p className="text-gray-500 text-sm leading-relaxed text-justify">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

          {/* CTA */}
      <section className="px-6 md:px-10 py-14">
        <div className="max-w-6xl mx-auto">
          <div
            className="text-white text-center py-10 px-6 md:px-12 rounded-3xl"
            style={{ background: "linear-gradient(90deg, #6366f1, #8b5cf6)" }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
              Temukan Divisi Magang yang Paling Sesuai<br />dengan Skill Kamu
            </h2>
            <p className="text-indigo-100 text-l max-w-xl mx-auto mb-6">
              Masukkan skill yang kamu miliki, dan lihat divisi mana yang paling relevan untukmu. Biarkan sistem membantu menemukan posisi yang paling cocok.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 font-semibold text-l px-6 py-3 rounded-xl text-white transition hover:opacity-90 active:scale-[0.98]"
              style={{
                background: "linear-gradient(90deg, #f59e0b, #0ea5e9)",
                boxShadow: "0 2px 18px rgba(14,165,233,0.25)",
              }}
            >
              Mulai Rekomendasi Sekarang <span className="text-lg">↗</span>
            </Link>
          </div>
        </div>
      </section>


    </main>
  );
}