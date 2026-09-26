class UserFacingError extends Error {
    constructor(translationKey, variables = {}) {
        super(translationKey);
        this.name = 'UserFacingError';
        this.translationKey = translationKey;
        this.variables = variables;
    }
}

module.exports = { UserFacingError };
