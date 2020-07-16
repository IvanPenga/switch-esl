class AbstractEvent {

    public 'Event-Name'= '';
    public 'Core-UUID'= '';
    public 'FreeSWITCH-Hostname'= '';
    public 'FreeSWITCH-Switchname'= '';
    public 'FreeSWITCH-IPv4'= '';
    public 'FreeSWITCH-IPv6'= '';
    public 'Event-Date-Local'= '';
    public 'Event-Date-GMT'= '';
    public 'Event-Date-Timestamp'= '';
    public 'Event-Calling-File'= '';
    public 'Event-Calling-Function'= '';
    public 'Event-Calling-Line-Number'= '';
    public 'Event-Sequence'= '';
    [key: string]: string;

}
  
export default AbstractEvent;
  