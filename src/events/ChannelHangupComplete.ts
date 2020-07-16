import AbstractEvent from './AbstractEvent';
class ChannelHangupComplete extends AbstractEvent {

    public 'Hangup-Cause' = '';
    public 'Channel-State' = '';
    public 'Channel-Call-State' = '';
    public 'Channel-State-Number' = '';
    public 'Channel-Name' = '';
    public 'Unique-ID' = '';
    public 'Call-Direction' = '';
    public 'Presence-Call-Direction' = '';
    public 'Channel-HIT-Dialplan' = '';
    public 'Channel-Presence-ID' = '';
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
    public 'Caller-Username' = '';
    public 'Caller-Dialplan' = '';
    public 'Caller-Caller-ID-Name' = '';
    public 'Caller-Caller-ID-Number' = '';
    public 'Caller-Orig-Caller-ID-Name' = '';
    public 'Caller-Orig-Caller-ID-Number' = '';
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
    public 'variable_uuid' = '';
    public 'variable_session_id' = '';
    public 'variable_sip_from_user' = '';
    public 'variable_sip_from_uri' = '';
    public 'variable_sip_from_host' = '';
    public 'variable_text_media_flow' = '';
    public 'variable_channel_name' = '';
    public 'variable_sip_local_network_addr' = '';
    public 'variable_sip_network_ip' = '';
    public 'variable_sip_network_port' = '';
    public 'variable_sip_invite_stamp' = '';
    public 'variable_sip_received_ip' = '';
    public 'variable_sip_received_port' = '';
    public 'variable_sip_via_protocol' = '';
    public 'variable_sip_authorized' = '';
    public 'variable_sip_looped_call' = '';
    public 'variable_sip_from_user_stripped' = '';
    public 'variable_sofia_profile_name' = '';
    public 'variable_sofia_profile_url' = '';
    public 'variable_recovery_profile_name' = '';
    public 'variable_sip_Remote-Party-ID' = '';
    public 'variable_sip_cid_type' = '';
    public 'variable_sip_allow' = '';
    public 'variable_sip_req_user' = '';
    public 'variable_sip_req_uri' = '';
    public 'variable_sip_req_host' = '';
    public 'variable_sip_to_user' = '';
    public 'variable_sip_to_uri' = '';
    public 'variable_sip_to_host' = '';
    public 'variable_sip_contact_user' = '';
    public 'variable_sip_contact_port' = '';
    public 'variable_sip_contact_uri' = '';
    public 'variable_sip_contact_host' = '';
    public 'variable_sip_user_agent' = '';
    public 'variable_sip_via_host' = '';
    public 'variable_sip_via_rport' = '';
    public 'variable_max_forwards' = '';
    public 'variable_presence_id' = '';
    public 'variable_switch_r_sdp' = '';
    public 'variable_ep_codec_string' = '';
    public 'variable_DP_MATCH' = '';
    public 'variable_call_uuid' = '';
    public 'variable_rtp_use_codec_string' = '';
    public 'variable_remote_text_media_flow' = '';
    public 'variable_remote_audio_media_flow' = '';
    public 'variable_audio_media_flow' = '';
    public 'variable_rtp_audio_recv_pt' = '';
    public 'variable_rtp_use_codec_name' = '';
    public 'variable_rtp_use_codec_fmtp' = '';
    public 'variable_rtp_use_codec_rate' = '';
    public 'variable_rtp_use_codec_ptime' = '';
    public 'variable_rtp_use_codec_channels' = '';
    public 'variable_rtp_last_audio_codec_string' = '';
    public 'variable_original_read_codec' = '';
    public 'variable_original_read_rate' = '';
    public 'variable_write_codec' = '';
    public 'variable_write_rate' = '';
    public 'variable_dtmf_type' = '';
    public 'variable_remote_video_media_flow' = '';
    public 'variable_video_media_flow' = '';
    public 'variable_video_possible' = '';
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
    public 'variable_rtp_remote_video_rtcp_port' = '';
    public 'variable_local_media_ip' = '';
    public 'variable_local_media_port' = '';
    public 'variable_advertised_media_ip' = '';
    public 'variable_rtp_use_timer_name' = '';
    public 'variable_rtp_use_pt' = '';
    public 'variable_rtp_use_ssrc' = '';
    public 'variable_rtp_2833_send_payload' = '';
    public 'variable_rtp_2833_recv_payload' = '';
    public 'variable_remote_media_ip' = '';
    public 'variable_remote_media_port' = '';
    public 'variable_local_video_ip' = '';
    public 'variable_local_video_port' = '';
    public 'variable_rtp_use_video_pt' = '';
    public 'variable_rtp_use_video_ssrc' = '';
    public 'variable_current_application_data' = '';
    public 'variable_current_application' = '';
    public 'variable_conference_name' = '';
    public 'variable_app_session_uuid' = '';
    public 'variable_rtp_local_sdp_str' = '';
    public 'variable_endpoint_disposition' = '';
    public 'variable_conference_member_id' = '';
    public 'variable_conference_moderator' = '';
    public 'variable_conference_ghost' = '';
    public 'variable_conference_uuid' = '';
    public 'variable_sip_to_tag' = '';
    public 'variable_sip_from_tag' = '';
    public 'variable_sip_cseq' = '';
    public 'variable_sip_call_id' = '';
    public 'variable_sip_full_via' = '';
    public 'variable_sip_full_from' = '';
    public 'variable_sip_full_to' = '';
    public 'variable_fs_call_channel_channel_name' = '';
    public 'variable_fs_call_destination_number' = '';
    public 'variable_fs_call_channel_create_time' = '';
    public 'variable_call_log_uuid' = '';
    public 'variable_fs_call_channel_answer_time' = '';
    public 'variable_call_log_start_time' = '';
    public 'variable_read_codec' = '';
    public 'variable_read_rate' = '';
    public 'variable_hangup_cause' = '';
    public 'variable_hangup_cause_q850' = '';
    public 'variable_digits_dialed' = '';
    public 'variable_start_stamp' = '';
    public 'variable_profile_start_stamp' = '';
    public 'variable_answer_stamp' = '';
    public 'variable_progress_media_stamp' = '';
    public 'variable_end_stamp' = '';
    public 'variable_start_epoch' = '';
    public 'variable_start_uepoch' = '';
    public 'variable_profile_start_epoch' = '';
    public 'variable_profile_start_uepoch' = '';
    public 'variable_answer_epoch' = '';
    public 'variable_answer_uepoch' = '';
    public 'variable_bridge_epoch' = '';
    public 'variable_bridge_uepoch' = '';
    public 'variable_last_hold_epoch' = '';
    public 'variable_last_hold_uepoch' = '';
    public 'variable_hold_accum_seconds' = '';
    public 'variable_hold_accum_usec' = '';
    public 'variable_hold_accum_ms' = '';
    public 'variable_resurrect_epoch' = '';
    public 'variable_resurrect_uepoch' = '';
    public 'variable_progress_epoch' = '';
    public 'variable_progress_uepoch' = '';
    public 'variable_progress_media_epoch' = '';
    public 'variable_progress_media_uepoch' = '';
    public 'variable_end_epoch' = '';
    public 'variable_end_uepoch' = '';
    public 'variable_last_app' = '';
    public 'variable_last_arg' = '';
    public 'variable_caller_id' = '';
    public 'variable_duration' = '';
    public 'variable_billsec' = '';
    public 'variable_progresssec' = '';
    public 'variable_answersec' = '';
    public 'variable_waitsec' = '';
    public 'variable_progress_mediasec' = '';
    public 'variable_flow_billsec' = '';
    public 'variable_mduration' = '';
    public 'variable_billmsec' = '';
    public 'variable_progressmsec' = '';
    public 'variable_answermsec' = '';
    public 'variable_waitmsec' = '';
    public 'variable_progress_mediamsec' = '';
    public 'variable_flow_billmsec' = '';
    public 'variable_uduration' = '';
    public 'variable_billusec' = '';
    public 'variable_progressusec' = '';
    public 'variable_answerusec' = '';
    public 'variable_waitusec' = '';
    public 'variable_progress_mediausec' = '';
    public 'variable_flow_billusec' = '';
    public 'variable_sip_hangup_disposition' = '';
    public 'variable_rtp_audio_in_raw_bytes' = '';
    public 'variable_rtp_audio_in_media_bytes' = '';
    public 'variable_rtp_audio_in_packet_count' = '';
    public 'variable_rtp_audio_in_media_packet_count' = '';
    public 'variable_rtp_audio_in_skip_packet_count' = '';
    public 'variable_rtp_audio_in_jitter_packet_count' = '';
    public 'variable_rtp_audio_in_dtmf_packet_count' = '';
    public 'variable_rtp_audio_in_cng_packet_count' = '';
    public 'variable_rtp_audio_in_flush_packet_count' = '';
    public 'variable_rtp_audio_in_largest_jb_size' = '';
    public 'variable_rtp_audio_in_jitter_min_variance' = '';
    public 'variable_rtp_audio_in_jitter_max_variance' = '';
    public 'variable_rtp_audio_in_jitter_loss_rate' = '';
    public 'variable_rtp_audio_in_jitter_burst_rate' = '';
    public 'variable_rtp_audio_in_mean_interval' = '';
    public 'variable_rtp_audio_in_flaw_total' = '';
    public 'variable_rtp_audio_in_quality_percentage' = '';
    public 'variable_rtp_audio_in_mos' = '';
    public 'variable_rtp_audio_out_raw_bytes' = '';
    public 'variable_rtp_audio_out_media_bytes' = '';
    public 'variable_rtp_audio_out_packet_count' = '';
    public 'variable_rtp_audio_out_media_packet_count' = '';
    public 'variable_rtp_audio_out_skip_packet_count' = '';
    public 'variable_rtp_audio_out_dtmf_packet_count' = '';
    public 'variable_rtp_audio_out_cng_packet_count' = '';
    public 'variable_rtp_audio_rtcp_packet_count' = '';
    public 'variable_rtp_audio_rtcp_octet_count' = '';
    public 'variable_rtp_video_in_raw_bytes' = '';
    public 'variable_rtp_video_in_media_bytes' = '';
    public 'variable_rtp_video_in_packet_count' = '';
    public 'variable_rtp_video_in_media_packet_count' = '';
    public 'variable_rtp_video_in_skip_packet_count' = '';
    public 'variable_rtp_video_in_jitter_packet_count' = '';
    public 'variable_rtp_video_in_dtmf_packet_count' = '';
    public 'variable_rtp_video_in_cng_packet_count' = '';
    public 'variable_rtp_video_in_flush_packet_count' = '';
    public 'variable_rtp_video_in_largest_jb_size' = '';
    public 'variable_rtp_video_in_jitter_min_variance' = '';
    public 'variable_rtp_video_in_jitter_max_variance' = '';
    public 'variable_rtp_video_in_jitter_loss_rate' = '';
    public 'variable_rtp_video_in_jitter_burst_rate' = '';
    public 'variable_rtp_video_in_mean_interval' = '';
    public 'variable_rtp_video_in_flaw_total' = '';
    public 'variable_rtp_video_in_quality_percentage' = '';
    public 'variable_rtp_video_in_mos' = '';
    public 'variable_rtp_video_out_raw_bytes' = '';
    public 'variable_rtp_video_out_media_bytes' = '';
    public 'variable_rtp_video_out_packet_count' = '';
    public 'variable_rtp_video_out_media_packet_count' = '';
    public 'variable_rtp_video_out_skip_packet_count' = '';
    public 'variable_rtp_video_out_dtmf_packet_count' = '';
    public 'variable_rtp_video_out_cng_packet_count' = '';
    public 'variable_rtp_video_rtcp_packet_count' = '';
    public 'variable_rtp_video_rtcp_octet_count' = '';
}
export default ChannelHangupComplete

