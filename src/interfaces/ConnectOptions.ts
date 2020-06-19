import { Socket } from 'net';

interface ConnectOptions {
    connection: { host: string, port: number } | Socket,
    password?: string,
    reconnectOptions? : {
        reconnect?: boolean,
        interval?: number,
        maxAttemtps?: number
    },
    log?: boolean
}

export default ConnectOptions;