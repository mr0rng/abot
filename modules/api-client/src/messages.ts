import { MessageSendResponse, MessagesSearchRequest } from '@abot/api-contract/target/messages';
import { Message } from '@abot/model';

import APIClient from '.';

export default class APIClientMessages {
  constructor(public apiClient: APIClient) {}

  send(message: Omit<Message, 'date'>): Promise<MessageSendResponse> {
    throw new Error(`Method not implemented: ${message}`);
  }

  search(request: MessagesSearchRequest): Promise<Message[]> {
    throw new Error(`Method not implemented: ${request}`);
  }
}
