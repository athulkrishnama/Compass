import type { IHotelWithRoomVariantDetails } from "@/types/api/responses/hotelSearchResponse";

export const HOTEL_SPREAD_RADIUS = 0.0018; // ~200 m

export function formatCoordinate(value: number, isLatitude: boolean): string {
    const direction = isLatitude
        ? value >= 0
            ? "N"
            : "S"
        : value >= 0
          ? "E"
          : "W";
    return `${Math.abs(value).toFixed(4)}° ${direction}`;
}

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

export function buildDestinationMarkerHTML(name: string): string {
    const safeName = escapeHtml(name);
    return `
<div style="
    display:flex;flex-direction:column;align-items:center;
    cursor:pointer;user-select:none;
    filter:drop-shadow(0 4px 12px rgba(0,0,0,0.28));
">
    <div style="
        background:white;border-radius:20px;padding:4px 12px;
        font-size:13px;font-weight:700;color:#111;
        white-space:nowrap;max-width:200px;overflow:hidden;text-overflow:ellipsis;
        font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Inter',sans-serif;
        margin-bottom:6px;box-shadow:0 2px 10px rgba(0,0,0,0.18);letter-spacing:-0.01em;
    ">${safeName}</div>
    <svg width="36" height="50" viewBox="0 0 36 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 0C8.059 0 0 8.059 0 18C0 31.5 18 50 18 50C18 50 36 31.5 36 18C36 8.059 27.941 0 18 0Z" fill="#FF4545"/>
        <circle cx="18" cy="18" r="9" fill="white"/>
        <circle cx="18" cy="18" r="4.5" fill="#FF4545"/>
    </svg>
</div>`;
}

export function buildHotelMarkerHTML(
    hotel: IHotelWithRoomVariantDetails
): string {
    const safeName = escapeHtml(hotel.name);
    const imgContent = hotel.coverImage
        ? `<img src="${hotel.coverImage}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;">`
        : `<div style="width:100%;height:100%;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 22v-7h18v7"/><path d="M3 15V7a2 2 0 012-2h14a2 2 0 012 2v8"/><path d="M8 22v-4h8v4"/>
            </svg>
           </div>`;

    return `
<div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;user-select:none;">
    <div style="
        background:rgba(255,255,255,0.96);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
        border-radius:20px;padding:3px 10px;font-size:11px;font-weight:600;color:#1a1a1a;
        white-space:nowrap;max-width:140px;overflow:hidden;text-overflow:ellipsis;
        font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Inter',sans-serif;
        box-shadow:0 2px 8px rgba(0,0,0,0.16);margin-bottom:5px;pointer-events:none;letter-spacing:-0.01em;
    ">${safeName}</div>
    <div style="
        width:50px;height:50px;border-radius:50%;overflow:hidden;
        border:3px solid white;box-shadow:0 4px 18px rgba(99,102,241,0.38),0 1px 4px rgba(0,0,0,0.15);
        background:#e0e7ff;flex-shrink:0;
    ">${imgContent}</div>
    <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg"
        style="margin-top:-1px;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.12))">
        <path d="M7 9L0 0H14L7 9Z" fill="white"/>
    </svg>
</div>`;
}

export function buildHotelPopupHTML(
    hotel: IHotelWithRoomVariantDetails
): string {
    const cheapestPrice =
        hotel.roomVariants && hotel.roomVariants.length > 0
            ? Math.min(...hotel.roomVariants.map((rv) => rv.price))
            : null;

    const priceRow =
        cheapestPrice !== null
            ? `<div style="display:flex;align-items:baseline;gap:3px;margin-top:6px;">
                   <span style="font-size:11px;color:#6b7280;">From</span>
                   <span style="font-size:15px;font-weight:700;color:#111;"> \u20B9${cheapestPrice.toLocaleString("en-IN")}</span>
                   <span style="font-size:11px;color:#6b7280;">/ night</span>
               </div>`
            : `<div style="font-size:11px;color:#6b7280;margin-top:6px;">Price on request</div>`;

    const imgBlock = hotel.coverImage
        ? `<div style="width:100%;height:110px;overflow:hidden;flex-shrink:0;">
               <img src="${hotel.coverImage}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;">
           </div>`
        : `<div style="width:100%;height:80px;background:linear-gradient(135deg,#e0e7ff,#c7d2fe);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                   <path d="M3 22v-7h18v7"/><path d="M3 15V7a2 2 0 012-2h14a2 2 0 012 2v8"/><path d="M8 22v-4h8v4"/>
               </svg>
           </div>`;

    return `
<a href="/traveler/hotel/${hotel.id}" style="
    display:block;width:224px;background:white;overflow:hidden;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Inter',sans-serif;
    text-decoration:none;color:inherit;cursor:pointer;
">
    ${imgBlock}
    <div style="padding:10px 12px 12px;">
        <div style="font-size:14px;font-weight:700;color:#111;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;letter-spacing:-0.01em;">${hotel.name}</div>
        <div style="font-size:11px;color:#6b7280;margin-top:2px;">
            \uD83D\uDCCD ${hotel.city}${hotel.country ? `, ${hotel.country}` : ""}
        </div>
        ${priceRow}
        <div style="margin-top:10px;padding-top:8px;border-top:1px solid #f3f4f6;
            font-size:11px;font-weight:600;color:#6366f1;display:flex;align-items:center;gap:4px;">
            View hotel
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 6H9.5M9.5 6L7 3.5M9.5 6L7 8.5" stroke="#6366f1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
    </div>
</a>`;
}
