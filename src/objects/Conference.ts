import { ConferenceMaintenance } from "../events";

class ConferenceMember {
    
    id: string;
    uuid: string;
    channelName: string;

    joinedAt: string;
    leftAt: string;

    constructor(event: ConferenceMaintenance) {
        this.id = event['Member-ID'];
        this.uuid = event['Unique-ID'];
        this.channelName = event['Channel-Name'];
        this.joinedAt = event['Event-Date-Timestamp'];
        this.leftAt = '';
    }

    leave(event: ConferenceMaintenance) {
        this.leftAt = event["Event-Date-Timestamp"];
    }
}

class Conference {

    uuid: string;
    name: string;
    createdAt: string;
    destroyedAt: string;

    members: { [ uuid: string ]: ConferenceMember };

    constructor(event: ConferenceMaintenance) {
        this.uuid = event["Conference-Unique-ID"];
        this.name = event["Conference-Name"];
        this.createdAt = event["Event-Date-Timestamp"];
        this.destroyedAt = '';

        this.members = {  };
    }

    destroy(event: ConferenceMaintenance) {
        this.destroyedAt = event["Event-Date-Timestamp"];
        return this;
    }

    addMember(event: ConferenceMaintenance) {
        const uuid = event['Member-ID'];
        this.members[uuid] = new ConferenceMember(event);
        return this.members[uuid];
    }

    delMember(event: ConferenceMaintenance) {
        const uuid = event['Member-ID'];
        this.members[uuid].leave(event);
        return this.members[uuid];
    }
}

export { ConferenceMember };
export default Conference;