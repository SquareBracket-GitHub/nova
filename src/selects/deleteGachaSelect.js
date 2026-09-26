const { deleteGacha } = require('../functions/db');
const { t } = require('../functions/i18n');

module.exports = {
    feature: 'gacha',
    id: 'deleteGachaSelect',
    hasExtraData: false,
    async execute(interaction) {
        await deleteGacha(interaction.values[0], interaction.user.id);
        await interaction.update({ content: t(interaction, 'gacha_deleted'), components: [] });
    }
};
