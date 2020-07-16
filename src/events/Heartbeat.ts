import AbstractEvent from './AbstractEvent';
class Heartbeat extends AbstractEvent {

    public 'Event-Info' = '';
    public 'Up-Time' = '';
    public 'FreeSWITCH-Version' = '';
    public 'Uptime-msec' = '';
    public 'Session-Count' = '';
    public 'Max-Sessions' = '';
    public 'Session-Per-Sec' = '';
    public 'Session-Per-Sec-Last' = '';
    public 'Session-Per-Sec-Max' = '';
    public 'Session-Per-Sec-FiveMin' = '';
    public 'Session-Since-Startup' = '';
    public 'Session-Peak-Max' = '';
    public 'Session-Peak-FiveMin' = '';
    public 'Idle-CPU' = '';

}
export default Heartbeat

