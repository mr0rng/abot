export interface ApiContractUserPassword {
  signUp: (request: PasswordSignUpInRequest) => Promise<PasswordSignUpInResponse>;
  signIn: (request: PasswordSignUpInRequest) => Promise<PasswordSignUpInResponse>;
}

export type PasswordSignUpInRequest = {
  login: string;
  passwordHash: string;
};

export type PasswordSignUpInResponse = {
  session: string;
};
