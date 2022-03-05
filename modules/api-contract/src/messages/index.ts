import { Message } from '@abot/model';

export interface ApiContractMessages {
  send: (message: Omit<Message, 'date'>) => Promise<MessageSendResponse>;
  search: (request: MessagesSearchRequest) => Promise<Message[]>;
}

export type MessageSendResponse = { date: number };

export type MessagesSearchRequest = {
  demand: number;
  limit: number;
  offset: number;
};
