import { Server } from 'net';
import { EventEmitter } from 'events';
import ESL from './ESL';
import { ConnectOptions } from './interfaces';

class ESLCluster extends EventEmitter {

  connectOptions: ConnectOptions[];
  eslCluster: ESL[];

  constructor(connectOptions: ConnectOptions[]) {
    super();

    this.eslCluster = this.createESLCluster(connectOptions);
    this.connectOptions = connectOptions;
  }

  private createESLCluster(connectOptions: ConnectOptions[]) {
    return connectOptions.map(connectOption => {
      return new ESL(connectOption); 
    });
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.eslCluster.forEach(eslInstance => {
        eslInstance.connect()
          .then(() =>  { resolve() })
          .catch(() => { reject() })
      });
    })
  }



}

export default ESLCluster;
