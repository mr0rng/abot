import { MessageSendRequest, MessageSendResponse, MessagesSearchRequest } from '@abot/api-contract/target/messages';
import { Message } from '@abot/model';

import APIClient from '.';

export default class APIClientMessages {
  constructor(public apiClient: APIClient) {}

  send(request: MessageSendRequest): Promise<MessageSendResponse> {
    return this.apiClient.execute('messages.send', request);
  }

  search(request: MessagesSearchRequest): Promise<Message[]> {
    return this.apiClient.execute('messages.search', request);
  }
}
