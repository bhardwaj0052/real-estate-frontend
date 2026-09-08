import { useState } from "react";
import { removeSavedProperty, saveProperty } from "@/services/propertyService";
import type { Property } from "@/types/property";

export function getPropertyLocation(property: Property) {
  return (
    property.location ??
    [property.address, property.area, property.city].filter(Boolean).join(", ")
  );
}

export function usePropertyCardItem(
  propertyId: string,
  saved: boolean,
  onRemoved?: (propertyId: string) => void,
) {
  const [brokenImage, setBrokenImage] = useState(false);
  const [isSaved, setIsSaved] = useState(saved);
  const [saving, setSaving] = useState(false);

  async function toggleSave(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (saving) return;

    setSaving(true);
    try {
      if (isSaved) {
        await removeSavedProperty(propertyId);
        onRemoved?.(propertyId);
      } else {
        await saveProperty(propertyId);
      }
      setIsSaved(!isSaved);
    } finally {
      setSaving(false);
    }
  }

  return {
    brokenImage,
    isSaved,
    saving,
    setBrokenImage,
    toggleSave,
  };
}
