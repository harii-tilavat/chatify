class Response {
  static send(res, statusCode, message, data = null) {
    return res.status(statusCode).send({
      statusCode,
      message,
      data: data || undefined,
    });
  }

  static success(res, message, data = null) {
    return this.send(res, 200, message, data);
  }

  static created(res, message, data = null) {
    return this.send(res, 201, message, data);
  }

  static badRequest(res, message) {
    return this.send(res, 400, message);
  }

  static unauthorized(res, message = "Unauthorized user!") {
    return this.send(res, 401, message);
  }

  static notFound(res, message = "Resources not found.") {
    return this.send(res, 404, message);
  }

  static serverError(res, message = "Internal server error.") {
    return this.send(res, 500, message);
  }
}
const StatusCode = Object.freeze({
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,

  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
});

const Message = Object.freeze({
  // General
  SUCCESS: "Operation successful.",
  CREATED: "Resource created successfully.",
  UPDATED: "Resource updated successfully.",
  DELETED: "Resource deleted successfully.",

  // Validation
  INVALID_EMAIL: "Invalid email format.",
  INVALID_PASSWORD: "Invalid password.",
  INVALID_PARAMS: "Invalid params.",
  PASSWORD_TOO_SHORT: "Password must be at least 6 characters long.",
  REQUIRED_FIELDS_MISSING: "Required fields are missing.",
  FILE_MISSING: 'File is missing',

  // User
  USER_NOT_FOUND: "User not found.",
  EMAIL_ALREADY_EXISTS: "Email already exists.",
  USERNAME_ALREADY_EXISTS: "Username already exists.",

  // Authentication
  UNAUTHORIZED: "Unauthorized user.",
  INVALID_CREDENTIALS: "Invalid credentials.",
  TOKEN_MISSING: "Authorization token missing.",
  TOKEN_EXPIRED: "Session expired.",
  INVALID_TOKEN: "Invalid token.",

  // User-specific messages
  SIGNUP_SUCCESS: "Signup successfully.",
  LOGIN_SUCCESS: "Login successfully.",

  // Book related
  BOOK_CREATED: 'Book added successfully.',
  BOOK_UPDATED: 'Book updated successfully.',
  BOOK_DELETED: 'Book deleted successfully.',
  BOOK_NOT_FOUND: 'Book not found.',
  BOOKS_NOT_FOUND: 'Books not found.',
  BOOK_FAILED: 'Books not found.',

  // Review related
  REVIEW_CREATED: 'Review added successfully.',
  REVIEW_UPDATED: 'Review updated successfully.',
  REVIEW_DELETED: 'Review deleted successfully.',
  REVIEW_NOT_FOUND: 'Review not found.',
  REVIEWS_NOT_FOUND: 'Reviews not found.',
  // Server
  INTERNAL_SERVER_ERROR: "Something went wrong. Please try again later.",
});

module.exports = { Response, StatusCode, Message };
