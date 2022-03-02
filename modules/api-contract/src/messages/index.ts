export type ApiContractMessages = {
  send: (message: Omit<Message, "date">) => Promise<MessageSendResponse>,
  search: (request: MessagesSearchRequest) => Promise<Message[]>
};

export type Message = { 
  date: number,
  demand: number,
  author: string,
  type: string,
  payload: object
};

export type MessageSendResponse = { date: number };

export type MessagesSearchRequest = { 
  demand: number,
  limit: number,
  offset: number
};

export type DemandsCreateResponse = { date: number };
