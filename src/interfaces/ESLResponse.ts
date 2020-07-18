interface ESLResponse {
    headers: { 
        ['Content-Length']: number, 
        ['Content-Type']  : string, 
        [key: string]     : any
    },
    body: string,
    length: number,
    buffering: boolean
}

export default ESLResponse;