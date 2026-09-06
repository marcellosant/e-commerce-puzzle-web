// Purely decorative placeholder shown during the route transition — hidden from
// assistive tech so nothing is announced until the real content arrives.
export default function Loading() {
  return (
    <div className="px-4 lg:px-8 py-8 lg:py-12" aria-hidden="true">
      <div className="h-9 w-56 bg-surface-muted mb-6" />

      <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-10">
        <div className="hidden lg:block space-y-8">
          {[0, 1, 2, 3].map((group) => (
            <div key={group} className="space-y-3">
              <div className="h-4 w-32 bg-surface-muted" />
              <div className="h-4 w-24 bg-surface-muted" />
              <div className="h-4 w-28 bg-surface-muted" />
              <div className="h-4 w-20 bg-surface-muted" />
            </div>
          ))}
        </div>

        <div>
          <div className="h-5 w-28 bg-surface-muted mb-4" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i}>
                <div className="aspect-square bg-surface-muted border border-black" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 w-3/4 bg-surface-muted" />
                  <div className="h-4 w-1/2 bg-surface-muted" />
                  <div className="h-4 w-1/3 bg-surface-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
