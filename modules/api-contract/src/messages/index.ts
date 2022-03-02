import { Message } from '@abot/model'
import { Response } from "../response";

export type ApiContractMessages = {
  send: (message: Omit<Message, "date">) => Promise<Response<MessageSendResponse>>,
  search: (request: MessagesSearchRequest) => Promise<Response<Message[]>>
};

export type MessageSendResponse = { date: number };

export type MessagesSearchRequest = { 
  demand: number,
  limit: number,
  offset: number
};