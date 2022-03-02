export type Response<Payload> = {
    status: string,
    code: number,
    response: Payload,
}
