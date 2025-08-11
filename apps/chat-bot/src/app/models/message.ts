export interface Message {
  sender: string;
  text: string;
  date: Date;
  isBot?: boolean;
}

export type AnswerTypeKey = 'definition' | 'usage' | 'general';

export interface AnswerTypes {
  definition?: string[];
  usage?: string[];
  general?: string[];
}

export interface AnswersMap {
  [keyword: string]: AnswerTypes;
}