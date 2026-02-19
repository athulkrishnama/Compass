import { InvalidOperationException } from "@application/constants/Exceptions";
import { IPaymentService } from "@application/interfaces/service/paymentService.interface";
import { env } from "@config/envConfig";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import Stripe from "stripe";

export class PaymentService implements IPaymentService {
  private _stripe: Stripe;

  constructor() {
    this._stripe = new Stripe(env.STRIPE_SECRET_KEY);
  }

  async createPaymentIntent(
    amount: number,
    metadata: Record<string, string>,
  ): Promise<{ paymentIntentId: string; clientSecret: string }> {
    try {
      const session = await this._stripe.paymentIntents.create({
        amount: amount * 100,
        currency: "inr",
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
        receipt_email: env.EMAIL,
      });
      if (!session.client_secret) {
        throw new InvalidOperationException(
          INTERNAL_ERROR_MESSAGES.PAYMENT_INTENT_CREATION_FAILED,
        );
      }
      return {
        paymentIntentId: session.id,
        clientSecret: session.client_secret,
      };
    } catch (error) {
      console.log(error);
      throw new InvalidOperationException(
        INTERNAL_ERROR_MESSAGES.PAYMENT_INTENT_CREATION_FAILED,
      );
    }
  }
  async confirmPayment(
    signature: string,
    body: string | Buffer<ArrayBufferLike>,
  ): Promise<{
    status: boolean;
    metadata?: Record<string, string>;
    paymentIntentId?: string;
  }> {
    try {
      const event = this._stripe.webhooks.constructEvent(
        body,
        signature,
        env.STRIPE_WEBHOOK_SECRET,
      );

      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const { metadata } = paymentIntent;
        if (!metadata) {
          throw new InvalidOperationException(
            INTERNAL_ERROR_MESSAGES.PAYMENT_INTENT_CREATION_FAILED,
          );
        }
        return {
          status: true,
          metadata,
          paymentIntentId: paymentIntent.id,
        };
      }
      return {
        status: false,
      };
    } catch (error) {
      console.log(error);
      throw new InvalidOperationException(
        INTERNAL_ERROR_MESSAGES.PAYMENT_INTENT_CREATION_FAILED,
      );
    }
  }

  async refundPayment(
    paymentIntentId: string,
    amount: number,
  ): Promise<{ refundId: string; status: string }> {
    try {
      const refund = await this._stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount * 100,
      });
      return {
        refundId: refund.id,
        status: refund.status || "unknown",
      };
    } catch (error) {
      console.log(error);
      throw new InvalidOperationException(
        INTERNAL_ERROR_MESSAGES.REFUND_FAILED,
      );
    }
  }
}
