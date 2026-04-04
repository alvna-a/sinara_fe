'use client'
import Image from "next/image";

export default function Home() {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        * {
          font-family: 'Poppins', sans-serif;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: #F9FAFB;
        }

        .container {
          width: 90%;
          max-width: 1200px;
          margin: auto;
          padding: 0 20px;
        }

        section {
          padding: 90px 40px;
        }

        h1 {
          font-size: 42px;
          font-weight: 700;
        }

        h2 {
          font-size: 30px;
          text-align: center;
        }

        p {
          color: #555;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
        }

        .grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 25px;
          margin-top: 40px;
        }

        .card {
          background: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
        }

        .btn {
          padding: 12px 20px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          margin-top: 20px;
        }

        .btn-primary {
          background: linear-gradient(90deg, #2563eb, #06b6d4);
          color: white;
          box-shadow: 0 12px 24px rgba(37, 99, 235, 0.18);
        }

        .hero {
          background: #E0E7FF;
        }

        .cta {
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          color: white;
          text-align: center;
          padding: 60px;
          border-radius: 20px;
        }

        .img {
          width: 100%;
          height: auto;
        }

        .grid-responsive {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          justify-content: center;
        }

        .problem-point {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          max-width: 800px;
        }

        @media(max-width: 768px) {
          .grid-2 {
            grid-template-columns: 1fr;
          }

          .grid-3 {
            grid-template-columns: 1fr;
          }

          .grid-responsive {
            grid-template-columns: 1fr !important;
          }

          .problem-point {
            flex-direction: column;
            align-items: center;
            gap: 12px;
            max-width: 100%;
            padding: 16px;
            border-radius: 8px;
            background: #F9FAFB;
          }

          .problem-point span {
            font-size: 20px !important;
          }

          .problem-point p {
            font-size: 16px !important;
          }
        }
      `}</style>

      {/* ===================== */}
      {/* SUBJUDUL: HERO */}
      {/* ===================== */}
      <section className="hero">
        <div className="container grid-2">

          <div>
              <p style={{fontWeight:600, color:'#6b7280', marginBottom:8}}>Halo, Sahabat Mahasiswa</p>
              <h1 style={{fontWeight:700, fontSize: '2.5rem', color:'#18181b', lineHeight:'1.2', marginBottom:10}}>
                Temukan Magang Impian
                Sesuai Skill Kamu !!
              </h1>
              <p style={{marginTop: 15, color:'#6b7280', fontSize:18, maxWidth:480}}>
                Kami membantumu menemukan divisi magang yang benar-benar sesuai dengan kemampuan dan minatmu.
                Dapatkan ranking posisi yang paling relevan untukmu.
              </p>

              <div style={{display:'flex', gap:16, marginTop:32, marginBottom:32}}>
                <button className="btn btn-primary" style={{display:'flex', alignItems:'center', gap:8, fontWeight:600, fontSize:16, boxShadow:'0 2px 10px rgba(37,99,235,0.25)'}}>
                  Mulai Sekarang
                  <span style={{fontSize:18, display:'inline-block', transform:'translateY(1px)'}}>→</span>
                </button>
                <button className="btn" style={{background:'#bfdbfe', color:'#1d4ed8', fontWeight:600, fontSize:16, border:'1px solid #60a5fa'}}>
                  Pelajari Cara Kerja
                </button>
              </div>

              <div style={{display:'flex', gap:40, marginTop:10}}>
                <div>
                  <span style={{fontWeight:700, fontSize:28, color:'#18181b'}}>300+</span><br />
                  <span style={{color:'#6b7280', fontWeight:500, fontSize:15}}>Perusahaan Terdaftar</span>
                </div>
                <div>
                  <span style={{fontWeight:700, fontSize:28, color:'#18181b'}}>50+</span><br />
                  <span style={{color:'#6b7280', fontWeight:500, fontSize:15}}>Mahasiswa Terbantu</span>
                </div>
              </div>
          </div>

          <div>
            <Image
              src="/beranda/hero.png"
              alt="hero"
              width={500}
              height={400}
              className="img"
            />
          </div>

        </div>
      </section>

      {/* ===================== */}
      {/* SUBJUDUL: PROBLEM */}
      {/* ===================== */}
      <section>
        <div className="container" style={{textAlign: 'center'}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
            <h2 style={{textAlign: 'center', marginBottom: 16, fontSize: '2rem', fontWeight: 700, lineHeight: 1.2}}>
              Kenapa Banyak Mahasiswa Salah Pilih Tempat Magang?
            </h2>
            <p style={{marginBottom: 32, color: '#555', maxWidth: 900, textAlign: 'center', fontSize: 18}}>
              Banyak mahasiswa memilih magang hanya berdasarkan nama perusahaan atau tren. Padahal, kecocokan skill dan minat jauh lebih menentukan pengalaman dan perkembangan karier.
            </p>
            <div style={{display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center', width: '100%'}}>
              {/* Poin 1 */}
              <div className="problem-point" style={{display: 'flex', alignItems: 'center', gap: 32, maxWidth: 1040, width: '100%', background: '#fff', borderRadius: 22, boxShadow: '0 8px 30px rgba(0,0,0,0.08)', padding: 38}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0}}>
                  <Image src="/beranda/problem-1.png" alt="Terlalu banyak pilihan" width={180} height={140} style={{borderRadius: 16, objectFit: 'cover', background: '#eef2ff'}} sizes="(max-width: 768px) 90vw, 180px" />
                </div>
                <div style={{textAlign: 'left'}}>
                  <span style={{fontWeight: 600, fontSize: 24}}>Terlalu Banyak Pilihan, Terlalu Sedikit Panduan</span>
                  <p style={{marginTop: 10, color: '#555', fontSize: 18, lineHeight: 1.6}}>
                    Banyaknya lowongan magang membuat bingung tanpa panduan jelas, sehingga mahasiswa cenderung memilih yang populer.
                  </p>
                </div>
              </div>
              {/* Poin 2 */}
              <div className="problem-point" style={{display: 'flex', alignItems: 'center', gap: 32, maxWidth: 1040, width: '100%', background: '#fff', borderRadius: 22, boxShadow: '0 8px 30px rgba(0,0,0,0.08)', padding: 38}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0}}>
                  <Image src="/beranda/problem-2.png" alt="Tidak ukur skill" width={180} height={140} style={{borderRadius: 16, objectFit: 'cover', background: '#eef2ff'}} sizes="(max-width: 768px) 90vw, 180px" />
                </div>
                <div style={{textAlign: 'left'}}>
                  <span style={{fontWeight: 600, fontSize: 24}}>Mendaftar Tanpa Mengukur Kecocokan</span>
                  <p style={{marginTop: 10, color: '#555', fontSize: 18, lineHeight: 1.6}}>
                    Mahasiswa sering mendaftar tanpa mempertimbangkan skill dan minat sehingga pengalaman kurang maksimal.
                  </p>
                </div>
              </div>
              {/* Poin 3 */}
              <div className="problem-point" style={{display: 'flex', alignItems: 'center', gap: 32, maxWidth: 1040, width: '100%', background: '#fff', borderRadius: 22, boxShadow: '0 8px 30px rgba(0,0,0,0.08)', padding: 38}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0}}>
                  <Image src="/beranda/problem-3.png" alt="Bingung divisi" width={180} height={140} style={{borderRadius: 16, objectFit: 'cover', background: '#eef2ff'}} sizes="(max-width: 768px) 90vw, 180px" />
                </div>
                <div style={{textAlign: 'left'}}>
                  <span style={{fontWeight: 600, fontSize: 24}}>Bingung Menentukan Divisi yang Paling Cocok</span>
                  <p style={{marginTop: 10, color: '#555', fontSize: 18, lineHeight: 1.6}}>
                    Banyak mahasiswa belum tahu divisi yang sesuai dengan potensi dan minat mereka.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <style jsx>{`
        @media (max-width: 900px) {
          .problem-point {
            flex-direction: column !important;
            align-items: flex-start !important;
            text-align: left !important;
            gap: 12px !important;
            padding: 16px !important;
          }
        }
        @media (max-width: 600px) {
          .problem-point {
            flex-direction: column !important;
            align-items: stretch !important;
            text-align: left !important;
            gap: 8px !important;
            padding: 10px !important;
          }
        }
      `}</style>

      {/* ===================== */}
      {/* SUBJUDUL: SOLUSI */}
      {/* ===================== */}
      <section style={{background:'#E0E7FF', padding: '90px 40px'}}>
        <div className="container" style={{maxWidth: 1200, margin: '0 auto'}}>
          <h2 style={{
            textAlign: 'center',
            fontSize: 36,
            fontWeight: 700,
            marginBottom: 18,
            color: '#18181b',
            lineHeight: 1.2
          }}>
            Bagaimana Sistem Ini Membantu Kamu<br />
            Memilih dengan Lebih Tepat?
          </h2>
          <p style={{
            textAlign: 'center',
            color: '#6b7280',
            fontSize: 18,
            maxWidth: 900,
            margin: '0 auto 48px auto'
          }}>
            Kami tidak hanya menampilkan daftar lowongan. 
            Sistem ini dirancang untuk membantu kamu memahami posisi mana yang benar-benar 
            selaras dengan kemampuan dan minatmu.
          </p>
          <div className="grid-responsive">
            {/* Card 1 */}
            <div className="card" style={{alignItems: 'center', textAlign: 'center', minHeight: 380, padding: 26, width: '100%'}}>
              <Image src="/beranda/solusi-1.png" alt="Rekomendasi Skill" width={270} height={210} style={{margin: '0 auto 16px auto', borderRadius: 16}} />
              <div style={{fontWeight: 600, fontSize: 19, marginBottom: 10}}>Rekomendasi Berbasis Skill yang Objektif</div>
              <div style={{color: '#555', fontSize: 15, lineHeight: 1.5, textAlign: 'justify'}}>
                Sistem menganalisis kebutuhan skill pada setiap divisi, lalu mencocokkannya dengan skill yang kamu pilih. 
                Hasilnya berupa tingkat kecocokan yang dihitung secara objektif.
              </div>
            </div>
            {/* Card 2 */}
            <div className="card" style={{alignItems: 'center', textAlign: 'center', minHeight: 380, padding: 26, width: '100%'}}>
              <Image src="/beranda/solusi-2.png" alt="Fokus Divisi" width={270} height={210} style={{margin: '0 auto 16px auto', borderRadius: 16}} />
              <div style={{fontWeight: 600, fontSize: 19, marginBottom: 10}}>Fokus pada Divisi, Bukan Sekadar Nama Perusahaan</div>
              <div style={{color: '#555', fontSize: 15, lineHeight: 1.5, textAlign: 'justify'}}>
                Setiap perusahaan memiliki beberapa divisi dengan kebutuhan skill yang berbeda. Oleh karena itu, rekomendasi yang diberikan berdasarkan kecocokan pada level divisi.
              </div>
            </div>
            {/* Card 3 */}
            <div className="card" style={{alignItems: 'center', textAlign: 'center', minHeight: 380, padding: 26, width: '100%'}}>
              <Image src="/beranda/solusi-3.png" alt="Ranking Jelas" width={270} height={210} style={{margin: '0 auto 16px auto', borderRadius: 16}} />
              <div style={{fontWeight: 600, fontSize: 19, marginBottom: 10}}>Ranking yang Jelas dan Mudah Dipahami</div>
              <div style={{color: '#555', fontSize: 15, lineHeight: 1.5, textAlign: 'justify'}}>
                Hasil rekomendasi ditampilkan berbentuk ranking berdasarkan tingkat kecocokan.
                Setiap pilihan dilengkapi persentase kesesuaian agar mudah dipahami.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== */}
      {/* SUBJUDUL: CTA */}
      {/* ===================== */}
      <section>
        <div className="container">
          <div className="cta" style={{background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', color: 'white', textAlign: 'center', padding: '45px 25px', borderRadius: '40px', maxWidth: '100%', margin: '0 auto'}}>
            <h2 style={{fontSize: '2.5rem', fontWeight: 700, marginBottom: 24, lineHeight: 1.2}}>
              Temukan Divisi Magang yang Paling Sesuai<br />dengan Skill Kamu
            </h2>
            <p style={{fontSize: '18px', color: '#e0e7ff', marginBottom: 32, maxWidth: 900, marginLeft: 'auto', marginRight: 'auto'}}>
              Masukkan skill yang kamu miliki, dan lihat divisi mana yang paling relevan untukmu. Biarkan sistem membantu menemukan posisi yang paling cocok berdasarkan skill yang kamu miliki.
            </p>
            <button className="btn btn-primary" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600, fontSize: 18, padding: '16px 32px', background: 'linear-gradient(90deg, #f59e0b, #0ea5e9)', color: 'white', border: 'none', borderRadius: 16, margin: '0 auto', boxShadow: '0 2px 18px rgba(14,165,233,0.25)'}}>
              Mulai Rekomendasi Sekarang
              <span style={{fontSize: 24, display: 'inline-block', transform: 'translateY(1px)'}}>↗</span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}