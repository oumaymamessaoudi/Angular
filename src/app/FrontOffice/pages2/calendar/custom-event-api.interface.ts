import { EventApi } from '@fullcalendar/core';

export interface CustomEventApi extends EventApi {
  status: string;
}