export default {
    good: [
        JSON.stringify({
            "Event-Name": "RE_SCHEDULE",
            "Core-UUID": "3517ab2b-5f88-424c-b6ac-2l0f091e76e4",
            "FreeSWITCH-Hostname": "ip-127-0-0-1",
            "FreeSWITCH-Switchname": "ip-127-0-0-1",
            "FreeSWITCH-IPv4": "127.0.0.1",
            "FreeSWITCH-IPv6": "::1",
            "Event-Date-Local": "2020-07-18 07:30:51",
            "Event-Date-GMT": "Sat, 18 Jul 2020 07:30:51 GMT",
            "Event-Date-Timestamp": "1595057451173775",
            "Event-Calling-File": "switch_scheduler.c",
            "Event-Calling-Function": "switch_scheduler_execute",
            "Event-Calling-Line-Number": "73",
            "Event-Sequence": "42436",
            "Task-ID": "1",
            "Task-Desc": "heartbeat",
            "Task-Group": "core",
            "Task-Runtime": "1595057481"
        }),
        JSON.stringify({
            "Event-Name": "RE_SCHEDULE",
            "Core-UUID": "3517ab2b-5f88-424c-b6ac-2l0f091e76e4",
            "FreeSWITCH-Hostname": "ip-127-0-0-1",
            "FreeSWITCH-Switchname": "ip-127-0-0-1",
            "FreeSWITCH-IPv4": "127.0.0.1",
            "FreeSWITCH-IPv6": "::1",
        })
    ],
    bad: [
        '{ one bad json }',
        '{ two bad json }',
        JSON.stringify({
            "FreeSWITCH-Hostname": "ip-127-0-0-1",
            "FreeSWITCH-Switchname": "ip-127-0-0-1",
            "FreeSWITCH-IPv4": "127.0.0.1",
            "FreeSWITCH-IPv6": "::1",
        })
    ]
}

