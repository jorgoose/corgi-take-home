export default function ScenariosLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-96 animate-pulse rounded bg-muted" />
        <div className="h-4 w-48 animate-pulse rounded bg-muted mt-2" />
      </div>
      <div className="h-10 w-64 animate-pulse rounded-lg bg-muted" />
      <div className="h-[400px] animate-pulse rounded-lg border bg-muted" />
      <div className="h-48 animate-pulse rounded-lg border bg-muted" />
    </div>
  );
}
