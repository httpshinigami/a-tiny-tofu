import { ShopsExplorer } from "@/components/explorer/ShopsExplorer";
import { getApprovedShops } from "@/lib/queries";

export const metadata = {
  title: "Shops",
};

export default async function ShopsPage() {
  const shops = await getApprovedShops();
  return <ShopsExplorer shops={shops} />;
}
