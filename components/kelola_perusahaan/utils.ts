export function getInitialClass(nama: string): string {
  const map: Record<string, string> = {
    T: "bg-blue-100 text-blue-600",
    P: "bg-red-100 text-red-500",
    A: "bg-teal-100 text-teal-600",
    G: "bg-green-100 text-green-600",
    S: "bg-orange-100 text-orange-500",
    B: "bg-purple-100 text-purple-600",
    M: "bg-pink-100 text-pink-600",
    D: "bg-yellow-100 text-yellow-600",
  };
  return map[nama.charAt(0).toUpperCase()] ?? "bg-slate-100 text-slate-600";
}

// alias -- dipakai buat warna avatar kecil di tab Divisi (logikanya sama)
export const getDivisiColorClass = getInitialClass;

export function formatTanggal(dateStr: string): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}
