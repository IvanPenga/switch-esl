interface ESLResponse {
    //headers: { [key: string]: string | number },
    headers: { ['Content-Length']: number, ['Content-Type']: string, [key: string]: any }
    body: string,
    length: number,
    buffering: Boolean
}

export default ESLResponse;