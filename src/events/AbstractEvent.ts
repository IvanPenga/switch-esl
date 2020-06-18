class AbstractEvent {

    public 'Event-Name': string = '';
    public 'Core-UUID': string = '';
    public 'FreeSWITCH-Hostname': string = '';
    public 'FreeSWITCH-Switchname': string = '';
    public 'FreeSWITCH-IPv4': string = '';
    public 'FreeSWITCH-IPv6': string = '';
    public 'Event-Date-Local': string = '';
    public 'Event-Date-GMT': string = '';
    public 'Event-Date-Timestamp': string = '';
    public 'Event-Calling-File': string = '';
    public 'Event-Calling-Function': string = '';
    public 'Event-Calling-Line-Number': string = '';
    public 'Event-Sequence': string = '';
    [key: string]: string;

}
  
export default AbstractEvent;
  