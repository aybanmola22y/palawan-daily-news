import { getAds } from "@/lib/ads-service";

export default async function TestAdsPage() {
  const ads = await getAds();
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Ads Diagnostic</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(ads, null, 2)}
      </pre>
    </div>
  );
}
