import { Skeleton, Card, CardHeader, CardContent } from "@maatwork/ui";

export default function HealthLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-white/5 bg-black/40 backdrop-blur-3xl">
            <CardHeader><Skeleton className="h-4 w-20" /></CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-16 pt-4 border-t border-white/5" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/5 bg-black/40 backdrop-blur-3xl">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full rounded-xl" />
        </CardContent>
      </Card>
    </div>
  );
}
