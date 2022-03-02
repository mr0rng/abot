import Ajv, { JSONSchemaType, ValidateFunction } from 'ajv';

import Application from '../app';

export class Command<Request, Response> {
  private static ajv = new Ajv();
  private requestValidate: ValidateFunction;

  constructor (
    public path: string, 
    public callback: CommandCallback<Request, Response>,
    private schema: JSONSchemaType<Request>
  ) { 
    this.requestValidate = Command.ajv.compile(schema);
  }

  async execute(app: Application, request: unknown): Promise<Response> {
    if (!this.requestValidate(request)) {
      throw ApplicationError.request(`Invalid request.\nschema = ${JSON.stringify(this.schema, null, 2)}`)
    }

    return this.callback(app, request as Request);
  }
}

export class ApplicationError extends Error {
  public static request = (message: string): ApplicationError => new ApplicationError(400, message)

  public isApplicationError = true;

  constructor (
    public code: number, 
    message: string
  ) {
    super(message);
  }
}

export type CommandCallback<Request, Response> = (app: Application, request: Request) => Promise<Response>;