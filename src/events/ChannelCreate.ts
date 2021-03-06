import AbstractEvent from './AbstractEvent';

class ChannelCreate extends AbstractEvent {

  public 'Channel-State'= '';
  public 'Channel-Call-State'= '';
  public 'Channel-State-Number'= '';
  public 'Channel-Name'= '';
  public 'Unique-ID'= '';
  public 'Call-Direction'= '';
  public 'Presence-Call-Direction'= '';
  public 'Channel-HIT-Dialplan'= '';
  public 'Channel-Presence-ID'= '';
  public 'Channel-Call-UUID'= '';
  public 'Answer-State'= '';
  public 'Caller-Direction'= '';
  public 'Caller-Logical-Direction'= '';
  public 'Caller-Username'= '';
  public 'Caller-Dialplan'= '';
  public 'Caller-Caller-ID-Number'= '';
  public 'Caller-Orig-Caller-ID-Number'= '';
  public 'Caller-Network-Addr'= '';
  public 'Caller-ANI'= '';
  public 'Caller-Destination-Number'= '';
  public 'Caller-Unique-ID'= '';
  public 'Caller-Source'= '';
  public 'Caller-Context'= '';
  public 'Caller-Channel-Name'= '';
  public 'Caller-Profile-Index'= '';
  public 'Caller-Profile-Created-Time'= '';
  public 'Caller-Channel-Created-Time'= '';
  public 'Caller-Channel-Answered-Time'= '';
  public 'Caller-Channel-Progress-Time'= '';
  public 'Caller-Channel-Progress-Media-Time'= '';
  public 'Caller-Channel-Hangup-Time'= '';
  public 'Caller-Channel-Transfer-Time'= '';
  public 'Caller-Channel-Resurrect-Time'= '';
  public 'Caller-Channel-Bridged-Time'= '';
  public 'Caller-Channel-Last-Hold'= '';
  public 'Caller-Channel-Hold-Accum'= '';
  public 'Caller-Screen-Bit'= '';
  public 'Caller-Privacy-Hide-Name'= '';
  public 'Caller-Privacy-Hide-Number'= '';
  public variable_direction= '';
  public variable_uuid= '';
  public variable_call_uuid= '';
  public variable_session_id= '';
  public variable_sip_from_user= '';
  public variable_sip_from_uri= '';
  public variable_sip_from_host= '';
  public variable_video_media_flow= '';
  public variable_audio_media_flow= '';
  public variable_text_media_flow= '';
  public variable_channel_name= '';
  public variable_sip_call_id= '';
  public variable_sip_local_network_addr= '';
  public variable_sip_network_ip= '';
  public variable_sip_network_port= '';
  public variable_sip_invite_stamp= '';
  public variable_sip_received_ip= '';
  public variable_sip_received_port= '';
  public variable_sip_via_protocol= '';
  public variable_sip_authorized= '';
  public variable_sip_looped_call= '';
  public variable_sip_from_user_stripped= '';
  public variable_sip_from_tag= '';
  public variable_sofia_profile_name= '';
  public variable_sofia_profile_url= '';
  public variable_recovery_profile_name= '';
  public 'variable_sip_Remote-Party-ID'= '';
  public variable_sip_cid_type= '';
  public variable_sip_full_via= '';
  public variable_sip_full_from= '';
  public variable_sip_full_to= '';
  public variable_sip_allow= '';
  public variable_sip_req_user= '';
  public variable_sip_req_uri= '';
  public variable_sip_req_host= '';
  public variable_sip_to_user= '';
  public variable_sip_to_uri= '';
  public variable_sip_to_host= '';
  public variable_sip_contact_user= '';
  public variable_sip_contact_port= '';
  public variable_sip_contact_uri= '';
  public variable_sip_contact_host= '';
  public variable_rtp_use_codec_string= '';
  public variable_sip_user_agent= '';
  public variable_sip_via_host= '';
  public variable_sip_via_rport= '';
  public variable_max_forwards= '';
  public variable_presence_id= '';
  public variable_switch_r_sdp= '';
  public variable_ep_codec_string= '';
  public variable_endpoint_disposition= '';
  public 'Content-Length'= '';
  public 'Caller-Callee-ID-Name'= '';
  public 'Caller-Callee-ID-Number'= '';
  public variable_is_outbound= '';
  public variable_sip_profile_name= '';
  public variable_sip_destination_url= '';
  public variable_originate_early_media= '';
  public variable_local_media_ip= '';
  public variable_local_media_port= '';
  public variable_advertised_media_ip= '';
  public variable_local_video_ip= '';
  public variable_local_video_port= '';
  public variable_rtp_local_sdp_str= '';
  public variable_sip_outgoing_contact_uri= '';

}

export default ChannelCreate;