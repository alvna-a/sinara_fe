// services/recommend.ts
export async function getRecommendations(topN = 5) {
  const token = localStorage.getItem('access_token'); // ← key yang kamu pakai

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recommendations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ top_n: topN }),
  });

  if (!res.ok) throw new Error('Gagal mengambil rekomendasi');
  return res.json();
}