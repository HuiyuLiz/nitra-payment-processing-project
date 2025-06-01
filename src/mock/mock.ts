export interface Organization {
  id: number;
  name: string;
  totalProcessingFeeFixed: number;
  totalProcessingFeePercentage: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Payment {
  id: number;
  label: string;
  readerId: string;
  status: string;
  locationId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Location {
  id: number;
  name: string;
  taxRate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// Organization
export const organization: Organization[] = [
  {
    id: 4,
    name: "Nitra Clinic",
    totalProcessingFeeFixed: 10,
    totalProcessingFeePercentage: "0.03500",
    createdAt: "2024-01-01T12:00:00Z",
    updatedAt: "2024-01-01T12:00:00Z",
    deletedAt: null,
  },
];

// Locations
export const locations: Location[] = [
  {
    id: 48,
    name: "New York Clinic",
    taxRate: "0.04500",
    createdAt: "2024-01-15T12:00:00Z",
    updatedAt: "2024-01-15T12:00:00Z",
    deletedAt: null,
  },
  {
    id: 75,
    name: "Los Angeles Clinic",
    taxRate: "0.04500",
    createdAt: "2024-03-08T12:00:00Z",
    updatedAt: "2024-03-08T12:00:00Z",
    deletedAt: null,
  },
];

// Payment Location Readers
export const payments = [
  {
    id: 23,
    label: "Device Reader 01",
    readerId: "tmr_00000001582624",
    status: "online",
    locationId: 48,
    createdAt: "2024-01-20T12:00:00Z",
    updatedAt: "2024-01-20T12:00:00Z",
    deletedAt: null,
  },
  {
    id: 27,
    label: "Device Reader 02",
    readerId: "tmr_00000001582658",
    status: "offline",
    locationId: 48,
    createdAt: "2024-02-13T12:00:00Z",
    updatedAt: "2024-02-13T12:00:00Z",
    deletedAt: null,
  },
  {
    id: 35,
    label: "Device Reader 03",
    readerId: "tmr_00000001582824",
    status: "online",
    locationId: 48,
    createdAt: "2024-02-21T12:00:00Z",
    updatedAt: "2024-02-21T12:00:00Z",
    deletedAt: null,
  },
  {
    id: 58,
    label: "Device Reader 01",
    readerId: "tmr_00000001604824",
    status: "online",
    locationId: 75,
    createdAt: "2024-03-13T12:00:00Z",
    updatedAt: "2024-03-13T12:00:00Z",
    deletedAt: null,
  },
  {
    id: 63,
    label: "Device Reader 04",
    readerId: "tmr_00000001604858",
    status: "online",
    locationId: 48,
    createdAt: "2024-03-18T12:00:00Z",
    updatedAt: "2024-03-18T12:00:00Z",
    deletedAt: null,
  },
  {
    id: 71,
    label: "Device Reader 02",
    readerId: "tmr_00000001630824",
    status: "online",
    locationId: 75,
    createdAt: "2024-03-25T12:00:00Z",
    updatedAt: "2024-03-25T12:00:00Z",
    deletedAt: null,
  },
];
