"use client";

import Profile from "@/components/common/profile";

export default function OwnerProfilePage() {
  return <Profile title="Owner Profile" fallbackName="Property owner" idLabel="Owner ID" fallbackRole="OWNER" />;
}