import EventParser from '../src/EventParser';
import ESLBuffer from '../src/ESLBuffer';
import ESL from '../src/ESL';

import Events from './data/events';
import { stream } from './data/stream';
import { expect, assert } from 'chai';
import { getRandomChunks, getRandomNumber } from './utils';
import { ConnectionState } from '../src/enums';

const eventParser = new EventParser();
const buffer = new ESLBuffer();
const esl = new ESL({ connection: { host:'',port:8021 }});

describe('Event Parser', () => {
    it('Parse Response', () => {
        const goodJson = eventParser.parseResponse(Events.goodJson);
        const badJson = eventParser.parseResponse(Events.badJson);
        const badNoBodyJson = eventParser.parseResponse(Events.badNoBodyJson);
        const goodPlain = eventParser.parseResponse(Events.goodPlain);
        const badPlain = eventParser.parseResponse(Events.badPlain);
        const badUnknownHeader = eventParser.parseResponse(Events.badUnknownHeader);
    })
    it('Parse ESL stream', () => {
        const responses = buffer.getResponses(Buffer.alloc(stream.length, stream));
        expect(responses.length).to.equal(20);
    })
    it('ESL on Data stream', () => {
        const randomChunks = getRandomChunks(stream);
        expect(randomChunks.join('')).to.equal(stream);

        let answerCount = 0;
        let destroyCount = 0;

        esl.on('CHANNEL_ANSWER', (event) => {
            expect(event['Event-Name']).to.equal('CHANNEL_ANSWER');
            answerCount++;
        });

        esl.on('CHANNEL_DESTROY', (event) => {
            expect(event['Event-Name']).to.equal('CHANNEL_DESTROY');
            destroyCount++;
        });

        randomChunks.forEach(chunk => {
            esl.onData(Buffer.alloc(chunk.length, chunk));
        });

        setImmediate(() => {
            expect(answerCount).to.equal(2, 'Answer channels count shoud be 2');
            expect(destroyCount).to.equal(4,'Destroy channels count should be 4');
        })
    })
    it('API on Data stream', () => {
        esl.connection.connectionState = ConnectionState.Connected;

        const randomChunks = getRandomChunks(stream);
        expect(randomChunks.join('')).to.equal(stream);

        esl.api('auth ClueCon').then(result => {
            expect(result).to.equal('+OK accepted');
        });

        esl.addEventListener('CHANNEL_ANSWER', () => {});
        esl.addEventListener('CHANNEL_ANSWER', () => {});
        esl.addEventListener('CHANNEL_ANSWER', () => {});
        esl.addLogListener('console', () => {});

        esl.api('status').then(result => {
            expect(result).to.equal('0 total.');
        });
        
        randomChunks.forEach(chunk => {
            esl.onData(Buffer.alloc(chunk.length, chunk));
        });
    })
});