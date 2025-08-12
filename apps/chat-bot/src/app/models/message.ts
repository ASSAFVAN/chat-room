export interface Message {
  sender: string;
  text: string;
  date: Date;
  isBot?: boolean;
}