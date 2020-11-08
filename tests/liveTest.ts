import EventParser from '../src/parsers/EventParser';
import ESLBuffer from '../src/ESLBuffer';
import ESL from '../src/ESL';

import Events from './data/events';
import { stream } from './data/stream';
import { siptrace } from './data/siptrace';
import SipParser from '../src/parsers/SipParser';

import { expect } from 'chai';
import { getRandomChunks } from './utils';
import { ConnectionState } from '../src/enums';

const eventParser = new EventParser();
const buffer = new ESLBuffer();

describe('Live Freeswitch Test', () => {
    it('Basic Connect Disconnect', async () => {
        const esl = new ESL({ 
            connection: { host: '127.0.0.1', port: 8021 },
            password: 'ClueCon'
        });
        const connectionResult = await esl.connect();
        expect(connectionResult).to.includes('+OK');

        esl.send('api status')
            .then(result => {
                expect(result).to.not.be.undefined;
                expect(result).to.not.be.null;
                expect(result).to.be.a('string');
                expect(result).to.not.includes('-ERR');
            })
            
        const disconnectionResult = await esl.disconnect();
        expect(disconnectionResult).to.includes('+OK');

        esl.send('api status')
            .catch(err => { expect(err).to.includes('Connection is closed'); })

    });
});