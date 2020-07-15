export default (api: (command: string) => Promise<string>) => {

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

    return {
        count,
        xmlList,
        cam,
        lock,
        unlock,
        nopin,
        clearVidFloor,
    }

};