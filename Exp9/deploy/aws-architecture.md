# Suggested Deployment Flow

## Components

- GitHub Actions runs lint, tests, and production build steps.
- Docker image is pushed to GitHub Container Registry (`ghcr.io`).
- An EC2 instance pulls the latest image and runs it with Docker Compose.
- Slack receives a success notification after image publication.

## Request Flow

1. Developer pushes code to GitHub.
2. GitHub Actions validates the React project.
3. The workflow publishes the Docker image to GHCR.
4. EC2 pulls the updated image and exposes the app on port `8080`.
5. Nginx serves the static bundle with gzip and cache headers.

