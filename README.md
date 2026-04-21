# Git Portfolio

<p align="center">
	<img src="https://github.com/user-attachments/assets/570151f4-9112-46e1-b5a4-87796b825f0d" alt="Git Portfolio preview" width="60%" />
</p>

<p align="center">
	<a href="https://github.com/ruxy1212/git-portfolio/issues"><img src="https://img.shields.io/github/issues/ruxy1212/git-portfolio" alt="Issues" /></a>
	<a href="https://github.com/ruxy1212/git-portfolio/stargazers"><img src="https://img.shields.io/github/stars/ruxy1212/git-portfolio" alt="Stars" /></a>
	<a href="https://github.com/ruxy1212/git-portfolio/blob/main/LICENSE"><img src="https://img.shields.io/github/license/ruxy1212/git-portfolio" alt="License" /></a>
</p>

Git Portfolio is a modern, GitHub-driven portfolio app built with **Next.js + Gemini + TypeScript + Tailwind v4 + DaisyUI**.

## Highlights

- GitHub-style navigation with internal tabs and external GitHub actions
- Dynamic portfolio data fetched from GitHub API (profile, repositories, stars, README)
- Unified Projects tab (GitHub projects + external projects in a single expandable list)
- Optional repository explainer API for AI summaries and detected tech stack
- Search bar with keyboard shortcut (`/`), grouped results, and cross-section indexing
- Contact form endpoint integration in the Issues tab
- Publications + blog aggregation (`medium` or `dev.to`)
- 30+ themes (including custom theme entries), optional theme switch lock
- SEO metadata injection, optional Google Analytics + Hotjar, optional PWA support

## Application Tabs

- **Overview**: profile card, skills, social links, resume download, and rendered repository README
- **Insights**: education, work experience, certifications
- **Projects**: merged GitHub/external projects with expandable detail cards and media gallery
- **Packages**: publications and blog posts
- **Issues**: contribution CTA (GitHub issues) + configurable contact form

## Tech Stack

- `next.js`, `serwist`
- `typescript`, `@google/genai`
- `@octokit/graphql`, `@primer/octicons-react`
- `tailwindcss` v4, `daisyui`
- `axios`, `date-fns`, `bprogress/next`
- `@arifszn/blog-js` for Medium/dev article feeds

## Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm

### Install

```bash
git clone https://github.com/ruxy1212/git-portfolio.git
cd git-portfolio

# choose one
pnpm install
# or
npm install
```

### Run locally

```bash
# choose one
pnpm run dev
# or
npm run dev
```

Open: `http://localhost:5173`

## Scripts

- `dev` - start Vite dev server
- `build` - type-check + production build
- `preview` - preview production build
- `lint` / `lint:fix` - ESLint
- `prettier` / `prettier:fix` - Prettier checks/fixes

## Configuration

All project behavior is controlled via **`portfolio.config.ts`**.

### Minimal configuration

```ts
const CONFIG = {
	github: {
		username: 'your-github-username',
	},
};

export default CONFIG;
```

### Core configuration map

#### `github`

- `username` (**required**)
- `repositoryOwner` (defaults to `username`)
- `defaultRepository` (README source repository)
- `projectRepository` (repository used for star/issues links and repo header actions)

#### `base`

Vite base path for deployment:

- `"/"` for root domain deploys
- `"/<repo-name>/"` for GitHub Pages subpath deploys

#### `projects.github`

- `display`: enable/disable GitHub project section
- `mode`: `automatic` or `manual`
- `automatic.sortBy`: `stars` or `updated`
- `automatic.limit`: number of repos fetched
- `automatic.exclude.forks`: include/exclude forked repos
- `automatic.exclude.projects`: explicit repo exclusions
- `manual.projects`: explicit repo list (`owner/repo` format)
- `explainerApi.url`: optional API endpoint to enrich repos
- `explainerApi.limit`: max repos sent for enrichment
- `screnshotApi`: optional API endpoint to return a screenshot of the project page

> Explainer API request/response format expected by this app:

```json
POST /api/analyze
{
	"repos": ["owner/repo1", "owner/repo2"],
	"forceRefresh": false
}

{
	"results": [
		{
			"repo": "owner/repo1",
			"summary": "One-line project summary",
			"technologies": ["React", "TypeScript"],
      "error"?: ""
		}
	]
}
```

> Screenshot API request/response format expected by this app:

```json
GET /api/screenshot
{
	"url": "https://website.com"
}
```

Response: Image file
Usage: `src={'/api/screenshot/'+${projectLink}}`

#### `projects.external`

Add non-GitHub projects with:

- `title`, `description`, `fullDescription`
- `year`, 
- `stack` (array of langauges/technologies)
- `categories` (array of categories)
- `media` (array of image URLs)
- `videoUrl` (reserved field)
- `link`, `repo`

#### `social`

Supports: LinkedIn, X, Mastodon, ResearchGate, Facebook, Instagram, Reddit, Threads, YouTube, Udemy, Dribbble, Behance, Medium, dev, Stack Overflow, Telegram, Discord, website, phone, email.

#### `resume`

- `fileUrl`: when set, shows **Download Resume** button

#### `insights` content

- `skills`
- `experiences`
- `educations`
- `certifications`

#### `packages` content

- `publications`
- `blog` (`source: 'medium' | 'dev'`, `username`, `limit` up to 10)

#### Contact form

- `contact.endpoint`

> Leave the contact.endpoint value as '', to hide the contact form

Payload sent from the Issues tab:

```json
{
	"fullName": "Jane Doe",
	"email": "jane@example.com",
	"message": "Hello",
	"passKey": ""
}
```

#### Analytics and tracking

- `googleAnalytics.id`
- `hotjar.id`
- `hotjar.snippetVersion`

#### Theme configuration

- `themeConfig.defaultTheme`
- `themeConfig.disableSwitch`
- `themeConfig.respectPrefersColorScheme`
- `themeConfig.displayAvatarRing`
- `themeConfig.themes`

Theme tokens and custom themes are defined in `src/assets/index.css`.

#### Other toggles

- `seo.title`, `seo.description`, `seo.imageURL`
- `footer` (HTML or plain text)
- `enablePWA`
- `cache`

## Search Behavior

Search indexes content across:

- Overview: skills, social handles/values, profile bio
- Projects: project name, short description, stack, year
- Insights: experiences, educations, certifications
- Packages: publications

Usage:

- Type at least 2 characters
- Press `/` to focus search quickly
- Use arrow keys + Enter in dropdown results

## Deployment

Build command:

```bash
npm run build
```

Ensure `base` is `/` unless your host serves under a subpath.

### Docker

`docker-compose.yml` is included for local containerized development:

```bash
docker compose up --build
```

## Contributing

Contributions are welcome. See:

- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)

## License

MIT - see [LICENSE](./LICENSE).

## Acknowledgment

This project is a derivative of [GitProfile](https://github.com/arifszn/gitprofile) by arifszn. The original foundation, configuration structure, and theme logic are credited to the original author. Additional features and modifications were implemented by ruxy1212.
