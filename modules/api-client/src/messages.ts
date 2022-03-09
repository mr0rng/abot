import { ApiContractMessages, MessageSendResponse, MessagesSearchRequest } from '@abot/api-contract/target/messages';
import { Message } from '@abot/model';

import APIClient from '.';

export default class APIClientMessages implements ApiContractMessages {
  constructor(public apiClient: APIClient) {}

  send(message: Omit<Message, 'date'>): Promise<MessageSendResponse> {
    return this.apiClient.execute('messages.send', message);
  }

  search(request: MessagesSearchRequest): Promise<Message[]> {
    throw new Error(`Method not implemented: ${request}`);
  }
}
