import { Context } from "telegraf";
import Bot from "./bot";

export type Handler = {
  method: 'start' | 'help';
  callback: HandlerCallback
};

export type OnHandler = Handler & {
  method: 'on';
  event: string;
};

export type CommandHandler = Handler & {
  method: 'command';
  command: string;
};

export type HandlerCallback = (ctx: Context, bot: Bot, next: () => Promise<void>) => void;
