import AbstractEvent from './AbstractEvent';
class RecvRtcpMessage extends AbstractEvent {

    public 'Unique-ID' = '';
    public 'SSRC' = '';
    public 'NTP-Most-Significant-Word' = '';
    public 'NTP-Least-Significant-Word' = '';
    public 'RTP-Timestamp' = '';
    public 'Sender-Packet-Count' = '';
    public 'Octect-Packet-Count' = '';
    public 'Last-RTP-Timestamp' = '';
    public 'RTP-Rate' = '';
    public 'Capture-Time' = '';
    public 'Source0-SSRC' = '';
    public 'Source0-Fraction' = '';
    public 'Source0-Lost' = '';
    public 'Source0-Loss-Avg' = '';
    public 'Source0-Highest-Sequence-Number-Received' = '';
    public 'Source0-Jitter' = '';
    public 'Source0-LSR' = '';
    public 'Source0-DLSR' = '';
    public 'Rtt0-Avg' = '';
}
export default RecvRtcpMessage

