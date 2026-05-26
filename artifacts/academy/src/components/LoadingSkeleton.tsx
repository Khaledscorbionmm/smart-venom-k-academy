import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export function PageSkeleton() {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-32 bg-card rounded-xl border border-border overflow-hidden">
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-6 w-12 rounded-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function CoursesSkeleton() {
  return (
    <div className="container mx-auto p-3 sm:p-6 md:p-8 space-y-6">
      <div className="flex flex-col items-center space-y-3 mb-8">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <Skeleton className="h-5 w-96 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden border-border/50 h-64">
            <Skeleton className="h-2 w-full rounded-none" style={{ opacity: 0.3 + i * 0.1 }} />
            <CardContent className="p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-7 w-3/4" />
                </div>
                <Skeleton className="h-12 w-12 rounded-xl" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-9 w-full rounded-lg mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function LessonSkeleton() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="border-border/50">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div className="rounded-2xl border border-border/50 bg-card/50 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1 space-y-2 w-full">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full max-w-xs" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-card/50 border-border/50">
            <CardContent className="p-5 sm:p-6 flex flex-col items-center text-center space-y-2">
              <Skeleton className="h-7 w-7 rounded-full" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
