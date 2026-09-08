import { useEffect, useState } from "react";
import {
  getApprovedProperties,
  getSavedProperties,
} from "@/services/propertyService";
import type { Property } from "@/types/property";

type PropertiesResponse = Property[] | { properties: Property[] };
type SavedProperty = { propertyId?: string | { _id: string } };
type SavedPropertiesResponse =
  | SavedProperty[]
  | { properties: SavedProperty[] }
  | { savedProperties: SavedProperty[] }
  | { data: SavedProperty[] };

export function usePropertyCard() {
  const [token] = useState(() =>
    typeof window === "undefined"
      ? ""
      : window.localStorage.getItem("access_token") ?? "",
  );
  const [properties, setProperties] = useState<Property[]>([]);
  const [savedPropertyIds, setSavedPropertyIds] = useState<Set<string>>(
    new Set(),
  );
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    async function loadProperties() {
      try {
        const [response, savedResponse] = await Promise.all([
          getApprovedProperties<PropertiesResponse>(),
          getSavedProperties<SavedPropertiesResponse>(),
        ]);
        const allProperties = Array.isArray(response)
          ? response
          : response.properties;
        setProperties(allProperties);
        setSavedPropertyIds(new Set(getSavedPropertyIds(savedResponse)));
      } catch {
        setError("Unable to load properties.");
      } finally {
        setLoading(false);
      }
    }

    loadProperties();
  }, [token]);

  return { token, properties, savedPropertyIds, loading, error };
}

function getSavedPropertyIds(response: SavedPropertiesResponse): string[] {
  const savedProperties = Array.isArray(response)
    ? response
    : "properties" in response
      ? response.properties
      : "savedProperties" in response
        ? response.savedProperties
        : response.data;

  return savedProperties.flatMap((item) => {
    if (!item.propertyId) return [];

    return [
      typeof item.propertyId === "string" ? item.propertyId : item.propertyId._id,
    ];
  });
}
