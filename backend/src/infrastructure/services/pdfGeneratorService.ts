// eslint-disable-next-line @typescript-eslint/no-require-imports
const PDFDocument = require("pdfkit-table");
import { injectable } from "tsyringe";
import { IPdfGeneratorService } from "@application/interfaces/service/pdfGenerator.service.interface";

@injectable()
export class PdfGeneratorService implements IPdfGeneratorService {
  generateHotelReportPdfBuffer(
    items: {
      index: number;
      bookingId: string;
      hotelName: string;
      roomVariantName: string;
      guestName: string;
      amount: number;
      bookingStatus: string;
      checkInDate?: string;
      checkOutDate?: string;
    }[],
    title: string,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          margin: 30,
          size: "A4",
          layout: "landscape",
        });
        const buffers: Buffer[] = [];
        doc.on("data", (chunk: Buffer) => buffers.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(buffers)));

        doc.fontSize(18).font("Helvetica-Bold").text(title, { align: "left" });
        doc.moveDown(0.5);
        doc
          .fontSize(10)
          .font("Helvetica")
          .fillColor("#6b7280")
          .text(`Generated on: ${new Date().toLocaleDateString()}`, {
            align: "left",
          });
        doc.moveDown(1.5);

        const table = {
          headers: [
            "#",
            "Booking ID",
            "Hotel",
            "Room",
            "Guest Name",
            "Amount",
            "Status",
            "Check-In",
          ],
          rows: items.map((item) => [
            item.index.toString(),
            item.bookingId,
            item.hotelName,
            item.roomVariantName,
            item.guestName,
            `Rs ${item.amount.toFixed(2)}`,
            item.bookingStatus,
            item.checkInDate
              ? new Date(item.checkInDate).toLocaleDateString()
              : "N/A",
          ]),
        };

        doc.table(table, {
          prepareHeader: () =>
            doc.font("Helvetica-Bold").fontSize(10).fillColor("#1a1a1a"),
          prepareRow: () => {
            doc.font("Helvetica").fontSize(9).fillColor("#1a1a1a");
          },
        });

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  generateCabReportPdfBuffer(
    items: {
      index: number;
      bookingId: string;
      driverName?: string;
      username: string;
      amount: number;
      status: string;
      date?: string;
    }[],
    title: string,
    includeDriver: boolean = false,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          margin: 30,
          size: "A4",
          layout: "landscape",
        });
        const buffers: Buffer[] = [];
        doc.on("data", (chunk: Buffer) => buffers.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(buffers)));

        doc.fontSize(18).font("Helvetica-Bold").text(title, { align: "left" });
        doc.moveDown(0.5);
        doc
          .fontSize(10)
          .font("Helvetica")
          .fillColor("#6b7280")
          .text(`Generated on: ${new Date().toLocaleDateString()}`, {
            align: "left",
          });
        doc.moveDown(1.5);

        const headers = [
          "#",
          "Ride ID",
          ...(includeDriver ? ["Driver"] : []),
          "Username",
          "Amount",
          "Status",
          "Date",
        ];

        const rows = items.map((item) => [
          item.index.toString(),
          item.bookingId,
          ...(includeDriver ? [item.driverName || "Unknown"] : []),
          item.username,
          `Rs ${item.amount.toFixed(2)}`,
          item.status,
          item.date ? new Date(item.date).toLocaleDateString() : "N/A",
        ]);

        const table = {
          headers: headers,
          rows: rows,
        };

        doc.table(table, {
          prepareHeader: () =>
            doc.font("Helvetica-Bold").fontSize(10).fillColor("#1a1a1a"),
          prepareRow: () => {
            doc.font("Helvetica").fontSize(9).fillColor("#1a1a1a");
          },
        });

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }
}
