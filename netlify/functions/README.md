# Netlify Functions

This directory contains serverless functions that run on Netlify.

## create-hideout-report

Automated endpoint for creating hideout report GitHub issues without requiring users to have a GitHub account.

### Endpoint

`POST /.netlify/functions/create-hideout-report`

Or via the redirect:

`POST /api/create-hideout-report`

### Environment Variables

This function requires the following environment variable to be set in your Netlify site settings:

- `GITHUB_TOKEN` (required): A GitHub personal access token with `repo` scope to create issues in the repository.
- `GITHUB_OWNER` (optional): GitHub repository owner. Defaults to `psykzz`.
- `GITHUB_REPO` (optional): GitHub repository name. Defaults to `avalon-hideout-mapper`.
- `INCLUDE_GEO_IN_ISSUE` (optional): Set to `true` to include requester geo info in the issue body. Defaults to `false` for privacy. Geo info is always logged server-side regardless of this setting.

To create a token:
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a descriptive name (e.g., "Avalon Hideout Mapper - Issue Creation")
4. Select the `repo` scope (full control of private repositories)
5. Generate token and copy it
6. Add it to your Netlify site environment variables

### Request Body

The function expects a JSON request body with the following fields:

```json
{
  "zone": "AVALON-LIONEL-01",
  "guild": "Example Guild",
  "server": "America",
  "additional_notes": "Optional additional information"
}
```

**Required fields:**
- `zone` (string): The Avalon zone name. Must exist in the world.json data.
- `guild` (string): The guild name. Must exist on the specified server (validated via Albion Online API).
- `server` (string): Must be one of: "America", "Europe", or "Asia"

**Optional fields:**
- `additional_notes` (string): Any additional information about the hideout

### Validation

The function performs the following validations before creating an issue:

1. **Zone Validation**: Verifies the zone name exists in the Avalon zone data (world.json)
2. **Guild Validation**: Verifies the guild exists on the specified server using the Albion Online game API
   - America server: `gameinfo.albiononline.com`
   - Europe server: `gameinfo-ams.albiononline.com`
   - Asia server: `gameinfo-sgp.albiononline.com`
3. **Server Validation**: Ensures the server is one of the three valid options

If validation fails, the function returns a 400 Bad Request with a descriptive error message.

### Response

**Success (201 Created):**
```json
{
  "success": true,
  "issueUrl": "https://github.com/psykzz/avalon-hideout-mapper/issues/123",
  "issueNumber": 123
}
```

**Error (4xx/5xx):**
```json
{
  "error": "Error message describing what went wrong"
}
```

**Example error messages:**
- `Zone "INVALID-ZONE" not found. Please check the zone name and try again.`
- `Guild "NonExistentGuild" not found on America server. Please check the guild name and server selection.`
- `Server must be one of: America, Europe, Asia`

### Error Codes

- `400 Bad Request`: Invalid request body or missing required fields
- `405 Method Not Allowed`: Request method is not POST
- `500 Internal Server Error`: Server configuration error or GitHub API error

### Logging

The function logs the following information for abuse detection:

- Requester IP address (from Netlify headers)
- Geographic location (country, city, region)
- Zone, guild, and server from the request

**Important:** All geo information is logged server-side in Netlify function logs for abuse detection. By default, this information is NOT included in the public GitHub issue to protect user privacy. To include geo information in issues, set the `INCLUDE_GEO_IN_ISSUE` environment variable to `true`.

Example log output:
```
[HIDEOUT REPORT] IP: 192.168.1.1, Location: San Francisco, CA, United States
[HIDEOUT REPORT] Zone: AVALON-LIONEL-01, Guild: Example Guild, Server: America
[HIDEOUT REPORT] Issue created successfully: #123
```

### Example Usage

Using `curl`:

```bash
curl -X POST https://your-site.netlify.app/api/create-hideout-report \
  -H "Content-Type: application/json" \
  -d '{
    "zone": "AVALON-LIONEL-01",
    "guild": "Example Guild",
    "server": "America",
    "additional_notes": "Spotted today at 14:00 UTC"
  }'
```

Using JavaScript `fetch`:

```javascript
const response = await fetch('/api/create-hideout-report', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    zone: 'AVALON-LIONEL-01',
    guild: 'Example Guild',
    server: 'America',
    additional_notes: 'Spotted today at 14:00 UTC',
  }),
});

const result = await response.json();
if (response.ok) {
  console.log('Issue created:', result.issueUrl);
} else {
  console.error('Error:', result.error);
}
```

### Testing Locally

To test the function locally, you can use the Netlify CLI:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Set environment variable
export GITHUB_TOKEN=your_github_token_here

# Run the development server
netlify dev

# In another terminal, test the function
curl -X POST http://localhost:8888/api/create-hideout-report \
  -H "Content-Type: application/json" \
  -d '{
    "zone": "AVALON-LIONEL-01",
    "guild": "Test Guild",
    "server": "America"
  }'
```

### Security Considerations

1. **Rate Limiting**: Consider implementing rate limiting on the Netlify level to prevent abuse
2. **IP Logging**: The function logs IP addresses and geographic information server-side to help identify potential abusers. This data is stored in Netlify function logs according to Netlify's data retention policies.
3. **Privacy**: By default, user geo information is NOT included in public GitHub issues. Enable `INCLUDE_GEO_IN_ISSUE` only if you have a privacy policy that covers this data collection.
4. **Token Security**: Never commit the `GITHUB_TOKEN` to the repository. Always use environment variables.
5. **Validation**: The function validates all input fields before creating the GitHub issue

### Abuse Prevention

The function includes abuse prevention mechanisms:
- Server-side logging of IP addresses and geographic information in Netlify function logs
- Optional inclusion of requester info in GitHub issues for public accountability
- Track the source of spam reports through Netlify logs
- Netlify provides built-in DDoS protection
- Configure additional security rules in your Netlify site settings

**Data Retention**: IP addresses and geo information are stored in Netlify function logs according to your Netlify plan's log retention period. Review Netlify's data retention policies and ensure compliance with applicable privacy regulations (GDPR, CCPA, etc.).
