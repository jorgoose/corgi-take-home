import { formatDate } from "@/lib/utils/format";

export function DataTimestamp({ date }: { date: string }) {
  return (
    <p className="text-xs text-muted-foreground">
      Data as of {formatDate(date)}
    </p>
  );
}
