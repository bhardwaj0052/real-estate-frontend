import OwnerPropertyDetails from "@/components/owner/ownerpropertydetails";

interface PropertyDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PropertyDetailsPage({ params }: PropertyDetailsPageProps) {
  const { slug } = await params;
  return <OwnerPropertyDetails slug={slug} />;
}