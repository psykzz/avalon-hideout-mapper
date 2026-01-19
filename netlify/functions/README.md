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

- `GITHUB_TOKEN`: A GitHub personal access token with `repo` scope to create issues in the repository.

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
- `zone` (string): The Avalon zone name
- `guild` (string): The guild name
- `server` (string): Must be one of: "America", "Europe", or "Asia"

**Optional fields:**
- `additional_notes` (string): Any additional information about the hideout

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

### Error Codes

- `400 Bad Request`: Invalid request body or missing required fields
- `405 Method Not Allowed`: Request method is not POST
- `500 Internal Server Error`: Server configuration error or GitHub API error

### Logging

The function logs the following information for abuse detection:

- Requester IP address (from Netlify headers)
- Geographic location (country, city, region)
- Zone, guild, and server from the request

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
2. **IP Logging**: The function logs IP addresses and geographic information to help identify potential abusers
3. **Token Security**: Never commit the `GITHUB_TOKEN` to the repository. Always use environment variables.
4. **Validation**: The function validates all input fields before creating the GitHub issue

### Abuse Prevention

The function includes the requester's IP and geographic information in the issue body, making it easier to:
- Identify patterns of abuse
- Block specific IP addresses or regions if needed
- Track the source of spam reports

Netlify also provides built-in DDoS protection and you can configure additional security rules in your Netlify site settings.
