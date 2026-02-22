import { redirect } from "next/navigation";
import { getAllFunds } from "@/lib/api/funds";

export default function PerformanceIndexPage() {
  const funds = getAllFunds();
  if (funds.length > 0) {
    redirect(`/tools/performance/${funds[0].ticker}`);
  }
  return null;
}
