import { MessageNotification } from '@abot/api-contract/target/messages';

import { Command } from '..';
import Application from '../../app';

export default new Command<MessageNotification, void>(
  'messages.notify',
  async (app: Application, request: MessageNotification): Promise<void> => {
    return;
  },
  {
    type: 'object',
    properties: {
      demand: { type: 'string' },
      sender: { type: 'string' },
      recipients: {
        type: 'array',
        items: { type: 'string' },
      },
      payload: { type: 'object' },
    },
    required: ['demand', 'sender', 'recipients', 'payload'],
    additionalProperties: false,
  },
);
