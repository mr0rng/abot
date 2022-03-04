import { MessageSendResponse, MessagesSearchRequest } from "@abot/api-contract/target/messages";
import { Message } from '@abot/model';
import { Response } from "@abot/api-contract/src/response";

import APIClient from '.'

export default class APIClientMessages {
  constructor (
    public apiClient: APIClient
  ) { }

  send (message: Omit<Message, "date">): Promise<Response<MessageSendResponse>> {
    throw new Error(`Method not implemented: ${message}`)
  }

  search (request: MessagesSearchRequest): Promise<Response<Message[]>> {
    throw new Error(`Method not implemented: ${request}`)
  }
}