"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function buildPageItems(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items: (number | string)[] = [1];
  const left = Math.max(2, currentPage - 1);
  const right = Math.min(totalPages - 1, currentPage + 1);

  if (left > 2) {
    items.push("...");
  }

  for (let page = left; page <= right; page += 1) {
    items.push(page);
  }

  if (right < totalPages - 1) {
    items.push("...");
  }

  items.push(totalPages);
  return items;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = buildPageItems(currentPage, totalPages);

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="inline-flex h-10 min-w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        ‹
      </button>
      {pages.map((item, index) =>
        item === "..." ? (
          <span key={`dots-${index}`} className="inline-flex h-10 min-w-10 items-center justify-center rounded-2xl bg-slate-50 px-3 text-sm text-slate-400">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => typeof item === "number" && onPageChange(item)}
            className={`inline-flex h-10 min-w-10 items-center justify-center rounded-2xl border px-3 text-sm font-semibold transition ${
              item === currentPage
                ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-700"
            }`}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="inline-flex h-10 min-w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        ›
      </button>
    </nav>
  );
}
