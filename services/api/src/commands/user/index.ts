import get from './get';
import passwordCommands from './password';
import telegramCommands from './telegram';

export default [...passwordCommands, ...telegramCommands, get];
