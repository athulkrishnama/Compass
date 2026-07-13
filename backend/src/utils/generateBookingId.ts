import crypto from "crypto";

export function generateBookingId(
  hotelName: string,
  roomVariantName: string,
): string {
  const hPrefix = hotelName
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 3)
    .toUpperCase()
    .padEnd(3, "X");

  const rPrefix = roomVariantName
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 2)
    .toUpperCase()
    .padEnd(2, "X");

  const timestampPart = Date.now().toString().slice(-4);
  const randomPart = crypto.randomInt(1000, 9999).toString();

  return `BK${hPrefix}${rPrefix}${timestampPart}${randomPart}`;
}
