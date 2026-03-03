import { Skeleton } from "@maatwork/ui";

export default function Loading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64 bg-white/5" />
        <Skeleton className="h-4 w-48 bg-white/5" />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl bg-white/5 border border-white/5" />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Skeleton className="col-span-4 h-[400px] rounded-xl bg-white/5 border border-white/5" />
        <Skeleton className="col-span-3 h-[400px] rounded-xl bg-white/5 border border-white/5" />
      </div>
    </div>
  );
}
