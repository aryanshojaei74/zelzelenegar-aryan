import webpush from "web-push";

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const contact = process.env.VAPID_CONTACT_EMAIL || "mailto:alerts@example.com";

export function isPushConfigured(): boolean {
  return Boolean(publicKey && privateKey);
}

export function getWebPush(): typeof webpush {
  if (!publicKey || !privateKey) {
    throw new Error("VAPID keys are not configured");
  }
  webpush.setVapidDetails(contact, publicKey, privateKey);
  return webpush;
}
