export const siptrace = `Content-Type: auth/request

Content-Type: command/reply
Reply-Text: +OK accepted

Content-Type: command/reply
Reply-Text: +OK event listener enabled json

Content-Type: api/response
Content-Length: 22

+OK tracelevel is INFOContent-Type: command/reply
Reply-Text: +OK log level info [6]

Content-Type: log/data
Content-Length: 455
Log-Level: 6
Text-Channel: 1
Log-File: sofia.c
Log-Func: logger
Log-Line: 3565
User-Data: 

recv 324 bytes from tcp/[127.00.000.001]:49853 at 20:44:12.260281:
------------------------------------------------------------------------
ACK sip:123@12.34.123.34;transport=TCP SIP/2.0
Via: SIP/2.0/TCP 172.16.1.12:36307;branch=z9hG4bK-524287-1---db7a976241023072;rport
Max-Forwards: 70
To: <sip:123@12.34.123.34>;tag=K8Xrta380Zm1H
From: <sip:1000@12.34.123.34;transport=TCP>;tag=03439400
Call-ID: n1TWDpD1hKxKWZ_G8IAYpg..
CSeq: 1 ACK
Content-Length: 0

Content-Type: log/data
Content-Length: 1276
Log-Level: 6
Text-Channel: 1
Log-File: sofia.c
Log-Func: logger
Log-Line: 3565
User-Data: 

recv 1163 bytes from tcp/[127.00.000.001]:49853 at 20:44:12.371635:
------------------------------------------------------------------------
INVITE sip:123@12.34.123.34;transport=TCP SIP/2.0
Via: SIP/2.0/TCP 172.16.1.12:36307;branch=z9hG4bK-524287-1---3364f806a8059ef4;rport
Max-Forwards: 70
Contact: <sip:1000@127.00.000.001:49853;transport=TCP>
To: <sip:123@12.34.123.34>
From: <sip:1000@12.34.123.34;transport=TCP>;tag=03439400
Call-ID: n1TWDpD1hKxKWZ_G8IAYpg..
CSeq: 2 INVITE
Allow: INVITE, ACK, CANCEL, BYE, NOTIFY, REFER, MESSAGE, OPTIONS, INFO, SUBSCRIBE
Content-Type: application/sdp
Proxy-Authorization: Digest username="1000",realm="12.34.123.34",nonce="e6bce800-d6d6-4fd1-85d0-0dcd81449d0e",uri="sip:123@12.34.123.34;transport=TCP",response="99950999bd2ff111a2495fa39de481f6",cnonce="07b31c36a9d0e4a732e27824b72c33e1",nc=00000001,qop=auth,algorithm=MD5
User-Agent: Z 5.3.8 rv2.9.30-mod
Allow-Events: presence, kpml, talk
Content-Length: 336

v=0
o=Z 1595796252132 1 IN IP4 127.00.000.001
s=Z
c=IN IP4 127.00.000.001
t=0 0
m=audio 8000 RTP/AVP 106 8 98 101 0
a=rtpmap:106 opus/48000/2
a=fmtp:106 minptime=20; cbr=1; maxaveragebitrate=40000; useinbandfec=1
a=rtpmap:98 telephone-event/48000
a=fmtp:98 0-16
a=rtpmap:101 telephone-event/8000
a=fmtp:101 0-16
a=sendrecv
Content-Type: log/data
Content-Length: 107
Log-Level: 4
Text-Channel: 0
Log-File: mod_xml_curl.c
Log-Func: xml_url_fetch
Log-Line: 294
User-Data: 

2020-07-26 20:44:12.372845 [WARNING] mod_xml_curl.c:294 CURL returned error:[7] Couldn't connect to server
Content-Type: log/data
Content-Length: 1419
Log-Level: 3
Text-Channel: 0
Log-File: mod_xml_curl.c
Log-Func: xml_url_fetch
Log-Line: 315
User-Data: 

2020-07-26 20:44:12.372845 [ERR] mod_xml_curl.c:315 Received HTTP error 0 trying to fetch http://127.0.0.1:3005/api/xml-curl/
data: [hostname=ip-172-31-2-115&section=directory&tag_name=domain&key_name=name&key_value=172.31.2.115&Event-Name=REQUEST_PARAMS&Core-UUID=6877d7ab-31a5-4dc4-94c8-bf7dcd120ffb&FreeSWITCH-Hostname=ip-172-31-2-115&FreeSWITCH-Switchname=ip-172-31-2-115&FreeSWITCH-IPv4=172.31.2.115&FreeSWITCH-IPv6=%3A%3A1&Event-Date-Local=2020-07-26%2020%3A44%3A12&Event-Date-GMT=Sun,%2026%20Jul%202020%2020%3A44%3A12%20GMT&Event-Date-Timestamp=1595796252372845&Event-Calling-File=sofia_reg.c&Event-Calling-Function=sofia_reg_parse_auth&Event-Calling-Line-Number=2844&Event-Sequence=143935&action=sip_auth&sip_profile=internal&sip_user_agent=Z%205.3.8%20rv2.9.30-mod&sip_auth_username=1000&sip_auth_realm=12.34.123.34&sip_auth_nonce=e6bce800-d5d5-4fd1-85d0-0dcd81449d0d&sip_auth_uri=sip%3A123%4012.34.123.34%3Btransport%3DTCP&sip_contact_user=1000&sip_contact_host=127.00.000.001&sip_to_user=123&sip_to_host=12.34.123.34&sip_via_protocol=tcp&sip_from_user=1000&sip_from_host=12.34.123.34&sip_call_id=n1TWDpD1hKxKWZ_G8IAYpg..&sip_request_user=123&sip_request_host=12.34.123.34&sip_auth_qop=auth&sip_auth_cnonce=07b31c36a9d0e4a732e27824b72c33e1&sip_auth_nc=00000001&sip_auth_response=99950999bd2ff111a2495fa39de481f6&sip_auth_method=INVITE&client_port=49853&key=id&user=1000&domain=172.31.2.115&ip=127.00.000.001]
Content-Type: log/data
Content-Length: 491
Log-Level: 6
Text-Channel: 1
Log-File: sofia.c
Log-Func: logger
Log-Line: 3565
User-Data: 

send 362 bytes to tcp/[127.00.000.001]:49853 at 20:44:12.392534:
------------------------------------------------------------------------
SIP/2.0 100 Trying
Via: SIP/2.0/TCP 172.16.1.12:36307;branch=z9hG4bK-524287-1---3364f806a8059ef4;rport=49853;received=127.00.000.001
From: <sip:1000@12.34.123.34;transport=TCP>;tag=03439400
To: <sip:123@12.34.123.34>
Call-ID: n1TWDpD1hKxKWZ_G8IAYpg..
CSeq: 2 INVITE
User-Agent: FreeSWITCH-mod_sofia/1.10.3-release-15-129de34d84~64bit
Content-Length: 0

Content-Type: log/data
Content-Length: 104
Log-Level: 6
Text-Channel: 3
Log-File: mod_dialplan_xml.c
Log-Func: dialplan_hunt
Log-Line: 637
User-Data: e169fae1-08c0-4e70-86e1-29da1f385884

2020-07-26 20:44:12.372845 [INFO] mod_dialplan_xml.c:637 Processing 1000 <1000>->123 in context default
Content-Type: log/data
Content-Length: 93
Log-Level: 6
Text-Channel: 1
Log-File: switch_core_session.c
Log-Func: switch_core_session_exec
Log-Line: 2828
User-Data: e169fae1-08c0-4e70-86e1-29da1f385884

EXECUTE [depth=0] sofia/internal/1000@12.34.123.34 bridge([origination_uuid=abcd]pickup/123)
Content-Type: log/data
Content-Length: 88
Log-Level: 5
Text-Channel: 3
Log-File: switch_channel.c
Log-Func: switch_channel_set_name
Log-Line: 1118
User-Data: abcd

2020-07-26 20:44:12.392840 [NOTICE] switch_channel.c:1118 New Channel pickup/123 [abcd]
Content-Type: log/data
Content-Length: 748
Log-Level: 6
Text-Channel: 1
Log-File: sofia.c
Log-Func: logger
Log-Line: 3565
User-Data: 

recv 619 bytes from tcp/[127.00.000.001]:49853 at 20:44:16.620053:
------------------------------------------------------------------------
CANCEL sip:123@12.34.123.34;transport=TCP SIP/2.0
Via: SIP/2.0/TCP 172.16.1.12:36307;branch=z9hG4bK-524287-1---3364f806a8059ef4;rport
Max-Forwards: 70
To: <sip:123@12.34.123.34>
From: <sip:1000@12.34.123.34;transport=TCP>;tag=03439400
Call-ID: n1TWDpD1hKxKWZ_G8IAYpg..
CSeq: 2 CANCEL
Proxy-Authorization: Digest username="1000",realm="12.34.123.34",nonce="e6bce800-d5d5-4fd1-85d0-0dcd81449d0d",uri="sip:123@12.34.123.34;transport=TCP",response="dd464c66d7c6ceb5326871eebd2ea11c",cnonce="43e83f672d97bb6b36f13ec37d2428ac",nc=00000002,qop=auth,algorithm=MD5
User-Agent: Z 5.3.8 rv2.9.30-mod
Content-Length: 0

Content-Type: log/data
Content-Length: 437
Log-Level: 6
Text-Channel: 1
Log-File: sofia.c
Log-Func: logger
Log-Line: 3565
User-Data: 

send 307 bytes to tcp/[127.00.000.001]:49853 at 20:44:16.620136:
------------------------------------------------------------------------
SIP/2.0 200 OK
Via: SIP/2.0/TCP 172.16.1.12:36307;branch=z9hG4bK-524287-1---3364f806a8059ef4;rport=49853;received=127.00.000.001
From: <sip:1000@12.34.123.34;transport=TCP>;tag=03439400
To: <sip:123@12.34.123.34>;tag=mHQHv5Kcy8amD
Call-ID: n1TWDpD1hKxKWZ_G8IAYpg..
CSeq: 2 CANCEL
Content-Length: 0

Content-Type: log/data
Content-Length: 857
Log-Level: 6
Text-Channel: 1
Log-File: sofia.c
Log-Func: logger
Log-Line: 3565
User-Data: 

send 732 bytes to tcp/[127.00.000.001]:49853 at 20:44:16.620219:
------------------------------------------------------------------------
SIP/2.0 487 Request Terminated
Via: SIP/2.0/TCP 172.16.1.12:36307;branch=z9hG4bK-524287-1---3364f806a8059ef4;rport=49853;received=127.00.000.001
From: <sip:1000@12.34.123.34;transport=TCP>;tag=03439400
To: <sip:123@12.34.123.34>;tag=mHQHv5Kcy8amD
Call-ID: n1TWDpD1hKxKWZ_G8IAYpg..
CSeq: 2 INVITE
User-Agent: FreeSWITCH-mod_sofia/1.10.3-release-15-129de34d84~64bit
Accept: application/sdp
Allow: INVITE, ACK, BYE, CANCEL, OPTIONS, MESSAGE, INFO, UPDATE, REGISTER, REFER, NOTIFY, PUBLISH, SUBSCRIBE
Supported: timer, path, replaces
Allow-Events: talk, hold, conference, presence, as-feature-event, dialog, line-seize, call-info, sla, include-session-description, presence.winfo, message-summary, refer
Content-Length: 0

Content-Type: log/data
Content-Length: 122
Log-Level: 5
Text-Channel: 0
Log-File: sofia.c
Log-Func: sofia_handle_sip_i_state
Log-Line: 8558
User-Data: e169fae1-08c0-4e70-86e1-29da1f385884

2020-07-26 20:44:16.612837 [NOTICE] sofia.c:8558 Hangup sofia/internal/1000@12.34.123.34 [CS_EXECUTE] [ORIGINATOR_CANCEL]
Content-Type: log/data
Content-Length: 121
Log-Level: 5
Text-Channel: 0
Log-File: switch_ivr_originate.c
Log-Func: switch_ivr_originate
Log-Line: 3759
User-Data: abcd

2020-07-26 20:44:16.632848 [NOTICE] switch_ivr_originate.c:3759 Hangup pickup/123 [CS_CONSUME_MEDIA] [ORIGINATOR_CANCEL]
Content-Type: log/data
Content-Length: 97
Log-Level: 6
Text-Channel: 3
Log-File: mod_dptools.c
Log-Func: audio_bridge_function
Log-Line: 3631
User-Data: e169fae1-08c0-4e70-86e1-29da1f385884

2020-07-26 20:44:16.632848 [INFO] mod_dptools.c:3631 Originate Failed.  Cause: ORIGINATOR_CANCEL
Content-Type: log/data
Content-Length: 116
Log-Level: 5
Text-Channel: 3
Log-File: switch_core_session.c
Log-Func: switch_core_session_thread
Log-Line: 1744
User-Data: e169fae1-08c0-4e70-86e1-29da1f385884

2020-07-26 20:44:16.632848 [NOTICE] switch_core_session.c:1744 Session 400 (sofia/internal/1000@12.34.123.34) Ended
Content-Type: log/data
Content-Length: 123
Log-Level: 5
Text-Channel: 0
Log-File: switch_core_session.c
Log-Func: switch_core_session_thread
Log-Line: 1748
User-Data: e169fae1-08c0-4e70-86e1-29da1f385884

2020-07-26 20:44:16.632848 [NOTICE] switch_core_session.c:1748 Close Channel sofia/internal/1000@12.34.123.34 [CS_DESTROY]
Content-Type: log/data
Content-Length: 94
Log-Level: 5
Text-Channel: 3
Log-File: switch_core_session.c
Log-Func: switch_core_session_thread
Log-Line: 1744
User-Data: abcd

2020-07-26 20:44:16.652885 [NOTICE] switch_core_session.c:1744 Session 401 (pickup/123) Ended
Content-Type: log/data
Content-Length: 101
Log-Level: 5
Text-Channel: 0
Log-File: switch_core_session.c
Log-Func: switch_core_session_thread
Log-Line: 1748
User-Data: abcd

2020-07-26 20:44:16.652885 [NOTICE] switch_core_session.c:1748 Close Channel pickup/123 [CS_DESTROY]
Content-Type: log/data
Content-Length: 455
Log-Level: 6
Text-Channel: 1
Log-File: sofia.c
Log-Func: logger
Log-Line: 3565
User-Data: 

recv 324 bytes from tcp/[127.00.000.001]:49853 at 20:44:16.688731:
------------------------------------------------------------------------
ACK sip:123@12.34.123.34;transport=TCP SIP/2.0
Via: SIP/2.0/TCP 172.16.1.12:36307;branch=z9hG4bK-524287-1---3364f806a8059ef4;rport
Max-Forwards: 70
To: <sip:123@12.34.123.34>;tag=mHQHv5Kcy8amD
From: <sip:1000@12.34.123.34;transport=TCP>;tag=03439400
Call-ID: n1TWDpD1hKxKWZ_G8IAYpg..
CSeq: 2 ACK
Content-Length: 0

`;