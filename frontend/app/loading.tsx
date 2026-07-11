export default function Loading() {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-warm-paper">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-navy/10 border-t-signal-orange" />
        <p className="text-sm text-slate-blue-400">Loading…</p>
      </div>
    </div>
  );
}
