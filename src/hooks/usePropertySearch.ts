"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getApprovedProperties,
  getSavedProperties,
  removeSavedProperty,
  saveProperty,
} from "@/services/propertyService";
import type { Property } from "@/types/property";

export type SortBy = "price" | "sqft" | "title";
export type SortOrder = "asc" | "desc";

export interface Filters {
  city: string;
  propertyType: string;
  bhk: string;
  minPrice: string;
  maxPrice: string;
  minSqft: string;
  maxSqft: string;
  amenities: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
}

export const initialFilters: Filters = {
  city: "",
  propertyType: "",
  bhk: "",
  minPrice: "",
  maxPrice: "",
  minSqft: "",
  maxSqft: "",
  amenities: "",
  sortBy: "price",
  sortOrder: "asc",
};

export const propertyTypes = [
  "Apartment",
  "Villa",
  "Independent House",
  "Plot",
  "Commercial",
];

type PropertiesResponse = Property[] | { properties: Property[] };
type SavedProperty = { propertyId?: string | { _id: string } };
type SavedPropertiesResponse =
  | SavedProperty[]
  | { properties: SavedProperty[] }
  | { savedProperties: SavedProperty[] }
  | { data: SavedProperty[] };

function toNumber(value: string) {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function getPropertyLocation(property: Property) {
  return (
    property.location ??
    property.fullAddress ??
    [property.address, property.area, property.city].filter(Boolean).join(", ")
  );
}

function filterProperties(properties: Property[], filters: Filters) {
  const city = filters.city.trim().toLowerCase();
  const amenities = filters.amenities
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  const minPrice = toNumber(filters.minPrice);
  const maxPrice = toNumber(filters.maxPrice);
  const minSqft = toNumber(filters.minSqft);
  const maxSqft = toNumber(filters.maxSqft);
  const bhk = toNumber(filters.bhk);

  return properties
    .filter((property) => {
      const propertyCity = [
        property.city,
        property.location,
        property.fullAddress,
        property.address,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const propertyType = (property.propertyType ?? "").toLowerCase();
      const propertyAmenities = (property.amenities ?? []).map((item) =>
        item.toLowerCase(),
      );
      const propertyBhk = Number(property.bhk);
      const propertyPrice = Number(property.price);
      const propertySqft = Number(property.sqft ?? property.area ?? 0);
      return (
        (!city || propertyCity.includes(city)) &&
        (!filters.propertyType || propertyType === filters.propertyType.toLowerCase()) &&
        (bhk === undefined || propertyBhk === bhk) &&
        (minPrice === undefined || propertyPrice >= minPrice) &&
        (maxPrice === undefined || propertyPrice <= maxPrice) &&
        (minSqft === undefined || propertySqft >= minSqft) &&
        (maxSqft === undefined || propertySqft <= maxSqft) &&
        amenities.every((required) =>
          propertyAmenities.some((available) => available.includes(required)),
        )
      );
    })
    .sort((first, second) => {
      const firstValue = getSortValue(first, filters.sortBy);
      const secondValue = getSortValue(second, filters.sortBy);
      const comparison = firstValue < secondValue ? -1 : firstValue > secondValue ? 1 : 0;
      return filters.sortOrder === "asc" ? comparison : -comparison;
    });
}

function getSortValue(property: Property, sortBy: SortBy) {
  if (sortBy === "title") {
    return property.title.toLowerCase();
  }

  if (sortBy === "sqft") {
    return property.sqft ?? property.area ?? 0;
  }

  return Number(property.price);
}

function extractSavedIds(response: SavedPropertiesResponse): string[] {
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
    return [typeof item.propertyId === "string" ? item.propertyId : item.propertyId._id];
  });
}

export function usePropertySearch() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [savedPropertyIds, setSavedPropertyIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [response, savedResponse] = await Promise.all([
          getApprovedProperties<PropertiesResponse>(),
          getSavedProperties<SavedPropertiesResponse>(),
        ]);
        if (cancelled) return;
        setProperties(Array.isArray(response) ? response : response.properties);
        setSavedPropertyIds(new Set(extractSavedIds(savedResponse)));
      } catch {
        if (!cancelled) setError("Unable to load properties.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateFilter = <Key extends keyof Filters>(key: Key, value: Filters[Key]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };

  const applyFilters = () => setAppliedFilters({ ...filters });
  const filteredProperties = useMemo(
    () => filterProperties(properties, appliedFilters),
    [properties, appliedFilters],
  );

  const toggleSavedProperty = async (propertyId: string) => {
    const isSaved = savedPropertyIds.has(propertyId);
    if (isSaved) {
      await removeSavedProperty(propertyId);
      setSavedPropertyIds((current) => {
        const next = new Set(current);
        next.delete(propertyId);
        return next;
      });
      return;
    }
    await saveProperty(propertyId);
    setSavedPropertyIds((current) => new Set(current).add(propertyId));
  };

  return {
    loading,
    error,
    filters,
    updateFilter,
    resetFilters,
    filteredProperties,
    applyFilters,
    savedPropertyIds,
    toggleSavedProperty,
  };
}