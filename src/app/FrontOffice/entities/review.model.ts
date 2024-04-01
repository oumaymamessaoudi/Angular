export interface Review {
    id?: number;
    comment: string;
    rating: number;
    doctorId?: number;
    elderlyId?: number;
    elderlyUsername?: string; // Add this property

  }