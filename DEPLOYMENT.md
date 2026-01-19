# Deployment Guide

This Next.js application can be deployed to various platforms. Here are the most common options:

## Vercel (Recommended)

Vercel is the company behind Next.js and offers the best integration:

### Deploy via GitHub

1. Push your code to GitHub (already done!)
2. Visit [vercel.com](https://vercel.com)
3. Sign in with your GitHub account
4. Click "Import Project"
5. Select your repository
6. Vercel will automatically detect Next.js settings
7. Click "Deploy"

Your app will be live in under a minute with automatic deployments on every push!

### Deploy via CLI

```bash
npm install -g vercel
vercel login
vercel
```

## Netlify

1. Visit [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. Configure environment variables (see below)
6. Click "Deploy site"

### Netlify Functions

This application includes serverless functions for automated hideout report submission. To enable this functionality:

1. Go to your Netlify site settings → Environment variables
2. Add the following environment variables:
   - **Key**: `GITHUB_TOKEN` (required)
   - **Value**: Your GitHub personal access token with `repo` scope
   
Optional environment variables:
   - `GITHUB_OWNER`: Repository owner (defaults to `psykzz`)
   - `GITHUB_REPO`: Repository name (defaults to `avalon-hideout-mapper`)
   - `INCLUDE_GEO_IN_ISSUE`: Set to `true` to include requester geo info in issue body (defaults to `false`)
   
To create a GitHub token:
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "Avalon Hideout Mapper - Issue Creation")
4. Select the `repo` scope
5. Generate and copy the token
6. Add it to Netlify environment variables

The function will be available at: `/.netlify/functions/create-hideout-report` or `/api/create-hideout-report`

**Privacy Note**: By default, requester geo information is only logged server-side and not included in public issues. Enable `INCLUDE_GEO_IN_ISSUE` only if you have appropriate privacy policies in place.

See `netlify/functions/README.md` for detailed API documentation.

## Self-Hosted

### Using Node.js

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start the production server
npm run start
```

The app will be available at `http://localhost:3000`

### Using PM2 (Production)

```bash
# Install PM2 globally
npm install -g pm2

# Build the app
npm run build

# Start with PM2
pm2 start npm --name "avalon-hideout-mapper" -- start

# Save PM2 configuration
pm2 save

# Setup auto-restart on reboot
pm2 startup
```

### Using Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t avalon-hideout-mapper .
docker run -p 3000:3000 avalon-hideout-mapper
```

## Environment Variables

### Basic Functionality

This application doesn't require any environment variables for basic functionality. If you want to customize the GitHub repository URL, you can set:

```
NEXT_PUBLIC_REPO_URL=https://github.com/username/repo-name
```

And update `app/page.tsx` to use it:

```typescript
const repoUrl = process.env.NEXT_PUBLIC_REPO_URL || 'https://github.com/psykzz/avalon-hideout-mapper';
```

### Netlify Functions (Required for automated issue creation)

If deploying to Netlify and using the automated hideout report submission endpoint:

```
GITHUB_TOKEN=your_github_personal_access_token
```

This token should have `repo` scope to create issues in the repository. See the Netlify deployment section above for instructions on creating this token.

## Static Export (Optional)

If you want to deploy as a static site without a Node.js server:

1. Update `next.config.js`:
```javascript
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
}
```

2. Build:
```bash
npm run build
```

3. The static files will be in the `out` directory

Note: Static export doesn't support server-side features, but this app doesn't use any.

## CDN Configuration

For better performance, configure your CDN/hosting to:
- Cache static assets (JS, CSS, images) with long expiration
- Enable gzip/brotli compression
- Serve over HTTPS
- Enable HTTP/2

## Updating Data

After deploying, to update hideout data:

1. Update `data/hideouts.json` locally
2. Commit and push to GitHub
3. Your deployment platform will automatically rebuild and deploy

For Vercel/Netlify: Deploy happens automatically on push
For self-hosted: Run `git pull && npm run build && pm2 restart avalon-hideout-mapper`
