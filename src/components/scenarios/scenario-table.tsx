import { ScenarioResult } from "@/lib/types/scenarios";
import { cn } from "@/lib/utils";

interface ScenarioTableProps {
  scenarios: ScenarioResult[];
}

function formatReturn(value: number): string {
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function returnColor(value: number): string {
  if (value > 0) return "text-green-400";
  if (value < 0) return "text-red-400";
  return "text-muted-foreground";
}

export function ScenarioTable({ scenarios }: ScenarioTableProps) {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50 border-b">
            <th className="px-4 py-2 text-left font-medium text-muted-foreground">Ref Asset Return</th>
            <th className="px-4 py-2 text-right font-medium text-muted-foreground">Fund Return</th>
            <th className="px-4 py-2 text-right font-medium text-muted-foreground">Difference</th>
            <th className="px-4 py-2 text-left font-medium text-muted-foreground hidden sm:table-cell">What Happens</th>
          </tr>
        </thead>
        <tbody>
          {scenarios.map((s, i) => {
            const diff = s.fundReturn - s.refReturn;
            return (
              <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className={cn("px-4 py-2 font-mono", returnColor(s.refReturn))}>
                  {formatReturn(s.refReturn)}
                </td>
                <td className={cn("px-4 py-2 text-right font-mono", returnColor(s.fundReturn))}>
                  {formatReturn(s.fundReturn)}
                </td>
                <td className={cn("px-4 py-2 text-right font-mono", diff >= 0 ? "text-green-400" : "text-red-400")}>
                  {formatReturn(diff)}
                </td>
                <td className="px-4 py-2 text-muted-foreground hidden sm:table-cell">
                  {s.note}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
