// event.model.ts
export interface Event {
    eventID: number;
    name: string;
    description: string;
    imageUrl: string;
    capacity: number;
    date: string;
    place: string;
    ticketprice: number;
    archiveevent: string;
    latitude: number;  // Add latitude property
    longitude: number;
     // Add longitude property
}
