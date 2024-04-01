export class Ambulance {
    ambulanceID?: number;
    location: string = '';
    latitude?: number;
    longitude?: number;
    status: string = 'Available';
    imageAmbul?: string;
  
    constructor(
      location: string,
      latitude?: number,
      longitude?: number,
      status: string = 'Available',
      imageAmbul?: string
    ) {
      this.location = location;
      this.latitude = latitude;
      this.longitude = longitude;
      this.status = status;
      this.imageAmbul = imageAmbul;
    }
  }
  