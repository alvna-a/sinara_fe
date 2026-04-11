import Link from "next/link";

export interface Company {
  id: number;
  name: string;
  full_name: string;
  logo_url: string | null;
  industri: string;
  kota: string;
  total_mahasiswa: number;
  avg_rating: number;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`w-4 h-4 ${star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function CompanyLogo({ company }: { company: Company }) {
  const dim = "w-14 h-14 text-sm";
  if (company.logo_url) {
    return <img src={company.logo_url} alt={company.name} className={`${dim} rounded-xl object-contain bg-gray-50 border border-gray-100 flex-shrink-0`} />;
  }
  return (
    <div className={`${dim} rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center flex-shrink-0`}>
      {company.name.slice(0, 5)}
    </div>
  );
}

export function CompanyGridCard({ company }: { company: Company }) {
  return (
    <Link href={`/perusahaan/${company.id}`}>
      <div className="bg-white rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 p-5 flex flex-col gap-3 h-full cursor-pointer">
        <div className="flex items-start justify-between">
          <CompanyLogo company={company} />
          <StarRating rating={company.avg_rating} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm leading-tight">{company.full_name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{company.industri}</p>
        </div>
        <div className="flex flex-col gap-1 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
            {company.kota}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {company.total_mahasiswa} mahasiswa telah magang
          </span>
        </div>
        <div className="mt-auto pt-3 border-t border-gray-100">
          <span className="text-xs font-semibold text-indigo-600 w-full text-center block py-1.5 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition">
            Lihat detail
          </span>
        </div>
      </div>
    </Link>
  );
}
