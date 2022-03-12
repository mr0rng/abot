import { Message, User, WithSessionUser } from '@abot/model';

export interface ApiContractMessages {
  send: (message: MessageSendRequest) => Promise<MessageSendResponse>;
  search: (request: MessagesSearchRequest) => Promise<Message[]>;
}

export type MessageSendRequest = Omit<Message, 'id' | 'date' | 'author'> & WithSessionUser;
export type MessageSendResponse = { id: string; date: number };

export type MessagesSearchRequest = {
  demand: string;
  fromDate?: number;
  limit: number;
  offset: number;
} & WithSessionUser;

export type MessageNotification = {
  demand: string;
  sender: string;
  payload: object;
  recipients: User[]
};
