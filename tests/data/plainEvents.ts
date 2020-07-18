export default {
    good: [
        `Event-Name: RE_SCHEDULE
        Core-UUID: 3517ab2b-5f88-424c-b6ac-1c0f091e76e4
        FreeSWITCH-Hostname: ip-127-0-0-1
        FreeSWITCH-Switchname: ip-127-0-0-1
        FreeSWITCH-IPv4: 127.0.0.1
        FreeSWITCH-IPv6: ::1
        Event-Date-Local: 2020-07-18 07:42:51
        Event-Date-GMT: Sat, 18 Jul 2020 07:42:51 GMT
        Event-Date-Timestamp: 1595058171333785
        Event-Calling-File: switch_scheduler.c
        Event-Calling-Function: switch_scheduler_execute
        Event-Calling-Line-Number: 73
        Event-Sequence: 42501
        Task-ID: 1
        Task-Desc: heartbeat
        Task-Group: core
        Task-Runtime: 1595058201`
    ],
    bad: [
        '{ "this_should_be_plain": "event" }',
        `FreeSWITCH-IPv6: ::1
        Event-Date-Local: 2020-07-18 07:42:51
        Event-Date-GMT: Sat, 18 Jul 2020 07:42:51 GMT
        Event-Date-Timestamp: 1595058171333785
        Event-Calling-File: switch_scheduler.c
        Event-Calling-Function: switch_scheduler_execute
        Event-Calling-Line-Number: 73
        Event-Sequence: 42501
        Task-ID: 1
        Task-Desc: heartbeat
        Task-Group: core
        Task-Runtime: 1595058201`
    ]
}





