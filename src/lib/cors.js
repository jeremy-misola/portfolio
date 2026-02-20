// Reusable CORS configuration
export function applyCorsHeaders(response) {
  // Allow all origins
  response.headers.set('Access-Control-Allow-Origin', '*');
  // Allow all standard HTTP methods, including HEAD
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS, TRACE, CONNECT'
  );
  // Allow common headers
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  // Set maximum age for preflight cache
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours

  return response;
}

// Helper function to create a preflight response
export function createPreflightResponse() {
  const response = new Response(null, { status: 204 });
  return applyCorsHeaders(response);
}
