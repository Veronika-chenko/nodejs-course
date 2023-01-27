class ValidationError extends Error {
    constructor(message) {
        super(message)
        this.status = 400;
    }
}

class UnauthorizedError extends Error {
    constructor(message) {
        super(message)
        this.status = 401;
    }
}

class WrongParamsError extends Error {
    constructor(message) {
        super(message)
        this.status = 404;
    }
}

class ConflictError extends Error {
    constructor(message) {
        super(message)
        this.status = 409;
    }
}

module.exports = {
    ValidationError,
    UnauthorizedError,
    WrongParamsError,
    ConflictError,
}