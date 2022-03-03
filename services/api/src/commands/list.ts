import userPasswordSignUp from './user/password/sign-up';
import userPasswordSignIn from './user/password/sign-in';
import userGet from './user/get';
import demandsCreate from './demands/create';
import demandsUpdate from './demands/update';
import demandsNext from './demands/next';
import demandsClose from './demands/close';
import demandsGetActiveAsSender from './demands/get-active-as-sender';

export default [
  userPasswordSignUp,
  userPasswordSignIn,
  userGet,
  demandsCreate,
  demandsUpdate,
  demandsNext,
  demandsClose,
  demandsGetActiveAsSender,
];
