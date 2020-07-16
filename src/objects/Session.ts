import { EventEmitter } from "events";
import * as events from "../events";

class Session extends EventEmitter {

    uuid: string;
    channelName: string;
    event: events.ChannelCreate;

    constructor(event: events.ChannelCreate) {
        super();

        this.uuid = event["Unique-ID"];
        this.channelName = event["Channel-Name"];

        this.event = event;
    }

    on(event: 'CHANNEL_ANSWER', fn: (event: events.ChannelAnswer) => void): this;
    on(event: 'CHANNEL_APPLICATION', fn: (event: events.ChannelApplication) => void): this;
    on(event: 'CHANNEL_BRIDGE', fn: (event: events.ChannelBridge) => void): this;
    on(event: 'CHANNEL_CALLSTATE', fn: (event: events.ChannelCallstate) => void): this;
    on(event: 'CHANNEL_CREATE', fn: (event: events.ChannelCreate) => void): this;
    on(event: 'CHANNEL_DATA', fn: (event: events.ChannelData) => void): this;
    on(event: 'CHANNEL_DESTROY', fn: (event: events.ChannelDestroy) => void): this;
    on(event: 'CHANNEL_EXECUTE', fn: (event: events.ChannelExecute) => void): this;
    on(event: 'CHANNEL_EXECUTE_COMPLETE', fn: (event: events.ChannelExecuteComplete) => void): this;
    on(event: 'CHANNEL_GLOBAL', fn: (event: events.ChannelGlobal) => void): this;
    on(event: 'CHANNEL_HANGUP', fn: (event: events.ChannelHangup) => void): this;
    on(event: 'CHANNEL_HANGUP_COMPLETE', fn: (event: events.ChannelHangupComplete) => void): this;
    on(event: 'CHANNEL_HOLD', fn: (event: events.ChannelHold) => void): this;
    on(event: 'CHANNEL_ORIGINATE', fn: (event: events.ChannelOriginate) => void): this;
    on(event: 'CHANNEL_OUTGOING', fn: (event: events.ChannelOutgoing) => void): this;
    on(event: 'CHANNEL_PARK', fn: (event: events.ChannelPark) => void): this;
    on(event: 'CHANNEL_PROGRESS', fn: (event: events.ChannelProgress) => void): this;
    on(event: 'CHANNEL_PROGRESS_MEDIA', fn: (event: events.ChannelProgressMedia) => void): this;
    on(event: 'CHANNEL_STATE', fn: (event: events.ChannelState) => void): this;
    on(event: 'CHANNEL_UNBRIDGE', fn: (event: events.ChannelUnbridge) => void): this;
    on(event: 'CHANNEL_UNHOLD', fn: (event: events.ChannelUnhold) => void): this;
    on(event: 'CHANNEL_UNPARK', fn: (event: events.ChannelUnpark) => void): this;
    on(event: 'CHANNEL_UUID', fn: (event: events.ChannelUuid) => void): this;

    on(event: string | symbol, fn:  (...args: any[]) => void): this {
        return super.on(event, fn);
    }

}

export default Session;