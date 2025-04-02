import { google } from "googleapis";

async function getGoogleAuth(accessToken) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return auth;
}

// Create an event
async function createGoogleEvent(accessToken, task) {
  const auth = await getGoogleAuth(accessToken);
  const calendar = google.calendar({ version: "v3", auth });

  const event = {
    summary: task.title,
    description: `Category: ${task.category}, Priority: ${task.priority}`,
    start: { dateTime: new Date(task.deadline).toISOString(), timeZone: "UTC" },
    end: { dateTime: new Date(new Date(task.deadline).getTime() + task.duration * 60000).toISOString(), timeZone: "UTC" },
  };

  const createdEvent = await calendar.events.insert({
    calendarId: "primary",
    resource: event,
  });

  return createdEvent.data.id; // Store event ID for updates
}

// Update an event
async function updateGoogleEvent(accessToken, eventId, task) {
  const auth = await getGoogleAuth(accessToken);
  const calendar = google.calendar({ version: "v3", auth });

  const updatedEvent = {
    summary: task.title,
    description: `Updated: ${task.category}, Priority: ${task.priority}`,
    start: { dateTime: new Date(task.deadline).toISOString(), timeZone: "UTC" },
    end: { dateTime: new Date(new Date(task.deadline).getTime() + task.duration * 60000).toISOString(), timeZone: "UTC" },
  };

  await calendar.events.update({
    calendarId: "primary",
    eventId,
    resource: updatedEvent,
  });

  return { message: "Event updated successfully" };
}

// Export as default object
export default {
  createGoogleEvent,
  updateGoogleEvent,
};
