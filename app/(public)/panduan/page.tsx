'use client'

import { useState, useEffect } from 'react'

export default function Panduan() {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    const check = (): void => setIsMobile(window.innerWidth < 600)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <>
      {/* ===================== */}
      {/* HERO PANDUAN */}
      {/* ===================== */}
      <section style={{ background: 'linear-gradient(180deg, #E0E7FF 0%, #eef6ff 50%, #f8fafc 100%)', padding: '70px 40px 50px' }}>
        <div style={{ width: '90%', maxWidth: 800, margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '2.2rem',
            fontWeight: 700,
            color: '#18181b',
            lineHeight: 1.3,
            marginBottom: 16,
            fontFamily: 'Poppins, sans-serif',
          }}>
            Pahami cara kerja dan{' '}
            <span style={{ color: '#4F46E5' }}>baca hasil rekomendasi</span>{' '}
            dengan lebih tepat
          </h1>
          <p style={{ color: '#6b7280', fontSize: 16, maxWidth: 700, margin: '0 auto', fontFamily: 'Poppins, sans-serif' }}>
            Halaman ini membantu kamu memahami alur sistem, memastikan persentase kesesuaian,
            dan melihat batasan rekomendasi sebelum menentukan divisi magang yang paling sesuai.
          </p>
        </div>
      </section>

      {/* ===================== */}
      {/* CARA KERJA SISTEM */}
      {/* ===================== */}
      <section style={{ background: '#fff', padding: '40px 30px' }}>
        <div style={{ width: '90%', maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.9rem', marginBottom: 10, color: '#18181b', fontFamily: 'Poppins, sans-serif', textAlign: 'center' }}>
            Cara Kerja Sistem
          </h2>

          <div style={{ borderTop: '1px solid #e5e7eb', marginBottom: 48 }} />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20,
          }}>
            {[
              {
                num: '1',
                title: 'Pilih Skill yang Dimiliki',
                desc: 'Pilih skill yang kamu kuasai untuk di analisis awal.',
                image: '/panduan/logo1.png'
              },
              {
                num: '2',
                title: 'Sistem Membentuk Representasi Teks',
                desc: 'Sistem membentuk profil teks dengan pembobotan kata.',
                image: '/panduan/logo2.png'
              },
              {
                num: '3',
                title: 'Perhitungan Kesesuaian',
                desc: 'Menghitung cosine similarity untuk kesesuaian.',
                image: '/panduan/logo3.png'
              },
              {
                num: '4',
                title: 'Ranking Rekomendasi',
                desc: 'Menampilkan divisi dengan kesesuaian tertinggi.',
                image: '/panduan/logo4.png'
              }
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: '#f0f4ff',
                  borderRadius: 16,
                  padding: '28px 20px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 4,
                  fontFamily: 'Poppins, sans-serif',
                }}>
                  {item.num}
                </div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#18181b', lineHeight: 1.4, fontFamily: 'Poppins, sans-serif' }}>
                  {item.title}
                </div>
                <div style={{ margin: '16px 0' }}>
                  <img src={item.image} alt={item.title} style={{ width: 96, height: 96, objectFit: 'contain' }} />
                </div>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5, fontFamily: 'Poppins, sans-serif', margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== */}
      {/* CARA MEMBACA HASIL REKOMENDASI */}
      {/* ===================== */}
      <section style={{ background: '#fff', padding: '40px 30px' }}>
        <div style={{ width: '90%', maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.9rem', marginBottom: 10, color: '#18181b', fontFamily: 'Poppins, sans-serif', textAlign: 'center' }}>
            Cara Membaca Hasil Rekomendasi
          </h2>

          <div style={{ borderTop: '1px solid #e5e7eb', marginBottom: 48 }} />

          <div style={{
            background: '#E0E7FF',
            borderRadius: 20,
            padding: '32px 36px',
          }}>
            <p style={{ fontWeight: 600, fontSize: 17, color: '#1e1b4b', marginBottom: 8, fontFamily: 'Poppins, sans-serif', margin: '0 0 8px' }}>
              Memahami hasil rekomendasi akan membantu kamu memilih divisi magang yang paling tepat.
            </p>
            <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 28, fontFamily: 'Poppins, sans-serif', margin: '0 0 28px' }}>
              Sistem menampilkan daftar divisi berdasarkan tingkat kesesuaian antara skill yang kamu miliki dengan kebutuhan masing-masing divisi. Gunakan hasil ini sebagai bahan pertimbangan yang lebih terarah.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(auto-fit, minmax(240px, 1fr))' : 'repeat(2, 1fr)',
              gap: 20,
            }}>
              {/* Card 1 */}
              <div style={{ background: 'white', borderRadius: 14, padding: '22px 24px', display: 'flex', flexDirection: 'column', minHeight: 280 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                    color: 'white', fontWeight: 700, fontSize: 13,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    fontFamily: 'Poppins, sans-serif',
                  }}>1</div>
                  <span style={{ fontWeight: 600, fontSize: 14, color: '#18181b', fontFamily: 'Poppins, sans-serif' }}>
                    Perhatikan Persentase Kesesuaian
                  </span>
                </div>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, fontFamily: 'Poppins, sans-serif', margin: '0 0 14px' }}>
                  Persentase merupakan beberapa nilai skill yang kamu pilih dengan kebutuhan skill pada suatu divisi. Semakin tinggi nilainya, semakin berpotensi divisi tersebut cocok dengan kemampuanmu.
                </p>
                <div style={{ marginTop: 'auto' }}>
                  {[
                    { label: 'Divisi A', pct: 85, color: '#6366f1' },
                    { label: 'Divisi B', pct: 65, color: '#818cf8' },
                    { label: 'Divisi C', pct: 45, color: '#a5b4fc' },
                  ].map((d, i) => (
                    <div key={i} style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ fontSize: 12, color: '#374151', fontFamily: 'Poppins, sans-serif' }}>{d.label}</span>
                        <span style={{ fontSize: 12, color: '#374151', fontFamily: 'Poppins, sans-serif' }}>{d.pct}%</span>
                      </div>
                      <div style={{ height: 6, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${d.pct}%`, height: '100%', background: d.color, borderRadius: 4 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2 */}
              <div style={{ background: 'white', borderRadius: 14, padding: '22px 24px', display: 'flex', flexDirection: 'column', minHeight: 280 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                    color: 'white', fontWeight: 700, fontSize: 13,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    fontFamily: 'Poppins, sans-serif',
                  }}>2</div>
                  <span style={{ fontWeight: 600, fontSize: 14, color: '#18181b', fontFamily: 'Poppins, sans-serif' }}>
                    Bandingkan Beberapa Rekomendasi
                  </span>
                </div>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, fontFamily: 'Poppins, sans-serif', margin: '0 0 16px', flexGrow: 1 }}>
                  Jangan langsung memilih satu hasil saja. Perhatikan beberapa divisi dengan persentase tertinggi dan bandingkan mana yang paling sesuai dengan minat dan tujuan magangmu.
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 'auto' }}>
                  {['Tingkat kesesuaian', 'Minat pribadi', 'Tujuan magang'].map((tag, i) => (
                    <span key={i} style={{
                      background: '#e0e7ff',
                      color: '#4338ca',
                      fontSize: 12, fontWeight: 500,
                      padding: '5px 12px', borderRadius: 20,
                      fontFamily: 'Poppins, sans-serif',
                    }}>{tag}</span>
                  ))}
                </div>
              </div>

              {/* Card 3 */}
              <div style={{ background: 'white', borderRadius: 14, padding: '22px 24px', display: 'flex', flexDirection: 'column', minHeight: 280 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                    color: 'white', fontWeight: 700, fontSize: 13,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    fontFamily: 'Poppins, sans-serif',
                  }}>3</div>
                  <span style={{ fontWeight: 600, fontSize: 14, color: '#18181b', fontFamily: 'Poppins, sans-serif' }}>
                    Baca Detail Deskripsi Divisi
                  </span>
                </div>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, fontFamily: 'Poppins, sans-serif', margin: '0 0 16px' }}>
                  Selain melihat persentase, penting juga untuk membaca deskripsi dan tanggung jawab pada divisi tersebut agar kamu memahami pekerjaan yang akan dilakukan.
                </p>
                <div style={{ marginTop: 'auto', background: '#f5f3ff', borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1', flexShrink: 0 }} />
                    <div style={{ height: 6, width: '65%', background: '#6366f1', borderRadius: 4 }} />
                  </div>
                  {[['75%', '#a5b4fc'], ['55%', '#c7d2fe'], ['70%', '#a5b4fc'], ['45%', '#c7d2fe']].map(([w, c], i) => (
                    <div key={i} style={{ height: 5, width: w, background: c, borderRadius: 4, marginBottom: 7 }} />
                  ))}
                  <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                    {['Deskripsi', 'Tanggung jawab', 'Skill'].map((label, i) => (
                      <span key={i} style={{
                        background: i === 0 ? '#e0e7ff' : 'white',
                        color: i === 0 ? '#4338ca' : '#6b7280',
                        fontSize: 10, fontWeight: 500,
                        padding: '3px 8px', borderRadius: 20,
                        fontFamily: 'Poppins, sans-serif',
                        border: i !== 0 ? '1px solid #e5e7eb' : 'none',
                      }}>{label}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 4 */}
              <div style={{ background: 'white', borderRadius: 14, padding: '22px 24px', display: 'flex', flexDirection: 'column', minHeight: 280 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                    color: 'white', fontWeight: 700, fontSize: 13,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    fontFamily: 'Poppins, sans-serif',
                  }}>4</div>
                  <span style={{ fontWeight: 600, fontSize: 14, color: '#18181b', fontFamily: 'Poppins, sans-serif' }}>
                    Gunakan Rekomendasi sebagai Pertimbangan
                  </span>
                </div>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, fontFamily: 'Poppins, sans-serif', margin: '0 0 14px', flexGrow: 1 }}>
                  Hasil rekomendasi membantu mempersempit gambaran divisi yang cocok, namun keputusan akhir tetap berada pada pilihan kamu sesuai minat dan rencana kamu.
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 'auto' }}>
                  {['Bukan keputusan aktif', 'Tetap sesuaikan minat'].map((tag, i) => (
                    <span key={i} style={{
                      background: '#e0e7ff',
                      color: '#4338ca',
                      fontSize: 12, fontWeight: 500,
                      padding: '5px 12px', borderRadius: 20,
                      fontFamily: 'Poppins, sans-serif',
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== */}
      {/* BATASAN SISTEM */}
      {/* ===================== */}
      <section style={{ background: '#F9FAFB', padding: '40px 30px' }}>
        <div style={{ width: '90%', maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.9rem', marginBottom: 10, color: '#18181b', fontFamily: 'Poppins, sans-serif', textAlign: 'center' }}>
            Batasan Sistem
          </h2>

          <div style={{ borderTop: '1px solid #e5e7eb', marginBottom: 48 }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'start' }}>
            {/* Left */}
            <div>
              <p style={{ fontWeight: 600, fontSize: 17, color: '#18181b', lineHeight: 1.5, marginBottom: 8, fontFamily: 'Poppins, sans-serif', margin: '0 0 8px' }}>
                Rekomendasi membantu, tapi keputusan tetap ada pada kamu.
              </p>
              <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 28, lineHeight: 1.7, fontFamily: 'Poppins, sans-serif', margin: '0 0 28px' }}>
                Sistem memberikan gambaran divisi yang sesuai berdasarkan skill yang kamu pilih, namun belum memiliki semua faktor secara lengkap.
              </p>

              {[
                {
                  color: '#6366f1',
                  title: 'Berbasis kesesuaian skill',
                  desc: 'Hasil dihitung berdasarkan kecocokan teks dengan kebutuhan divisi.'
                },
                {
                  color: '#f59e0b',
                  title: 'Belum mempertimbangkan faktor personal',
                  desc: 'Pengalaman, proyek, dan minat pribadi belum sepenuhnya terukur.'
                },
                {
                  color: '#10b981',
                  title: 'Bersifat rekomendasi',
                  desc: 'Hasil bersifat sebagai pertimbangan awal, bukan keputusan akhir.'
                }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 22, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: item.color, flexShrink: 0, marginTop: 5,
                  }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#18181b', marginBottom: 3, fontFamily: 'Poppins, sans-serif' }}>
                      {item.title}
                    </div>
                    <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, fontFamily: 'Poppins, sans-serif', margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right */}
            <div>
              <div style={{
                background: '#E0E7FF',
                borderRadius: 20,
                padding: '30px 28px',
              }}>
                <p style={{ fontWeight: 600, fontSize: 15, color: '#1e1b4b', marginBottom: 6, fontFamily: 'Poppins, sans-serif', margin: '0 0 6px' }}>
                  Gunakan hasil dengan bijak
                </p>
                <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 24, lineHeight: 1.7, fontFamily: 'Poppins, sans-serif', margin: '0 0 24px' }}>
                  Pertimbangkan rekomendasi sebagai bahan awal dan bukan hasil final.
                </p>

                <div style={{
                  background: 'white',
                  borderRadius: 14,
                  padding: '20px 22px',
                  marginBottom: 20,
                }}>
                  <p style={{ fontSize: 11, fontWeight: 500, color: '#18181b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, fontFamily: 'Poppins, sans-serif', margin: '0 0 8px' }}>
                    Inti keputusan
                  </p>
                  <p style={{ fontWeight: 600, fontSize: 15, color: '#18181b', marginBottom: 6, fontFamily: 'Poppins, sans-serif', margin: '0 0 6px' }}>
                    Pilih divisi yang paling sesuai untukmu.
                  </p>
                  <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, fontFamily: 'Poppins, sans-serif', margin: 0 }}>
                    Angka membantu memperbandingkan pilihan, tetapi keputusan terbaik tetap pada pertimbangan pribadi.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{
                    background: 'white', borderRadius: 10, padding: '10px 14px',
                    flex: 1, textAlign: 'center',
                  }}>
                    <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 4, fontFamily: 'Poppins, sans-serif', margin: '0 0 4px' }}>Batasan utama</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#18181b', fontFamily: 'Poppins, sans-serif', margin: 0 }}>Menyaring divisi yang relevan</p>
                  </div>
                  <div style={{
                    background: 'white', borderRadius: 10, padding: '10px 14px',
                    flex: 1, textAlign: 'center',
                  }}>
                    <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 4, fontFamily: 'Poppins, sans-serif', margin: '0 0 4px' }}>Jangan hanya</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#18181b', fontFamily: 'Poppins, sans-serif', margin: 0 }}>Bergantung pada persentase saja</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}