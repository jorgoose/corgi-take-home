import { redirect } from "next/navigation";
import { getAllFunds } from "@/lib/api/funds";

export default function ScenariosIndexPage() {
  const funds = getAllFunds();
  if (funds.length > 0) {
    redirect(`/tools/scenarios/${funds[0].ticker}`);
  }
  return null;
}
