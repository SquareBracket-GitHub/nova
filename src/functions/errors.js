class UserFacingError extends Error {
    constructor(userMessage) {
        super(userMessage);
        this.name = 'UserFacingError';
        this.userMessage = userMessage;
    }
}

module.exports = { UserFacingError };
