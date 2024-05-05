export interface NewsData {
    title: string;
    description: string;
    published_datetime_utc: string;
    source_url: string;
    photo_url?: string; // Le "?" rend la propriété facultative
    source_logo_url?: string;
  }
  