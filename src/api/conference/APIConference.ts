import { ConferenceMaintenance } from "./../../events";
import Conference, { ConferenceMember } from "../../objects/Conference";

type API = (command: string) => Promise<string>;
type AddEventListener = (event: string, fn: (event: any) => void) => void;

type ConferenceCallback  = (conference: Conference, event: ConferenceMaintenance) => void;
type ConferenceMemberCallback = (conference: Conference, member: ConferenceMember, event: ConferenceMaintenance) => void;

export default (api: API, addEventListener: AddEventListener) => {

    function count(conferenceId: string) {
        return api(`conference ${conferenceId} count`);
    }

    function xmlList(conferenceId: string) {
        return api(`conference ${conferenceId} xml_list`);
    }

    function cam(conferenceId: string) {
        return api(`conference ${conferenceId} cam`);
    }

    function lock(conferenceId: string) {
        return api(`conference ${conferenceId} lock`);
    }

    function unlock(conferenceId: string) {
        return api(`conference ${conferenceId} unlock`);
    }

    function nopin(conferenceId: string) {
        return api(`conference ${conferenceId} nopin`);
    }

    function clearVidFloor(conferenceId: string) {
        return api(`conference ${conferenceId} clear-vid-floor`);
    }
    
    const conferences: { [ uuid: string ]: Conference } = {};

    function listen( onCreate: ConferenceCallback, onAddMember: ConferenceMemberCallback, onDelMember: ConferenceMemberCallback, onDestroy: ConferenceCallback) {

        addEventListener('CUSTOM conference::maintenance', (event: ConferenceMaintenance) => {
            switch(event.Action){
                case 'conference-create':  {
                    const conference = create(event);
                    onCreate(conference, event); break;
                }
                case 'conference-destroy':  {
                    const conference = destroy(event);
                    if (conference) onDestroy(conference, event); break;
                }
                case 'add-member': { 
                    const { conference, member } = addMember(event);
                    if (conference && member) onAddMember(conference, member, event); break;
                }
                case 'del-member': { 
                    const { conference, member } = delMember(event);
                    if (conference && member) onDelMember(conference, member, event); break;
                }
            }
        });
    }


    function create(event: ConferenceMaintenance) {
        const uuid = event["Conference-Unique-ID"];
        conferences[uuid] = new Conference(event);
        return conferences[uuid];
    }

    function destroy(event: ConferenceMaintenance) {
        const uuid = event["Conference-Unique-ID"];
        const conference = conferences[uuid] ? conferences[uuid].destroy(event) : undefined;
        delete conferences[uuid];
        return conference;
    }

    function addMember(event: ConferenceMaintenance) {
        const uuid = event["Conference-Unique-ID"];
        const member = conferences[uuid] ? conferences[uuid].addMember(event) : undefined;
        return { conference: conferences[uuid], member };
    }

    function delMember(event: ConferenceMaintenance) {
        const uuid = event["Conference-Unique-ID"];
        const member = conferences[uuid] ? conferences[uuid].delMember(event) : undefined;
        return { conference: conferences[uuid], member };
    }

    return {
        count,
        xmlList,
        cam,
        lock,
        unlock,
        nopin,
        clearVidFloor,
        listen
    }

};