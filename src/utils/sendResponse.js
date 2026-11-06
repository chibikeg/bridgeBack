/**
 * Send a consistent JSON API response.
 */
export function sendResponse(res, statusCode, data, message = null) {
  const body = message ? { message, data } : { data };
  return res.status(statusCode).json(body);
}

/**
 * Send a success response (200 or 201).
 */
export function success(res, data, message = "Success", statusCode = 200) {
  return sendResponse(res, statusCode, data, message);
}

/**
 * Send a created response (201).
 */
export function created(res, data, message = "Created successfully") {
  return sendResponse(res, 201, data, message);
}

/**
 * Send an error response.
 */
export function error(res, statusCode, message, details = null) {
  const body = { message };
  if (details) body.details = details;
  return res.status(statusCode).json(body);
}
