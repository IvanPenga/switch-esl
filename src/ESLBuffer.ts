import { ESLResponse } from './interfaces';

class ESLBuffer {

    buffer: Buffer;
    chunks: Buffer[] = [];
    chunksTotalLength: number = 0;

    constructor(){
        this.buffer = Buffer.alloc(0);
    }

    empty() {
        this.buffer = Buffer.alloc(0);
    }
    
    getResponses(data: Buffer){

        this.chunks.push(data);
        this.chunksTotalLength += data.length;

        if (data.indexOf('\n\n') === -1) return [];
        this.buffer = Buffer.concat([this.buffer, ...this.chunks], this.chunksTotalLength + this.buffer.length);

        this.chunks = [];
        this.chunksTotalLength = 0;

        const responses = [];
        let response = this.getNextResponse();
        while (response) {
            responses.push(response);
            response = this.getNextResponse();
        }
        return responses;
    }
    
    parseBuffer(buffer: Buffer) {

        const endOfResponse = buffer.indexOf('\n\n');
        if (endOfResponse === -1) {
            return undefined;
        }

        const rawHeaders = buffer.slice(0, endOfResponse).toString();

        const response: ESLResponse = {  
            headers: { 
                ['Content-Length']: 0, 
                ['Content-Type']: ''
            }, 
            body: '', 
            length: rawHeaders.length + 2, 
            buffering: false
        };

        if (rawHeaders.length) {
            rawHeaders.split('\n').forEach(header => {
                const index = header.indexOf(': ');
                response.headers[header.slice(0, index)] = header.slice(index + 2);
            });
            if (response.headers['Content-Length']) {
                const body = buffer.slice(endOfResponse + 2).toString();

                if (response.headers['Content-Length'] <= body.length) {
                    response.body = body.slice(0, response.headers['Content-Length']);
                    response.length += response.body.length;
                }
                else {
                    response.buffering = true;
                }
            }
        }
        return response;
    }

    getNextResponse() {
        const response = this.parseBuffer(this.buffer);
        if (response && response.length > 2 && !response.buffering) {
            this.buffer = this.buffer.slice(response.length);
            return response;
        } 
    }

}

export default ESLBuffer;