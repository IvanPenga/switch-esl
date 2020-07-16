import { Socket } from 'net';
import { ConnectOptions } from './interfaces';
import { ConnectionState } from './enums';

class Connection {

    socket: Socket = new Socket();
    connectionState: ConnectionState = ConnectionState.Closed;
    connectOptions: ConnectOptions;
    logger: any;

    currentPromise: { resolve: ( result: string ) => void, reject: (result: string) => void } | undefined;

    constructor(connectOptions: ConnectOptions, logger: any) {
        if (connectOptions.connection instanceof Socket) {
            this.socket = connectOptions.connection;
            this.connectionState = ConnectionState.Connected;
        }

        this.connectOptions = connectOptions;
        
        this.logger = logger;
        this.setSocketListeners();
    }

    setSocketListeners(): void {
        this.socket.on('connect', () => {
            this.connectionState = ConnectionState.Authenticating;
            this.logger('Socket connected');
            if (this.currentPromise) this.currentPromise.resolve('Connected');
        });

        this.socket.on('end', () => {
            this.connectionState = ConnectionState.Closed;
            this.logger('Socket end');
            if (this.currentPromise) this.currentPromise.reject('Unable to connect. Socket end.');
        });

        this.socket.on('error', () => {
            this.connectionState = ConnectionState.Closed;
            this.logger(`Socket error.`);
            if (this.currentPromise) this.currentPromise.reject('Unable to connect. Socket error.');
        });
        this.socket.on('close', () => {
            this.connectionState = ConnectionState.Closed;
            this.logger(`Socket closed.`);
            if (this.currentPromise) this.currentPromise.reject('Unable to connect. Socket close.');
        });
    }

    socketDataProvided(socket: Socket): boolean {
        if (socket.remotePort && socket.remoteAddress && socket.localPort  && socket.localAddress) return true;
        return false;
    }

    connect(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.connectionState = ConnectionState.Connecting;
            if (this.connectOptions.connection instanceof Socket) {
                this.socketDataProvided(this.connectOptions.connection) ?
                    resolve('Already connected') : reject('Refuse to connect Socket. Please provide host and port instead');
            }
            else {
                this.currentPromise = { resolve, reject };
                this.socket.connect(this.connectOptions.connection);
            }
        });
    }

    send(command: string): void {
        if (this.isOpen()) {
            this.socket.write(command);
            this.socket.write('\n');
            this.socket.write('\n');
        }
    }

    isOpen(): boolean {
        return this.connectionState === ConnectionState.Connected || 
               this.connectionState === ConnectionState.Authenticating;
    }

}

export default Connection;