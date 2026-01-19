import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { Octokit } from '@octokit/rest';

interface HideoutReportRequest {
  zone: string;
  guild: string;
  server: 'America' | 'Europe' | 'Asia';
  additional_notes?: string;
}

interface ErrorResponse {
  error: string;
}

interface SuccessResponse {
  success: true;
  issueUrl: string;
  issueNumber: number;
}

// Validate the server value
function isValidServer(server: string): server is 'America' | 'Europe' | 'Asia' {
  return server === 'America' || server === 'Europe' || server === 'Asia';
}

// Extract geo information from the request headers
function getGeoInfo(event: HandlerEvent): string {
  const ip = event.headers['x-nf-client-connection-ip'] || 
             event.headers['x-forwarded-for'] || 
             'Unknown IP';
  
  const country = event.headers['x-country'] || 'Unknown';
  const city = event.headers['x-city'] || 'Unknown';
  const region = event.headers['x-subdivision-1-iso-code'] || 'Unknown';
  
  return `IP: ${ip}, Location: ${city}, ${region}, ${country}`;
}

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
): Promise<{
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}> => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Allow': 'POST',
      },
      body: JSON.stringify({ error: 'Method not allowed' } as ErrorResponse),
    };
  }

  // Check for GitHub token
  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    console.error('GITHUB_TOKEN environment variable is not set');
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Server configuration error' } as ErrorResponse),
    };
  }

  // Parse request body
  let requestBody: HideoutReportRequest;
  try {
    requestBody = JSON.parse(event.body || '{}');
  } catch (error) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON in request body' } as ErrorResponse),
    };
  }

  // Validate required fields
  const { zone, guild, server, additional_notes } = requestBody;

  if (!zone || typeof zone !== 'string' || zone.trim() === '') {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Zone name is required and must be a non-empty string' } as ErrorResponse),
    };
  }

  if (!guild || typeof guild !== 'string' || guild.trim() === '') {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Guild name is required and must be a non-empty string' } as ErrorResponse),
    };
  }

  if (!server || !isValidServer(server)) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Server must be one of: America, Europe, Asia' } as ErrorResponse),
    };
  }

  // Log requester information for abuse detection
  const geoInfo = getGeoInfo(event);
  console.log(`[HIDEOUT REPORT] ${geoInfo}`);
  console.log(`[HIDEOUT REPORT] Zone: ${zone}, Guild: ${guild}, Server: ${server}`);

  // Initialize Octokit
  const octokit = new Octokit({
    auth: githubToken,
  });

  // Create the issue body
  const issueBody = `## Hideout Information

**Zone Name:**
${zone}

**Guild Name:**
${guild}

**Server:**
${server}

**Date Spotted:**
${new Date().toISOString().split('T')[0]}

**Additional Notes:**
${additional_notes || 'No additional notes provided'}

---

**Verification:**
- [ ] I have verified the zone name is correct
- [ ] I have verified the guild name is spelled correctly
- [ ] I have selected the correct server

---

_This report was submitted via the automated submission endpoint._
_Requester info: ${geoInfo}_
`;

  const issueTitle = `[HIDEOUT] ${guild} in ${zone}`;

  try {
    // Create the GitHub issue
    const response = await octokit.rest.issues.create({
      owner: 'psykzz',
      repo: 'avalon-hideout-mapper',
      title: issueTitle,
      body: issueBody,
      labels: ['hideout-report'],
    });

    console.log(`[HIDEOUT REPORT] Issue created successfully: #${response.data.number}`);

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        issueUrl: response.data.html_url,
        issueNumber: response.data.number,
      } as SuccessResponse),
    };
  } catch (error) {
    console.error('[HIDEOUT REPORT] Error creating GitHub issue:', error);
    
    // Log the error details but don't expose them to the client
    if (error instanceof Error) {
      console.error('[HIDEOUT REPORT] Error details:', error.message);
    }

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to create hideout report' } as ErrorResponse),
    };
  }
};
