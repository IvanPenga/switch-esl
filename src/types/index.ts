type eventFormat = 'json' | 'xml' | 'plain';
type loglevel = 'debug' | 'info' | 'notice' | 'warning' | 'error' | 'alert' | 'crit' | 'console';

type agentType = 'callback' | 'uuid-standby';
type agentState = 'Idle' | 'Waiting' | 'Receiving' | 'In a queue call';
type agentStatus = 'Logged Out' | 'Available' | 'Available (On Demand)' | 'On Break';

type queueStrategy = 'ring-all' | 'longest-idle-agent' | 'round-robin' | 'top-down' |
    'agent-with-least-talk-time' | 'agent-with-fewest-calls' | 'sequentially-by-agent-order' |
    'random' | 'ring-progressively';

export {
    eventFormat,
    loglevel,
    agentType,
    agentState,
    agentStatus,
    queueStrategy
}