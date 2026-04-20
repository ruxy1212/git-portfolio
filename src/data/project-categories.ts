export const PROJECT_CATEGORIES = [
  {
    name: 'Frontend',
    slug: 'frontend',
    howToSpot:
      'Look for UI component files, HTML/CSS, a framework like React/Vue/Svelte/Angular, or a pages/views/components folder with no backend logic.',
  },
  {
    name: 'Backend',
    slug: 'backend',
    howToSpot:
      'Look for server-side entry points (server.js, app.py, main.go), REST/GraphQL route definitions, database models or migrations, and no significant UI code.',
  },
  {
    name: 'Full-Stack',
    slug: 'fullstack',
    howToSpot:
      'Look for both a frontend layer (UI components or a client/ folder) and a backend layer (API routes, server files, DB models) co-existing in the same repo.',
  },
  {
    name: 'Mobile',
    slug: 'mobile',
    howToSpot:
      'Look for a mobile framework like React Native, Flutter, Swift/SwiftUI, Kotlin/Jetpack Compose, Expo config, or an AndroidManifest.xml / Info.plist file.',
  },
  {
    name: 'API / REST',
    slug: 'api',
    howToSpot:
      'Look for route or endpoint definitions (routes/, controllers/, openapi.yaml, swagger.json) and HTTP method handlers (GET, POST, PUT, DELETE) with no or minimal frontend.',
  },
  {
    name: 'DevOps / Infrastructure',
    slug: 'devops',
    howToSpot:
      'Look for Dockerfiles, docker-compose.yml, Kubernetes manifests, Terraform/Pulumi/Ansible files, CI/CD configs (.github/workflows, .gitlab-ci.yml, Jenkinsfile).',
  },
  {
    name: 'CLI Tool',
    slug: 'cli',
    howToSpot:
      'Look for a main entry point that parses command-line arguments (argparse, commander, cobra, clap), a bin/ directory, or a package published as a command-line binary.',
  },
  {
    name: 'Machine Learning / AI',
    slug: 'ml-ai',
    howToSpot:
      'Look for model training scripts, datasets, notebooks (.ipynb), ML framework imports (TensorFlow, PyTorch, scikit-learn, Keras), or model serialization files (.pkl, .h5, .pt).',
  },
  {
    name: 'Data Science / Analytics',
    slug: 'data-science',
    howToSpot:
      'Look for Jupyter notebooks, data cleaning or EDA scripts, visualization libraries (matplotlib, seaborn, plotly), and CSV/Excel/JSON datasets in the repo.',
  },
  {
    name: 'Database / Data Engineering',
    slug: 'database',
    howToSpot:
      'Look for SQL migration files, ORM schema definitions, ETL pipeline scripts, data warehouse configs, or tools like dbt, Airflow, Spark, or Kafka.',
  },
  {
    name: 'Browser Extension',
    slug: 'browser-extension',
    howToSpot:
      "Look for a manifest.json with 'manifest_version', background scripts, content_scripts, or popup/options HTML files typical of a Chrome/Firefox extension.",
  },
  {
    name: 'Desktop App',
    slug: 'desktop',
    howToSpot:
      'Look for Electron, Tauri, Qt, wxWidgets, or platform-native GUI frameworks; a main process / main window entry point; and packaging configs for macOS/Windows/Linux.',
  },
  {
    name: 'Game Development',
    slug: 'game-dev',
    howToSpot:
      'Look for a game engine config (Unity .unity scenes, Unreal .uproject, Godot .tscn), game loop logic, sprite/asset folders, or a physics/collision system.',
  },
  {
    name: 'Open Source Library / Package',
    slug: 'library',
    howToSpot:
      "Look for a published package config (package.json with 'main'/'exports', setup.py, Cargo.toml with [lib]), a src/ library folder, changelog, and no runnable app entry point.",
  },
  {
    name: 'Authentication / Security',
    slug: 'auth-security',
    howToSpot:
      'Look for OAuth/JWT/session handling code, password hashing, penetration testing scripts, vulnerability scanners, or security-focused middleware and policies.',
  },
  {
    name: 'CMS / Blog / Content Site',
    slug: 'cms-content',
    howToSpot:
      'Look for a CMS framework (WordPress, Strapi, Contentful config, Sanity schema), markdown content folders, static site generators (Gatsby, Hugo, Astro, Jekyll), or a blog posts directory.',
  },
  {
    name: 'E-Commerce',
    slug: 'ecommerce',
    howToSpot:
      'Look for product catalog models, cart and checkout logic, payment gateway integrations (Stripe, PayPal, Flutterwave), or order management workflows.',
  },
  {
    name: 'Real-Time / WebSocket',
    slug: 'realtime',
    howToSpot:
      'Look for WebSocket or Socket.IO usage, server-sent events, live chat or notification logic, or real-time data streaming code.',
  },
  {
    name: 'Blockchain / Web3',
    slug: 'web3',
    howToSpot:
      'Look for smart contracts (Solidity .sol files), Web3.js/Ethers.js imports, wallet connection logic, NFT minting code, or a Hardhat/Truffle/Foundry config.',
  },
  {
    name: 'Cloud / Serverless',
    slug: 'serverless',
    howToSpot:
      'Look for serverless.yml, AWS SAM template, Firebase functions, Vercel/Netlify function files, or cloud provider SDK calls as the primary compute pattern.',
  },
  {
    name: 'Testing / QA',
    slug: 'testing',
    howToSpot:
      'Look for a repo whose primary purpose is test suites, end-to-end tests (Cypress, Playwright, Selenium), load testing scripts, or a dedicated QA automation framework.',
  },
  {
    name: 'UI Component Library / Design System',
    slug: 'ui-library',
    howToSpot:
      'Look for a Storybook config (stories/ folder, .storybook/), a collection of reusable UI components with their own documentation, and no full application pages.',
  },
  {
    name: 'Documentation / Knowledge Base',
    slug: 'docs',
    howToSpot:
      'Look for a docs/ or wiki/ folder as the primary content, a documentation framework (Docusaurus, MkDocs, VitePress, Nextra), or a README-heavy repo with no significant code.',
  },
  {
    name: 'Automation / Scripting',
    slug: 'automation',
    howToSpot:
      'Look for scripts that automate repetitive tasks — file processing, scheduled jobs, web scraping (BeautifulSoup, Puppeteer, Scrapy), GitHub Actions bots, or cron-based workflows.',
  },
  {
    name: 'IoT / Embedded Systems',
    slug: 'iot-embedded',
    howToSpot:
      'Look for microcontroller code (Arduino sketches, MicroPython, Raspberry Pi GPIO), hardware sensor interfacing, firmware files, or MQTT/CoAP communication protocols.',
  },
  {
    name: 'Portfolio / Personal Site',
    slug: 'portfolio',
    howToSpot:
      "Look for a site that presents the owner's projects, skills, and contact info — often with a hero section, about page, and project showcase, deployed as a static or JAMstack site.",
  },
];
