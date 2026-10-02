export default function MagazinesLoading() {
  return (
    <div className="container-editorial py-16 md:py-20" aria-busy="true">
      <div className="mb-12 max-w-2xl">
        <div className="h-3 w-24 animate-pulse bg-line" />
        <div className="mt-4 h-12 w-80 max-w-full animate-pulse bg-line" />
      </div>
      <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[3/4] w-full animate-pulse bg-ivory-deep" />
            <div className="mt-4 h-3 w-16 animate-pulse bg-line" />
            <div className="mt-2 h-4 w-32 max-w-full animate-pulse bg-line" />
          </div>
        ))}
      </div>
    </div>
  );
}
