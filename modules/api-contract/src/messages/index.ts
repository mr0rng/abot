import { Message, User } from '@abot/model';

export interface ApiContractMessages {
  send: (message: Omit<Message, 'date'>) => Promise<MessageSendResponse>;
  notify: (message: MessageNotification) => Promise<void>;
  search: (request: MessagesSearchRequest) => Promise<Message[]>;
}

export type MessageSendResponse = { date: number };

export type MessagesSearchRequest = {
  demand: number;
  limit: number;
  offset: number;
};

export type MessageNotification = {
  demand: string;
  sender: string;
  payload: object;
  recipients: User[]
};
