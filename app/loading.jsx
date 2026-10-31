export default function Loading() {
  return (
    <div className="py-10 animate-pulse">
      {/* Skeleton Header */}
      <div className="h-10 w-2/3 max-w-md rounded-xl bg-permukaan mb-4" />
      <div className="h-5 w-1/2 max-w-sm rounded-lg bg-permukaan mb-8" />

      {/* Skeleton Filter */}
      <div className="flex gap-2 mb-8">
        <div className="h-8 w-20 rounded-lg bg-permukaan" />
        <div className="h-8 w-24 rounded-lg bg-permukaan" />
        <div className="h-8 w-24 rounded-lg bg-permukaan" />
      </div>

      {/* Skeleton Grid Produk */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-2xl border border-garis bg-latar p-3"
          >
            <div className="aspect-square w-full rounded-xl bg-permukaan mb-3" />
            <div className="h-4 w-1/3 rounded bg-permukaan mb-2" />
            <div className="h-5 w-4/5 rounded bg-permukaan mb-4" />
            <div className="mt-auto h-6 w-1/2 rounded bg-permukaan" />
          </div>
        ))}
      </div>
    </div>
  );
}

