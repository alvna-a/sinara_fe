export default function MiniFooter() {
  return (
    // -mx-4 sm:-mx-6 lg:-mx-8 melawan padding horizontal <main> (dashboard_main.tsx)
    // biar footer bener-bener full-bleed, nempel rata ke kiri & kanan viewport.
    <footer className="-mx-4 sm:-mx-6 lg:-mx-8 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)] py-3 px-6 border-t border-gray-100 bg-white">
      <p className="text-xs text-center text-gray-400">
        ©2026 Sinara. POLINES, TA 2026.
      </p>
    </footer>
  );
}