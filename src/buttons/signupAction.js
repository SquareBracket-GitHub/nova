const { closeSignup, joinSignup, leaveSignup } = require('../functions/db');
const { signupView } = require('../functions/signupUi');

module.exports = {
    id: 'signupAction',
    hasExtraData: true,

    async execute(interaction) {
        const [, action, eventId] = interaction.customId.split('|');
        let signup;
        if (action === 'join') signup = await joinSignup(eventId, interaction.user.id);
        else if (action === 'leave') signup = await leaveSignup(eventId, interaction.user.id);
        else if (action === 'close') signup = await closeSignup(eventId, interaction.user.id);
        else throw new Error('Invalid signup action.');
        await interaction.update(signupView(interaction, signup));
    }
};
