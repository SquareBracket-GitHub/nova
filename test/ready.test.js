const assert = require('node:assert/strict');
const test = require('node:test');
const { ActivityType, Events } = require('discord.js');
const ready = require('../src/events/ready');

test('ready event advertises /about as the bot activity', async () => {
    let presence;
    const client = {
        user: {
            setPresence(value) {
                presence = value;
            }
        }
    };

    await ready.execute(client);

    assert.equal(ready.event, Events.ClientReady);
    assert.equal(ready.once, true);
    assert.deepEqual(presence, {
        activities: [{ name: '/about', type: ActivityType.Playing }],
        status: 'online'
    });
});
