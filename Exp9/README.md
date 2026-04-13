# React Docker + GitHub Actions CI/CD

This experiment shows how to containerize a React 18 application with a Docker multi-stage build and publish it through GitHub Actions to GitHub Container Registry (`ghcr.io`).

## Project Structure

```text
Exp9/
├── .github/workflows/ci-cd.yml
├── deploy/
│   ├── aws-architecture.md
│   └── ec2/
│       ├── docker-compose.prod.yml
│       └── setup.sh
├── frontend/
│   ├── docker-entrypoint.d/40-env-config.sh
│   ├── public/env-config.js
│   ├── src/
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── eslint.config.js
│   ├── index.html
│   ├── nginx.conf
│   ├── package.json
│   ├── vite.config.js
│   └── vitest.config.js
├── .env.example
├── .env
└── docker-compose.yml
```

## Step-by-Step Implementation

### 1. Install project dependencies

```powershell
cd D:\GitHub\Full-Stack-Course\Exp9\frontend
npm install
```

### 2. Start the React app locally

```powershell
npm run dev
```

Open `http://localhost:5173`.

### 3. Build the production image

```powershell
cd D:\GitHub\Full-Stack-Course\Exp9
docker compose build
```

The Docker build uses:

1. `node:20-alpine` as the build stage
2. `nginx:alpine` as the runtime stage
3. a custom Nginx config for gzip, SPA routing, and cache headers

### 4. Run the container on port 8080

```powershell
docker compose up -d
```

Open `http://localhost:8080`.

### 5. Verify the production container

```powershell
docker images
docker ps
docker logs exp9-frontend
```

Expected outcome:

- final runtime image is usually well under `100 MB`
- app is served by Nginx on port `8080`
- static assets use long-term cache headers
- gzip compression is enabled

### 6. Configure GitHub Actions secrets and variables

Add these in your GitHub repository settings:

- `Settings > Secrets and variables > Actions > Secrets`
- `SLACK_WEBHOOK_URL`

Optional repository variable:

- `VITE_API_BASE_URL`

### 7. Push to GitHub and trigger CI/CD

The workflow will:

1. run lint, tests, and build on pull requests
2. build and push the Docker image to `ghcr.io` on `main`
3. tag the image as `latest` and the short commit SHA
4. send a Slack notification after a successful image publish

### 8. Pull from GHCR in production

Update `GHCR_IMAGE` in `.env` or `deploy/ec2/docker-compose.prod.yml`, then run:

```bash
docker compose -f deploy/ec2/docker-compose.prod.yml pull
docker compose -f deploy/ec2/docker-compose.prod.yml up -d
```

## Notes on Environment Variables

This setup supports both build-time and runtime variables:

- `VITE_API_BASE_URL` is available during the React build
- `API_BASE_URL` and `APP_ENV` are injected at container startup through `env-config.js`

That means you can reuse the same Docker image across environments without rebuilding it.

