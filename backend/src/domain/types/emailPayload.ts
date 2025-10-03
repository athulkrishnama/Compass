export interface EmailPayloadType {
  receiverMailid: string;
  subject: string;
  content: string;
  attachements?: string[];
}
