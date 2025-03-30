import { nanoid } from "nanoid";

/**

 * @returns 
 */
export function generateMeetingId(): string {
  return nanoid(10);
}

export function generateMeetingUrl(): string {
  const meetingId = generateMeetingId();

  return `https://meet.jit.si/SmileMatch-${meetingId}`;
}

/**
 *
 * @param url
 * @returns
 */
export function isValidMeetingUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}
