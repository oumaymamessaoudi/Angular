const CLIENT_ID =
  "61002360330-0uif4cvl0cbe5io343f9pl8psqrpgqhj.apps.googleusercontent.com";
const API_KEY = "AIzaSyD_wbsmxVzkbTUC0WF7CKjUCtWPBgu5gIM";
const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const SCOPES = "https://www.googleapis.com/auth/calendar";
let tokenClient;
let gapiInited = false;
let gisInited = false;
function gapiLoaded() {
  gapi.load("client", initializeGapiClient);
}
async function initializeGapiClient() {
  try {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
  } catch (error) {
    console.error('Error initializing Google API client:', error);
  }
}

async function createGoogleEvent(eventDetails) {
  try {
    if (!gapiInited) {
      console.error('Google API client not initialized.');
      return;
    }

    if (!tokenClient) {
      console.error('Token client not initialized.');
      return;
    }

    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw resp;
      }
      await scheduleEvent(eventDetails);
    };

    if (gapi.client.getToken() === null) {
      await tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      await tokenClient.requestAccessToken({ prompt: '' });
    }
  } catch (error) {
    console.error('Error creating Google event:', error);
  }
}

function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: "", // defined later
  });
  gisInited = true;
}

function scheduleEvent(eventDetails) {
  console.log('hi');
  const event = {
    summary:  " Appointment with " + eventDetails.name  ,
    location: "",
    description: "Please ensure to review " + eventDetails.name + " 's medical history and be prepared for the appointment.",
    start: {
      dateTime: eventDetails.startTime,
      timeZone: "America/Los_Angeles",
    },
    end: {
      dateTime: eventDetails.endTime,
      timeZone: "America/Los_Angeles",
    },
    
    recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
    attendees: [{ email: eventDetails.email }, "You have an appointment with " + eventDetails.name  ],
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
