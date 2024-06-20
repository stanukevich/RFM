class ApiError {
    constructor(status, message){
        this.status = status;
        this.message = message;
    }

    static badRequest(message) {
        return new ApiError(400, message);
    }

    static internal(message) {
        return new ApiError(500, message);
    }

    static notFound(message) {
        return new ApiError(404, message);
    }

    static unauthorized(message) {
        return new ApiError(401, message);
    }
}

module.exports = ApiError;
