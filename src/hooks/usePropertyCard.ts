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
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
  let savedProperties: SavedProperty[];

  if (Array.isArray(response)) {
    savedProperties = response;
  } else if ("properties" in response) {
    savedProperties = response.properties;
  } else if ("savedProperties" in response) {
    savedProperties = response.savedProperties;
  } else {
    savedProperties = response.data;
  }

  return savedProperties.flatMap((item) => {
    if (!item.propertyId) return [];

    return [
      typeof item.propertyId === "string" ? item.propertyId : item.propertyId._id,
    ];
  });
}
