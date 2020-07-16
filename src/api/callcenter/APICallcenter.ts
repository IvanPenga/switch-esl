import { agentType, agentStatus, agentState } from './../../types'

export default (api: (command: string) => Promise<string>) => {

    function agentAdd(name: string, type: agentType) {
        return api(`callcenter_config agent add '${name}' '${type}'`);
    }

    function agentDel(name: string) {
        return api(`callcenter_config agent del '${name}'`);
    }

    function agentReload(name: string) {
        return api(`callcenter_config agent reload '${name}'`);
    }

    function agentSetStatus(name: string, status: agentStatus) {
        return api(`callcenter_config agent set status '${name}' '${status}'`);
    }

    function agentSetState(name: string, state: agentState) {
        return api(`callcenter_config agent set state '${name}' '${state}'`);
    }

    function agentSetContact(name: string, contact: string) {
        return api(`callcenter_config agent set contact '${name}' '${contact}'`);
    }

    function agentSetReadyTime(name: string, waitTillEpoch: string) {
        return api(`callcenter_config agent set ready_time '${name}' ${waitTillEpoch}`);
    }

    function agentSetRejectDelayTime(name: string, waitSecond: string) {
        return api(`callcenter_config agent set reject_delay_time '${name}' ${waitSecond}`);
    }

    function agentSetBusyDelayTime(name: string, waitSecond: string) {
        return api(`callcenter_config agent set busy_delay_time '${name}' ${waitSecond}`);
    }

    function agentSetNoAnswerDelayTime(name: string, waitSecond: string) {
        return api(`callcenter_config agent set no_answer_delay_time '${name}' ${waitSecond}`);
    }

    function agentGetStatus(name: string) {
        return api(`callcenter_config agent get status '${name}'`);
    }

    function agentGetState(name: string) {
        return api(`callcenter_config agent get state '${name}'`);
    }

    function agentGetUuid(name: string) {
        return api(`callcenter_config agent get uuid '${name}'`);
    }

    function agentList(name = '') {
        if (name) return api(`callcenter_config agent list '${name}'`);
        return api(`callcenter_config agent list`);   
    }

    function tierAdd(queueName: string, agentName: string, level = '1', position = '1') {   
        return api(`callcenter_config tier add '${queueName}' '${agentName}' ${level} ${position}`);
    }

    function tierSetState(queueName: string, agentName: string, state: string) {
        return api(`callcenter_config tier set state '${queueName}' '${agentName}' ${state}`);
    }

    function tierSetLevel(queueName: string, agentName: string, level: string) {
        return api(`callcenter_config tier set level '${queueName}' '${agentName}' ${level}`);
    }

    function tierSetPosition(queueName: string, agentName: string, position: string) {
        return api(`callcenter_config tier set position '${queueName}' '${agentName}' ${position}`);
    }

    function tierDel(queueName: string, agentName: string) {
        return api(`callcenter_config tier del '${queueName}' '${agentName}'`);
    }

    function tierReload(queueName: string, agentName: string) {
        return api(`callcenter_config tier reload '${queueName}' '${agentName}'`);
    }

    function tierList() {
        return api(`callcenter_config tier list`);
    }

    function queueLoad(queueName: string) {
        return api(`callcenter_config queue load '${queueName}'`);
    }

    function queueUnload(queueName: string) {
        return api(`callcenter_config queue unload '${queueName}'`);
    }

    function queueReload(queueName: string) {
        return api(`callcenter_config queue reload '${queueName}'`);
    }

    function queueList() {
        return api(`callcenter_config queue list`);
    }

    function queueListAgents(queueName: string, status: string, state: string) {
        return api(`callcenter_config queue list agents '${queueName}' '${status}' '${state}'`);
    }

    function queueListMembers(queueName: string) {
        return api(`callcenter_config queue list members '${queueName}'`);
    }

    function queueListTiers(queueName: string) {
        return api(`callcenter_config queue list tiers '${queueName}'`);
    }

    function queueCount() {
        return api(`callcenter_config queue count`);
    }

    function queueCountAgents(queueName: string, status: string, state: string) {
        return api(`callcenter_config queue count agents '${queueName}' '${status}' '${state}'`);
    }

    function queueCountMembers(queueName: string) {
        return api(`callcenter_config queue count members '${queueName}'`);
    }


    function queueCountTiers(queueName: string) {
        return api(`callcenter_config queue count tiers '${queueName}'`);
    }

    return {
        agentAdd,
        agentDel,
        agentReload,
        agentSetStatus,
        agentSetState,
        agentSetContact,
        agentSetReadyTime,
        agentSetRejectDelayTime,
        agentSetBusyDelayTime,
        agentSetNoAnswerDelayTime,
        agentGetStatus,
        agentGetState,
        agentGetUuid,
        agentList,
        tierAdd,
        tierSetState,
        tierSetLevel,
        tierSetPosition ,
        tierDel,
        tierReload,
        tierList,
        queueLoad,
        queueUnload,
        queueReload,
        queueList,
        queueListAgents,
        queueListMembers,
        queueListTiers,
        queueCount,
        queueCountAgents,
        queueCountMembers,
        queueCountTiers,
    }

};