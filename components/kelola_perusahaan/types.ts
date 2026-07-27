export type Perusahaan = {
  id: number;
  nama: string;
  city: string | null;
  province: string | null;
  address: string | null;
  jumlahDivisi: number;
  totalFeedback: number;
  tanggalUpdate: string;
  tanggalRaw: Date;
};

export type Divisi = {
  id: number;
  namaDivisi: string;
  companyId: number;
  perusahaan: string;
  initialPerusahaan: string;
  colorClass: string;
  totalFeedback: number;
  tanggalUpdate: string;
  tanggalRaw: Date;
};

export type DuplicateSide = {
  id: number;
  name: string;
  city: string | null;
  province: string | null;
  divisions_count: number;
};

export type DuplicateCandidate = {
  company_a: DuplicateSide;
  company_b: DuplicateSide;
  score: number;
};

export type CompanyOption = { id: number; nama: string; city?: string | null; province?: string | null };

export type SortKeyPerusahaan = "nama" | "jumlahDivisi" | "tanggalUpdate" | null;
export type SortKeyDivisi = "namaDivisi" | "perusahaan" | "tanggalUpdate" | null;
export type SortDir = "asc" | "desc";

export type ActiveTab = "perusahaan" | "divisi" | "duplikat";

export const PER_PAGE = 30;
