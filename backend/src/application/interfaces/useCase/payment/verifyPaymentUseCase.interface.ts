export interface IVerifyPaymentUseCase {
  execute(data: {
    signature: string;
    body: string | Buffer<ArrayBufferLike>;
  }): Promise<string>;
}
