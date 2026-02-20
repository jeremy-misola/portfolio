import { NextResponse } from 'next/server';
import { applyCorsHeaders, createPreflightResponse } from '@/lib/cors';

// Handle CORS preflight
export async function OPTIONS() {
  return createPreflightResponse();
}

// Handle HEAD requests
export async function HEAD() {
  const response = new NextResponse(null);
  return applyCorsHeaders(response);
}

export async function GET() {
  const backendUrl = 'http://portfolio-backend.default.svc.cluster.local:8080/api/v1/cluster/state'

  if (!backendUrl) {
    console.error("KUBERNETES_BACKEND_URL environment variable is not set.");
    return applyCorsHeaders(NextResponse.json(
      { error: "Application is not configured correctly." },
      { status: 500 }
    ));
  }

  try {
    // This fetch call happens on the server-side, inside your Next.js pod.
    const response = await fetch(backendUrl, {
      // Kubernetes often uses self-signed certs for internal services.
      // In a development or trusted internal environment, you might need to disable SSL verification.
      // For production, a better approach is to use a proper certificate setup.
      // agent: new https.Agent({ rejectUnauthorized: false }), // Example for Node.js fetch, browser fetch doesn't have this.
      
      // Data from the backend is revalidated every 5 seconds.
      next: { revalidate: 5 } 
    });

    if (!response.ok) {
      throw new Error(`Internal service responded with status: ${response.status}`);
    }

    const data = await response.json();
    return applyCorsHeaders(NextResponse.json(data));

  } catch (error) {
    console.error("Failed to fetch data from Kubernetes backend:", error);
    return applyCorsHeaders(NextResponse.json(
      { error: "Could not connect to the backend service." },
      { status: 503 } // Service Unavailable
    ));
  }
}
