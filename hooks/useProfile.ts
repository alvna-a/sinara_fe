"use client";
// hooks/useProfile.ts
// Hook shared untuk profil calon & alumni — sync ke BE
// Endpoint: GET /api/me, GET /api/profile, POST /api/profile
import { useState, useEffect, useCallback } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export interface UserProfile {
  id: number;
  name: string;
  nim: string;
  email: string;
  role: string;
  phone: string;
  program_studi: string;
  semester: string;
  photo: string | null;
  kelengkapan_profil: number;
}

const DEFAULT: UserProfile = {
  id: 0,
  name: "",
  nim: "",
  email: "",
  role: "",
  phone: "",
  program_studi: "",
  semester: "",
  photo: null,
  kelengkapan_profil: 0,
};

function calcKelengkapan(user: Record<string, unknown>, profile: Record<string, unknown>): number {
  const fields = [
    user?.name,
    user?.email,
    user?.nim,
    profile?.phone,
    profile?.photo,
    profile?.program_studi,
    profile?.semester,
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [resMe, resProfile] = await Promise.all([
        fetch(`${API_BASE}/me`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        }),
        fetch(`${API_BASE}/profile`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        }),
      ]);

      if (!resMe.ok) throw new Error("Sesi berakhir. Silakan login ulang.");
      const user = await resMe.json();
      const profileJson = resProfile.ok ? await resProfile.json() : { data: {} };
      const profileData =
        profileJson?.data?.profile ?? profileJson?.data ?? {};

      const photoUrl = profileData?.photo
        ? `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/storage/${profileData.photo}`
        : null;

      setProfile({
        id: user.id ?? 0,
        name: user.name ?? "",
        nim: user.nim ?? "",
        email: user.email ?? "",
        role: user.role ?? "",
        phone: profileData?.phone ?? "",
        program_studi: profileData?.program_studi ?? "",
        semester: profileData?.semester ?? "",
        photo: photoUrl,
        kelengkapan_profil: calcKelengkapan(user, profileData),
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal memuat profil.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Simpan perubahan profil ke BE
  const saveProfile = async (data: {
    phone?: string;
    program_studi?: string;
    semester?: string;
    photoFile?: File | null;
  }): Promise<void> => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Token tidak ditemukan.");
    setIsSaving(true);
    try {
      const body = new FormData();
      if (data.phone !== undefined) body.append("phone", data.phone);
      if (data.program_studi !== undefined)
        body.append("program_studi", data.program_studi);
      if (data.semester !== undefined) body.append("semester", data.semester);
      if (data.photoFile) body.append("photo", data.photoFile);

      const res = await fetch(`${API_BASE}/profile`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        body,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message ?? `Error ${res.status}`);
      }
      await fetchProfile(); // re-fetch supaya data terbaru
    } finally {
      setIsSaving(false);
    }
  };

  return { profile, loading, error, isSaving, fetchProfile, saveProfile };
}