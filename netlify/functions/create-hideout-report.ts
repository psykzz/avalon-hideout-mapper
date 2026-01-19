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

// Constants
const DEFAULT_NOTES_TEXT = 'No additional notes provided';

// Validate the server value
function isValidServer(server: string): server is 'America' | 'Europe' | 'Asia' {
  return server === 'America' || server === 'Europe' || server === 'Asia';
}

// Extract geo information from the request headers
function getGeoInfo(event: HandlerEvent): string {
  // Handle x-forwarded-for which may contain multiple IPs from proxies
  const forwardedFor = event.headers['x-forwarded-for'];
  const ip = forwardedFor 
    ? forwardedFor.split(',')[0].trim()
    : event.headers['x-nf-client-connection-ip'] || 'Unknown IP';
  
  const country = event.headers['x-country'] || 'Unknown';
  const city = event.headers['x-city'] || 'Unknown';
  const region = event.headers['x-subdivision-1-iso-code'] || 'Unknown';
  
  return `IP: ${ip}, Location: ${city}, ${region}, ${country}`;
}

// Sanitize string for safe inclusion in markdown
function sanitizeForMarkdown(str: string): string {
  // Escape markdown special characters to prevent formatting issues
  // Includes: backslash, backtick, asterisk, underscore, braces, brackets, 
  // parentheses, hash, plus, hyphen, period, exclamation, tilde (strikethrough)
  return str.replace(/[\\`*_{}[\]()#+\-.!~]/g, '\\$&');
}

// Validate a required string field
function validateRequiredString(value: any, fieldName: string): { valid: boolean; error?: string } {
  if (!value || typeof value !== 'string' || value.trim() === '') {
    return { 
      valid: false, 
      error: `${fieldName} is required and must be a non-empty string` 
    };
  }
  return { valid: true };
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

  const zoneValidation = validateRequiredString(zone, 'Zone name');
  if (!zoneValidation.valid) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: zoneValidation.error } as ErrorResponse),
    };
  }

  const guildValidation = validateRequiredString(guild, 'Guild name');
  if (!guildValidation.valid) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: guildValidation.error } as ErrorResponse),
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

  // Get GitHub configuration from environment variables
  const githubOwner = process.env.GITHUB_OWNER || 'psykzz';
  const githubRepo = process.env.GITHUB_REPO || 'avalon-hideout-mapper';
  const includeGeoInIssue = process.env.INCLUDE_GEO_IN_ISSUE === 'true';

  // Initialize Octokit
  const octokit = new Octokit({
    auth: githubToken,
  });

  // Create the issue body
  const sanitizedGeoInfo = sanitizeForMarkdown(geoInfo);
  const sanitizedZone = sanitizeForMarkdown(zone);
  const sanitizedGuild = sanitizeForMarkdown(guild);
  const sanitizedNotes = additional_notes ? sanitizeForMarkdown(additional_notes) : DEFAULT_NOTES_TEXT;
  
  const geoInfoLine = includeGeoInIssue 
    ? `\n---\n\n_This report was submitted via the automated submission endpoint._\n_Requester info: ${sanitizedGeoInfo}_`
    : '\n---\n\n_This report was submitted via the automated submission endpoint._';

  const issueBody = `## Hideout Information

**Zone Name:**
${sanitizedZone}

**Guild Name:**
${sanitizedGuild}

**Server:**
${server}

**Date Spotted:**
${new Date().toISOString().split('T')[0]}

**Additional Notes:**
${sanitizedNotes}

---

**Verification:**
- [ ] I have verified the zone name is correct
- [ ] I have verified the guild name is spelled correctly
- [ ] I have selected the correct server${geoInfoLine}
`;

  const issueTitle = `[HIDEOUT] ${guild} in ${zone}`;

  try {
    // Create the GitHub issue
    const response = await octokit.rest.issues.create({
      owner: githubOwner,
      repo: githubRepo,
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
