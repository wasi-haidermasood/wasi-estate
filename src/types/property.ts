// src/types/property.ts
export interface Property {
  _id?: string;           // Mongo ID (for detail route)
  id: string | number;    // existing custom ID or fallback
  title: string;
  location: string;
  price: string;
  beds?: number;
  baths?: number;
  area?: string;
  type: string;
  image: string;
}