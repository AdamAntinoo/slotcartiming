export const environment = {
    production: false,
    pusher: {
        key: '240b883e94e23a16ba47',
        cluster: 'eu',
        forceTLS: true
    },
    DSEvent: {
        channelName: 'ds-events-channel',
        eventName: 'ds-timing-data',
        sourceHost: 'http://localhost:',
        sourcePort: 3300
    },
    laneCount: 8
};
