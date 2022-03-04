export type User = {
  id: string,
  login: string,
  type: string,
  passwordHash: string,
  isAdmin: boolean,
  isBanned: boolean,
  payload: object
};

export type Scenario = {
  id: string,
  description: string,
  isDeleted: boolean,
  payload: object,
};

export type Demand = {
  id: string,
  date: string,
  scenario: string, 
  recipient: string, 
  sender: string, 
  isActive: boolean, 
  payload: object 
};

export type Message = { 
  date: number, 
  demand: number, 
  author: string, 
  type: string, 
  payload: string 
};

export type Decline = {
  sender: string,
  demand: string,
}