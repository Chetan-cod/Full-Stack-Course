import { FeatureCard } from '../components/FeatureCard';
import { useAppConfig } from '../context/useAppConfig';

const features = [
  {
    title: 'Multi-stage Docker build',
    description: 'The React app is built with Node.js and only the static production files are copied into the final Nginx image.',
  },
  {
    title: 'Production-ready Nginx',
    description: 'Nginx serves the optimized bundle, enables gzip compression, and applies cache headers for fingerprinted assets.',
  },
  {
    title: 'Runtime environment variables',
    description: 'Container startup writes env-config.js so the same Docker image can point to different API endpoints per environment.',
  },
  {
    title: 'GitHub Actions pipeline',
    description: 'Every pull request runs tests, while pushes to main publish versioned images to GitHub Container Registry.',
  },
];

export function HomePage() {
  const { apiBaseUrl, appEnv } = useAppConfig();

  return (
    <main className="app-shell">
      <section className="hero">
        <span className="eyebrow">Experiment 9</span>
        <h1>React Docker Pipeline</h1>
        <p className="hero-copy">
          This React 18 frontend is built for production with Docker multi-stage builds, served by Nginx on port 8080,
          and prepared for automated delivery through GitHub Actions.
        </p>

        <div className="stats-grid">
          <article className="stat-card">
            <span>Container port</span>
            <strong>8080 / Nginx</strong>
          </article>
          <article className="stat-card">
            <span>Compression</span>
            <strong>Gzip enabled</strong>
          </article>
          <article className="stat-card">
            <span>Runtime API URL</span>
            <strong>{apiBaseUrl}</strong>
          </article>
          <article className="stat-card">
            <span>Runtime environment</span>
            <strong>{appEnv}</strong>
          </article>
        </div>

        <div className="content-grid">
          <div className="feature-grid">
            {features.map((feature) => (
              <FeatureCard key={feature.title} title={feature.title} description={feature.description} />
            ))}
          </div>

          <aside className="steps-card">
            <h2>Quick Run</h2>
            <ol>
              <li>Install frontend packages with npm.</li>
              <li>Build the production image with docker compose build.</li>
              <li>Start the container with docker compose up -d.</li>
              <li>Push to main to publish latest and SHA-tagged images to GHCR.</li>
            </ol>
          </aside>
        </div>

        <p className="footer-note">
          Update <code>.env</code> to change the API base URL or point the production deployment at a GHCR image.
        </p>
      </section>
    </main>
  );
}
