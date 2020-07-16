import AbstractEvent from './AbstractEvent';
class CallUpdate extends AbstractEvent {
    
    public 'Direction' = '';
    public 'Channel-State' = '';
    public 'Channel-Call-State' = '';
    public 'Channel-State-Number' = '';
    public 'Channel-Name' = '';
    public 'Unique-ID' = '';
    public 'Call-Direction' = '';
    public 'Presence-Call-Direction' = '';
    public 'Channel-HIT-Dialplan' = '';
    public 'Channel-Call-UUID' = '';
    public 'Answer-State' = '';
    public 'Channel-Read-Codec-Name' = '';
    public 'Channel-Read-Codec-Rate' = '';
    public 'Channel-Read-Codec-Bit-Rate' = '';
    public 'Channel-Write-Codec-Name' = '';
    public 'Channel-Write-Codec-Rate' = '';
    public 'Channel-Write-Codec-Bit-Rate' = '';
    public 'Caller-Direction' = '';
    public 'Caller-Logical-Direction' = '';
    public 'Caller-Caller-ID-Name' = '';
    public 'Caller-Caller-ID-Number' = '';
    public 'Caller-Orig-Caller-ID-Number' = '';
    public 'Caller-Callee-ID-Number' = '';
    public 'Caller-Network-Addr' = '';
    public 'Caller-ANI' = '';
    public 'Caller-Destination-Number' = '';
    public 'Caller-Unique-ID' = '';
    public 'Caller-Source' = '';
    public 'Caller-Context' = '';
    public 'Caller-Channel-Name' = '';
    public 'Caller-Profile-Index' = '';
    public 'Caller-Profile-Created-Time' = '';
    public 'Caller-Channel-Created-Time' = '';
    public 'Caller-Channel-Answered-Time' = '';
    public 'Caller-Channel-Progress-Time' = '';
    public 'Caller-Channel-Progress-Media-Time' = '';
    public 'Caller-Channel-Hangup-Time' = '';
    public 'Caller-Channel-Transfer-Time' = '';
    public 'Caller-Channel-Resurrect-Time' = '';
    public 'Caller-Channel-Bridged-Time' = '';
    public 'Caller-Channel-Last-Hold' = '';
    public 'Caller-Channel-Hold-Accum' = '';
    public 'Caller-Screen-Bit' = '';
    public 'Caller-Privacy-Hide-Name' = '';
    public 'Caller-Privacy-Hide-Number' = '';
    public 'variable_direction' = '';
    public 'variable_is_outbound' = '';
    public 'variable_uuid' = '';
    public 'variable_call_uuid' = '';
    public 'variable_session_id' = '';
    public 'variable_sip_profile_name' = '';
    public 'variable_text_media_flow' = '';
    public 'variable_channel_name' = '';
    public 'variable_sip_destination_url' = '';
    public 'variable_originate_early_media' = '';
    public 'variable_local_video_ip' = '';
    public 'variable_local_video_port' = '';
    public 'variable_rtp_local_sdp_str' = '';
    public 'variable_sip_outgoing_contact_uri' = '';
    public 'variable_sip_req_uri' = '';
    public 'variable_sofia_profile_name' = '';
    public 'variable_recovery_profile_name' = '';
    public 'variable_sofia_profile_url' = '';
    public 'variable_sip_local_network_addr' = '';
    public 'variable_sip_reply_host' = '';
    public 'variable_sip_reply_port' = '';
    public 'variable_sip_network_ip' = '';
    public 'variable_sip_network_port' = '';
    public 'variable_sip_user_agent' = '';
    public 'variable_sip_allow' = '';
    public 'variable_sip_recover_contact' = '';
    public 'variable_sip_full_via' = '';
    public 'variable_sip_recover_via' = '';
    public 'variable_sip_full_from' = '';
    public 'variable_sip_full_to' = '';
    public 'variable_sip_from_user' = '';
    public 'variable_sip_from_uri' = '';
    public 'variable_sip_from_host' = '';
    public 'variable_sip_to_user' = '';
    public 'variable_sip_to_uri' = '';
    public 'variable_sip_to_host' = '';
    public 'variable_sip_contact_params' = '';
    public 'variable_sip_contact_user' = '';
    public 'variable_sip_contact_port' = '';
    public 'variable_sip_contact_uri' = '';
    public 'variable_sip_contact_host' = '';
    public 'variable_sip_to_tag' = '';
    public 'variable_sip_from_tag' = '';
    public 'variable_sip_cseq' = '';
    public 'variable_sip_call_id' = '';
    public 'variable_switch_r_sdp' = '';
    public 'variable_endpoint_disposition' = '';
    public 'variable_ep_codec_string' = '';
    public 'variable_rtp_use_codec_string' = '';
    public 'variable_remote_text_media_flow' = '';
    public 'variable_remote_audio_media_flow' = '';
    public 'variable_audio_media_flow' = '';
    public 'variable_remote_media_ip' = '';
    public 'variable_remote_media_port' = '';
    public 'variable_rtp_audio_recv_pt' = '';
    public 'variable_rtp_use_codec_name' = '';
    public 'variable_rtp_use_codec_fmtp' = '';
    public 'variable_rtp_use_codec_rate' = '';
    public 'variable_rtp_use_codec_ptime' = '';
    public 'variable_rtp_use_codec_channels' = '';
    public 'variable_rtp_last_audio_codec_string' = '';
    public 'variable_read_codec' = '';
    public 'variable_original_read_codec' = '';
    public 'variable_read_rate' = '';
    public 'variable_original_read_rate' = '';
    public 'variable_write_codec' = '';
    public 'variable_write_rate' = '';
    public 'variable_dtmf_type' = '';
    public 'variable_remote_video_media_flow' = '';
    public 'variable_video_media_flow' = '';
    public 'variable_video_possible' = '';
    public 'variable_rtp_remote_video_rtcp_port' = '';
    public 'variable_remote_video_ip' = '';
    public 'variable_remote_video_port' = '';
    public 'variable_rtp_video_pt' = '';
    public 'variable_rtp_video_recv_pt' = '';
    public 'variable_video_read_codec' = '';
    public 'variable_video_read_rate' = '';
    public 'variable_video_write_codec' = '';
    public 'variable_video_write_rate' = '';
    public 'variable_rtp_last_video_codec_string' = '';
    public 'variable_rtp_use_video_codec_name' = '';
    public 'variable_rtp_use_video_codec_rate' = '';
    public 'variable_rtp_use_video_codec_ptime' = '';
    public 'variable_local_media_ip' = '';
    public 'variable_local_media_port' = '';
    public 'variable_advertised_media_ip' = '';
    public 'variable_rtp_use_timer_name' = '';
    public 'variable_pre_transfer_caller_id_number' = '';
}
export default CallUpdate

