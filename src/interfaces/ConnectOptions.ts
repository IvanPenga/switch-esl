interface ConnectOptions {
    host: string,
    port: number,
    password: string,
    reconnectOptions? : {
        reconnect?: Boolean,
        interval?: number,
        maxAttemtps?: number
    },
    log?: Boolean
}

export default ConnectOptions;