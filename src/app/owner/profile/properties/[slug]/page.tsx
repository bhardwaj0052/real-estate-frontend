import OwnerPropertyDetails from "@/pages/ownerpage/ownerSlugPage";

interface PropertyDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PropertyDetails({ params }: PropertyDetailsPageProps) {
  const { slug } = await params;
  return <OwnerPropertyDetails slug={slug} />;
}