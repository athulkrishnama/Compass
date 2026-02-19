export interface CancellationPolicyTier {
  minHours: number;
  maxHours: number | null;
  refundPercentage: number;
}

export const CANCELLATION_POLICY: CancellationPolicyTier[] = [
  { minHours: 48, maxHours: null, refundPercentage: 100 },
  { minHours: 24, maxHours: 48, refundPercentage: 50 },
  { minHours: 0, maxHours: 24, refundPercentage: 0 },
];

export function calculateRefundAmount(
  checkInDate: Date,
  totalAmount: number,
): { refundPercentage: number; refundAmount: number } {
  const now = new Date();
  const hoursUntilCheckIn =
    (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  for (const tier of CANCELLATION_POLICY) {
    if (
      hoursUntilCheckIn >= tier.minHours &&
      (tier.maxHours === null || hoursUntilCheckIn < tier.maxHours)
    ) {
      return {
        refundPercentage: tier.refundPercentage,
        refundAmount: Math.round((totalAmount * tier.refundPercentage) / 100),
      };
    }
  }

  return { refundPercentage: 0, refundAmount: 0 };
}
