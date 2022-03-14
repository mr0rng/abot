import { Context } from 'telegraf';
import { MaybeArray } from 'telegraf/typings/composer';
import * as tt from 'telegraf/typings/telegram-types';

import Bot from './bot';

export declare type HandlerCallback = (ctx: Context, bot: Bot, next: () => Promise<void>) => void;

export class Handler {
  constructor(public method: 'start' | 'help' | 'on' | 'command', public callback: HandlerCallback) {}
}

export class OnHandler extends Handler {
  constructor(method: 'on', public event: MaybeArray<tt.UpdateType | tt.MessageSubType>, callback: HandlerCallback) {
    super(method, callback);
  }
}

export class CommandHandler extends Handler {
  constructor(method: 'command', public command: string, callback: HandlerCallback) {
    super(method, callback);
  }
}

// export declare type Handler = BaseHandler | OnHandler | CommandHandler;

// export declare type BaseHandler = {
//   method: 'start' | 'help';
//   callback: HandlerCallback
// };

// export declare type OnHandler = BaseHandler & {
//   method: 'on';
//   event: string;
// };

// export declare type CommandHandler = BaseHandler & {
//   method: 'command';
//   command: string;
// };
