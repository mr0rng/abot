import start from "./start";
import help from "./help";
import onInlineQuery from "./on-inline-query";
import onCallbackQuery from "./on-callback-query";
import onText from "./on-text";
import commandDemands from "./command-demands";

// order matters: first match does the processing
export default [start, help, commandDemands, onInlineQuery, onCallbackQuery, onText];