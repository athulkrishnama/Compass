import { IPricingService } from "@application/interfaces/services/IPricingService";
import { inject, injectable } from "tsyringe";
import { IRoomVariantRepo } from "@application/interfaces/repository/roomVariant/roomVariant.repo.interface";
import { IHotelBookingRepo } from "@application/interfaces/repository/hotelBooking/hotelBooking.repo.interface";
import { ResourceNotFoundException } from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { eachDayOfInterval, startOfDay } from "date-fns";

@injectable()
export class PricingService implements IPricingService {
  constructor(
    @inject("IRoomVariantRepo")
    private readonly _roomVariantRepository: IRoomVariantRepo,
    @inject("IHotelBookingRepo")
    private readonly _hotelBookingRepository: IHotelBookingRepo,
  ) {}

  async calculateDynamicPrice(data: {
    roomVariantId: string;
    checkInDate: Date;
    checkOutDate: Date;
  }): Promise<{
    totalPrice: number;
    availableRooms: number;
    priceBreakdown: { date: Date; price: number }[];
  }> {
    const { roomVariantId, checkInDate, checkOutDate } = data;

    const roomVariant =
      await this._roomVariantRepository.findById(roomVariantId);

    if (!roomVariant) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.ROOM_VARIANT_NOT_FOUND,
      );
    }

    const bookings = await this._hotelBookingRepository.filterBooking({
      roomVariantId,
      beforeCheckInDate: checkOutDate,
      afterCheckOutDate: checkInDate,
    });

    const totalRooms = roomVariant.totalRooms;
    let minAvailableRooms = totalRooms;
    let totalPrice = 0;
    const priceBreakdown: { date: Date; price: number }[] = [];

    const days = eachDayOfInterval({
      start: startOfDay(checkInDate),
      end: startOfDay(new Date(checkOutDate.getTime() - 24 * 60 * 60 * 1000)),
    });

    for (const day of days) {
      const activeBookingsCount = bookings.filter((booking) => {
        const bookingStart = startOfDay(booking.checkinDate);
        const bookingEnd = startOfDay(booking.checkoutDate);

        return bookingStart <= day && bookingEnd > day;
      }).length;

      const occupancyRate = (activeBookingsCount / totalRooms) * 100;
      let dailyPrice = roomVariant.basePrice;

      if (occupancyRate >= 70) {
        dailyPrice += roomVariant.basePrice * 0.2;
      } else if (occupancyRate >= 30) {
        dailyPrice += roomVariant.basePrice * 0.1;
      }

      totalPrice += dailyPrice;
      priceBreakdown.push({ date: day, price: dailyPrice });

      const availableForDay = totalRooms - activeBookingsCount;
      if (availableForDay < minAvailableRooms) {
        minAvailableRooms = availableForDay;
      }
    }
    return {
      totalPrice,
      availableRooms: minAvailableRooms,
      priceBreakdown,
    };
  }
}
