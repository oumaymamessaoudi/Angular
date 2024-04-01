import { Injectable } from '@angular/core';
declare var gapi: any;
declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleCalendarService {
  private CLIENT_ID =
  "61002360330-0uif4cvl0cbe5io343f9pl8psqrpgqhj.apps.googleusercontent.com";
  private API_KEY = "AIzaSyD_wbsmxVzkbTUC0WF7CKjUCtWPBgu5gIM";
  private DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
  private SCOPES = "https://www.googleapis.com/auth/calendar";
private tokenClient;
private gapiInited = false;
private gisInited = false;
  constructor() { }
  async initializeGapiClient() {
    try {
      await gapi.client.init({
        apiKey: this.API_KEY,
        discoveryDocs: [this.DISCOVERY_DOC],
      });
      this.gapiInited = true;
    } catch (error) {
      console.error('Error initializing Google API client:', error);
    }
  }
  async createGoogleEvent(eventDetails, location: string) {
    try {
      if (!this.gapiInited) {
        console.error('Google API client not initialized.');
        return;
      }
  
      if (!this.tokenClient) {
        console.error('Token client not initialized.');
        return;
      }
  
      this.tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
          throw resp;
        }
        await this.scheduleEvent(eventDetails, location); // Pass both arguments
      };
  
      if (gapi.client.getToken() === null) {
        await this.tokenClient.requestAccessToken({ prompt: 'consent' });
      } else {
        await this.tokenClient.requestAccessToken({ prompt: '' });
      }
    } catch (error) {
      console.error('Error creating Google event:', error);
    }
  }
  gisLoaded() {
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: this.CLIENT_ID,
      scope: this.SCOPES,
      callback: "", // defined later
    });
    this.gisInited = true;
  }

  async scheduleEvent(eventDetails, location: string) {
    const event = {
      summary: "Google I/O 2015",
      location: location,
      description: "A chance to hear more about Google's developer products.",
      start: {
        dateTime: eventDetails.startTime,
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: eventDetails.endTime,
        timeZone: "America/Los_Angeles",
      },
      recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
      attendees: [{ email: eventDetails.email }],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 10 },
        ],
      },
    };
    const request = gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });
    request.execute(function (event) {
      console.info("Event created: " + event.htmlLink);
    });
  }

}
