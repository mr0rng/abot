import { Message, User, WithSessionUser } from '@abot/model';

export interface ApiContractMessages {
  send: (message: MessageSendRequest) => Promise<MessageSendResponse>;
  search: (request: MessagesSearchRequest) => Promise<Message[]>;
  notify: (request: MessageNotification) => Promise<void>;
}

export type MessageSendRequest = Omit<Message, 'id' | 'date' | 'author'> & WithSessionUser;
export type MessageSendResponse = { id: string; date: number };

export type MessagesSearchRequest = {
  demand: string;
  lastSeenId?: string;
  limit: number;
  order?: number;
} & WithSessionUser;

export type MessageNotification = {
  demand: string;
  sender: string;
  payload: object;
  recipients: User[];
};
