const { deleteItem } = require('../functions/db');
const { t } = require('../functions/i18n');

module.exports = {
    feature: 'gacha',
    id: 'deleteItemSelect',
    hasExtraData: true,
    async execute(interaction) {
        await deleteItem(interaction.values[0], interaction.user.id);
        await interaction.update({ content: t(interaction, 'item_deleted'), components: [] });
    }
};
