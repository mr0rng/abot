import { Handler } from '../handler';
import commandDemands from './command-demands';
import commandNext from './command-next';
import help from './help';
import onCallbackQuery from './on-callback-query';
import onInlineQuery from './on-inline-query';
import onText from './on-text';
import start from './start';

// order matters: first match does the processing
export default [start, help, commandDemands, commandNext, onInlineQuery, onCallbackQuery, onText];
