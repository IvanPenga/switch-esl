import { Server } from 'net';
import { EventEmitter } from 'events';
import ESL from './ESL';

class ESLServer extends EventEmitter {

  server = new Server();

  constructor() {
    super();
  }

  listen(port: number, host: string = '0.0.0.0') {
    return new Promise((resolve, reject) => {
      this.server.on('connection', (socket) => { 
        socket.once('data', (data) => {
          this.emit('connection', new ESL({ connection: socket } ));
        })
        socket.write('connect\n\n');
      });
      try {
        this.server.listen(port, host, () => { resolve(`Listening on ${host}:${port}...`); });
      }
      catch(error) {
        reject(error);
      }
    });
  }

  addEventListener(event: 'connection', fn: (esl: ESL) => void): void;

  addEventListener(event: string, cb: (esl: ESL) => void): void {
      this.addListener(event, cb);
  }

}

export default ESLServer;
