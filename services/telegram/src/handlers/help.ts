import { Handler } from "../handler";

const helpMessage = 
`This bot connects those who need with those who can provide.

If you are in need, search for support by typing the bot's @username
in the chat followed by a query and select what kind of help you need.
Then click “Create demand” and describe it. Your request will be 
recorded and someone who can provide will reach out to you via our bot.
You can chat about that request via the bot. You can /close your 
request once it is fulfiled or no longer needed.

If you can provide any help, please message to the admins to register that.
Then, use command /next to assign the next request to you and coordinate
with the person in need.`;

export default new Handler(
  'help',
  ctx => {
    ctx.reply(helpMessage);
  }
);
