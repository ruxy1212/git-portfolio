const CONFIG = {
  github: {
    username: 'ruxy1212', // Your GitHub org/user name. (This is the only required config)
    portfolioRepository: 'git-portfolio', // Used for Stars and Issues tabs.
  },
  base: '', // Set this if you want to deploy in a subfolder. example: '/my-subfolder'
  title: 'Github Portfolio', // Title shown beside avatar in Header
  projects: {
    lastToFirst: true, // Display projects from last to first. Set to false to display from first to last.
    github: {
      display: true, // Display GitHub projects?
      mode: 'manual', // Mode can be: 'automatic' or 'manual'
      automatic: {
        sortBy: 'stars', // Sort projects by 'stars' or 'updated'
        limit: 8, // How many projects to display.
        exclude: {
          forks: true, // Forked projects will not be displayed if set to true.
          projects: [], // These projects will not be displayed. example: ['ruxy1212/my-project1', 'ruxy1212/my-project2']
        },
      },
      manual: {
        // Properties for manually specifying projects
        projects: ['ruxy1212/typing-speed-test'], // List of repository names to display. example: ['ruxy1212/my-project1', 'arifszn/my-project2']
      },
      // Optional API endpoint to get project explainers.
      explainerApi: {
        url: '/api/analyze',
        limit: 5,
      },
      // Optional API endpoint to get project screenshots. The url should accept a query param with the live link like `?url=https://my-project.com`
      screenshotApi: '/api/screenshot?url=',
    },
    external: {
      // To hide the `External Projects` section, keep it empty.
      projects: [
        {
          title: 'Tribute to Marcus Garvey',
          description: 'A tribute page honoring Marcus Garvey.',
          fullDescription:
            'A CodePen project dedicated to Marcus Garvey, leader of the Pan-Africanism movement and founder of the UNIA. The page celebrates his legacy and contributions.',
          year: '2022',
          stack: ['HTML', 'CSS'],
          categories: ['frontend'],
          media: ['https://ruxy.tech/images/projects/tribute.png'],
          videoUrl: '',
          link: 'https://codepen.io/Ruxy1212/pen/dyejMvj',
          repo: '',
        },
        {
          title: 'Smart Carousel/Slideshow',
          description: 'Directional carousel with hover-based navigation.',
          fullDescription:
            'A slideshow/carousel UI where directional navigators appear and highlight on hover, providing manual image navigation in a smooth, user-friendly interface.',
          year: '2022',
          stack: ['HTML', 'CSS', 'JavaScript'],
          categories: ['frontend'],
          media: ['https://ruxy.tech/images/projects/proj1.jpg'],
          videoUrl: '',
          link: '',
          repo: 'https://github.com/ruxy1212/Week6-7-Javascript',
        },
        {
          title: 'Facility Allocation System',
          description: 'Room allocation system based on multiple criteria.',
          fullDescription:
            'ZuriStay Allocator is a simple system that allocates facility rooms based on role, skillset, gender, and capacity. Built using only HTML, CSS, and JavaScript, it provides allocation statistics.',
          year: '2022',
          stack: ['HTML', 'CSS', 'JavaScript'],
          categories: ['frontend'],
          media: ['https://ruxy.tech/images/projects/proj3.jpg'],
          videoUrl: '',
          link: '',
          repo: 'https://github.com/ruxy1212/zuriStayAllocator',
        },
        {
          title: 'QR Code Generator App',
          description: 'QR code generator and scanner for events.',
          fullDescription:
            'QR-Go is a web app developed during Zuri Training that generates and manages QR codes for event tickets and private addresses. Includes a QR scanner and user dashboard for code management.',
          year: '2022',
          stack: ['HTML', 'CSS', 'JavaScript'],
          categories: ['frontend', 'backend'],
          media: ['https://ruxy.tech/images/projects/proj2.jpg'],
          videoUrl: '',
          link: 'https://project-qr-go.herokuapp.com',
          repo: '',
        },
        {
          title: 'Word Arithmetic API',
          description: 'An API for complex sentence-based arithmetic.',
          fullDescription:
            'This API interprets arithmetic operations from natural language input, performing calculations even when operands are indirectly referenced. Handles complex and varied expressions.',
          year: '2022',
          stack: ['PHP', 'Laravel'],
          categories: ['api', 'backend'],
          media: ['https://ruxy.tech/images/projects/proj5.jpg'],
          videoUrl: '',
          link: '',
          repo: 'https://github.com/ruxy1212/HNG-BackendTask1',
        },
        {
          title: 'GPT-3 in Laravel',
          description: 'AI-based fake news and conversation generator.',
          fullDescription:
            'A Laravel-based app that uses OpenAI to generate fake news headlines and respond to user prompts in a conversational manner.',
          year: '2022',
          stack: ['Laravel', 'PHP', 'OpenAI'],
          categories: [['backend', 'ml-ai']],
          media: ['https://ruxy.tech/images/projects/proj4.jpg'],
          videoUrl: '',
          link: '',
          repo: 'https://github.com/ruxy1212/fakenews',
        },
        {
          title: 'HangmanJS Game',
          description: 'Interactive Hangman game with advanced features.',
          fullDescription:
            'HangmanJS is a fun word-guessing game that features multiple game modes, difficulty levels, sound effects, a clickable keyboard, and 3D stick figures.',
          year: '2023',
          stack: ['JavaScript', 'HTML', 'CSS'],
          categories: ['frontend', 'game-dev'],
          media: ['https://ruxy.tech/images/projects/proj0.jpg'],
          videoUrl: '',
          link: 'https://ruxy1212.github.io/hangmanjs',
          repo: 'https://github.com/ruxy1212/hangmanjs',
        },
        {
          title: 'Pure Gallery',
          description: 'Drag and drop image gallery with Firebase.',
          fullDescription:
            'A responsive image gallery app built in ReactJS with drag-and-drop support and search functionality. Uses Firebase for authentication and storage.',
          year: '2023',
          stack: ['React', 'Tailwind', 'Firebase'],
          categories: ['frontend'],
          media: ['https://ruxy.tech/images/projects/proj8.png'],
          videoUrl: '',
          link: 'https://puregallery.netlify.app',
          repo: 'https://github.com/ruxy1212/gallery-truck',
        },
        {
          title: 'RaiChat',
          description: 'A Laravel chatbot using GPT-3.5 and Whisper AI.',
          fullDescription:
            "RaiChat is a chatbot that combines OpenAI's GPT-3.5 for responses and Whisper AI for voice transcription.",
          year: '2023',
          stack: [
            'Laravel',
            'PHP',
            'JavaScript',
            'OpenAI GPT-3.5',
            'Whisper AI',
          ],
          categories: ['backend', 'ml-ai', 'realtime'],
          media: ['https://ruxy.tech/images/projects/proj7.png'],
          videoUrl: '',
          link: 'https://raichat.up.railway.app',
          repo: 'https://github.com/ruxy1212/aiconvchat',
        },
        {
          title: 'Haiyrea',
          description: 'A personalized news chatbot.',
          fullDescription:
            'Haiyrea is a conversational chatbot delivering real-time, tailored news updates from credible sources.',
          year: '2023',
          stack: ['HTML', 'CSS', 'JavaScript', 'PHP', 'OpenAI GPT-4'],
          categories: ['fullstack', 'ml-ai', 'realtime'],
          media: ['https://ruxy.tech/images/projects/proj9.png'],
          videoUrl: '',
          link: 'https://haiyrea.000webhostapp.com',
          repo: 'https://github.com/ruxy1212/haiyrea',
        },
        {
          title: 'Code Sensei',
          description: 'An AI-powered coding mentor for real-time assistance.',
          fullDescription:
            'Code Sensei is an interactive coding assistant that leverages Gemini AI to provide contextual help, guidance, and solutions to developers.',
          year: '2024',
          stack: ['Typescript', 'Tailwind CSS', 'Firebase', 'Gemini AI'],
          categories: ['frontend', 'ml-ai'],
          media: [
            'https://ruxy.tech/images/projects/codesensei.png',
            'https://ruxy.tech/images/projects/codesensei-1.png',
            'https://ruxy.tech/images/projects/codesensei-2.png',
          ],
          videoUrl: '',
          link: 'https://codesensei-web.vercel.app/',
          repo: '',
        },
        {
          title: 'Devlinks',
          description: 'A social link-sharing dashboard for developers.',
          fullDescription:
            'Devlinks allows developers to centralize and customize their social presence using a clean, responsive interface.',
          year: '2024',
          stack: ['Next.js', 'Tailwind CSS', 'Firebase', 'Framer Motion'],
          categories: ['frontend'],
          media: [
            'https://ruxy.tech/images/projects/devlink.png',
            'https://ruxy.tech/images/projects/devlink-1.png',
            'https://ruxy.tech/images/projects/devlink-2.png',
          ],
          videoUrl: 'https://ruxy.tech/images/projects/devlink-2.mp4',
          link: 'https://devlinks-go.vercel.app/',
          repo: 'https://github.com/ruxy1212/link-sharing',
        },
        {
          title: 'Delve',
          description: 'A language learning game powered by AI and 3D.',
          fullDescription:
            'Delve is an immersive language learning platform that uses OpenAI to generate adaptive content across skill levels.',
          year: '2024',
          stack: [
            'Next.js',
            'Typescript',
            'Shadcn',
            'Zustand',
            'OpenAI',
            'GSAP',
          ],
          categories: ['frontend', 'backend', 'ml-ai', 'game-dev'],
          media: [
            'https://ruxy.tech/images/projects/delve.png',
            'https://ruxy.tech/images/projects/delve-1.png',
            'https://ruxy.tech/images/projects/delve-2.png',
          ],
          videoUrl: '',
          link: 'https://delve.fun',
          repo: '',
        },
        {
          title: 'Starlight VSCode Theme',
          description: 'A vibrant, modern theme for Visual Studio Code.',
          fullDescription:
            'Starlight is a custom VS Code theme extension offering a balanced aesthetic with carefully tuned syntax highlighting.',
          year: '2025',
          stack: ['Vite', 'VS Code Extension'],
          categories: ['cli', 'library'],
          media: [
            'https://ruxy.tech/images/projects/starlight.png',
            'https://ruxy.tech/images/projects/starlight-1.png',
          ],
          videoUrl: '',
          link: 'https://marketplace.visualstudio.com/items?itemName=RussellOje.ruxy1212-starlight-theme',
          repo: '',
        },
        {
          title: 'Edulaw',
          description: 'An e-learning platform simplifying legal education.',
          fullDescription:
            'Edulaw is a web-based educational platform tailored for law students and educators.',
          year: '2025',
          stack: ['JavaScript', 'PHP', 'React', 'Laravel', 'MongoDB'],
          categories: ['fullstack', 'ml-ai', 'cms-content'],
          media: [
            'https://ruxy.tech/images/projects/edulaw.png',
            'https://ruxy.tech/images/projects/edulaw-1.png',
            'https://ruxy.tech/images/projects/edulaw-2.png',
          ],
          videoUrl: '',
          link: 'https://www.easyedutech.com/edulaw',
          repo: '',
        },
        {
          title: 'Cardmajor',
          description:
            'A platform for purchasing secure, customizable virtual prepaid cards.',
          fullDescription:
            'Cardmajor offers a streamlined system for buying virtual cards that prioritize efficiency, security, and user privacy.',
          year: '2025',
          stack: ['Laravel/PHP', 'JavaScript', 'Blockchain'],
          categories: ['fullstack', 'ecommerce', 'web3'],
          media: [
            'https://ruxy.tech/images/projects/cardmajor-1.png',
            'https://ruxy.tech/images/projects/cardmajor-2.png',
            'https://ruxy.tech/images/projects/cardmajor-3.png',
          ],
          videoUrl: '',
          link: 'https://sandbox.majorback.com',
          repo: '',
        },
        {
          title: 'Animated Kangaroo',
          description: 'Animated landing page demo for connectivity solutions.',
          fullDescription:
            'Animated Kangaroo is a demo of the landing page of Valid Trusted Connectivity platform, replicating the UI and animations using Tailwind, GSAP and Framer Motion.',
          year: '2025',
          stack: ['Next.js', 'TypeScript', 'Framer Motion', 'GSAP'],
          categories: ['frontend'],
          media: [
            'https://ruxy.tech/images/projects/kangaroo.jpg',
            'https://ruxy.tech/images/projects/kangaroo-1.jpg',
          ],
          videoUrl: 'https://ruxy.tech/images/projects/kangaroo-3.mp4',
          link: 'https://animated-kangaroo.vercel.app/',
          repo: 'https://github.com/ruxy1212/animated-kangaroo',
        },
        {
          title: 'Snipfair',
          description: 'Book verified beauty professionals.',
          fullDescription:
            'Snipfair brings trusted, pre-vetted professionals directly to your door for services like wig installation, nail care, braids, and more.',
          year: '2025',
          stack: [
            'React.js',
            'TypeScript',
            'PHP',
            'Laravel',
            'Inertia.js',
            'Pusher',
          ],
          categories: ['fullstack', 'realtime'],
          media: [
            'https://ruxy.tech/images/projects/snipfair.jpg',
            'https://ruxy.tech/images/projects/snipfair-1.jpg',
            'https://ruxy.tech/images/projects/snipfair-2.jpg',
          ],
          videoUrl: '',
          link: 'https://snipfair.com',
          repo: '',
        },
      ],
    },
  },
  seo: {
    title: 'Portfolio of Russell Oje',
    description:
      'A software engineer passionate about building scalable applications and exploring decentralized technologies, and providing customer support.',
    imageURL: 'https://ruxy.tech/images/og.jpg',
    siteURL: 'https://portfolio.ruxy.tech', // required if image URL is relative
  },
  social: {
    linkedin: 'russelloje',
    x: 'russell_oje',
    mastodon: '',
    researchGate: '',
    facebook: '',
    instagram: '',
    reddit: '',
    threads: '',
    youtube: '',
    udemy: '',
    dribbble: '',
    behance: '',
    medium: 'prophetr',
    dev: 'russelloje',
    stackoverflow: '',
    discord: '',
    telegram: '',
    website: 'https://ruxy.tech',
    phone: '',
    email: '',
  },
  resume: {
    fileUrl: 'https://ruxy.tech/files/russell_oje_fullstack_resume.pdf', // Empty fileUrl will hide the `Download Resume` button.
  },
  skills: [
    'PHP',
    'Laravel',
    'JavaScript',
    'TypeScript',
    'React.js',
    'Next.js',
    'Node.js',
    'MySQL',
    'MongoDB',
    'PostgreSQL',
    'Git',
    'Docker',
    'Tailwind CSS',
    'Framer Motion',
    'GSAP',
    'OpenAI',
    'Firebase',
    'Inertia.js',
    'Pusher',
  ],
  experiences: [
    {
      company: 'Easy Edu Tech',
      position: 'Backend Developer',
      from: '2024',
      to: 'Present',
      companyLink: 'https://www.easyedutech.com',
      description:
        'Backend development for Edulaw e-learning platform. Integrated AI agents and advanced learning methods using Laravel and MongoDB.',
    },
    {
      company: 'Nigerian Navy Ship QUORRA',
      position: 'Software Engineer / Tutor',
      from: '2023',
      to: '2024',
      companyLink: '',
      description:
        'Provided professional training in Web Design and Python Programming. Developed LMS and Computer-Based Examination platform.',
    },
    {
      company: 'Various Clients / Freelance',
      position: 'Fullstack Developer',
      from: '2023',
      to: 'Present',
      companyLink: '',
      description:
        'Designed Laravel REST APIs with MongoDB, JWT auth. Built dynamic React/Next.js frontends with GSAP, Framer Motion, Stripe integration, and AI features.',
    },
  ],
  certifications: [
    {
      name: 'HNG Frontend Internship',
      body: 'HNG 2024 Frontend Internship',
      year: '2024',
      link: 'https://ruxy.tech/images/credentials/hng_fe24.png',
    },
    {
      name: 'AI Engineer Path',
      body: 'Scrimba AI Engineer Path - Completed 128 lessons',
      year: '2025',
      link: 'https://ruxy.tech/images/credentials/ai_engineer.png',
    },
  ],
  educations: [
    {
      institution: 'University of Benin',
      degree: "Bachelor's Degree in Computer Engineering",
      from: '2015',
      to: '2021',
    },
  ],
  publications: [],
  // Display articles from your medium or dev account. (Optional)
  blog: {
    source: 'medium', // medium | dev
    username: 'prophetr', // to hide blog section, keep it empty
    limit: 2, // How many articles to display. Max is 10.
  },
  contact: {
    endpoint: '/api/send-email', // Endpoint to receive contact form submissions. Should accept POST requests with name, email, and message in the body. Set to empty string '' to hide contact form.
  },
  googleAnalytics: {
    id: '', // GA3 tracking id/GA4 tag id UA-XXXXXXXXX-X | G-XXXXXXXXXX
  },
  // Track visitor interaction and behavior. https://www.hotjar.com
  hotjar: { id: '', snippetVersion: 6 },
  themeConfig: {
    defaultTheme: 'caramellatte',

    // Hides the switch in the navbar
    // Useful if you want to support a single color mode
    disableSwitch: false,

    // Should use the prefers-color-scheme media-query,
    // using user system preferences, instead of the hardcoded defaultTheme
    respectPrefersColorScheme: false,

    // Display the ring in Profile picture
    displayAvatarRing: true,

    // Available themes. To remove any theme, exclude from here.
    themes: {
      dark: [
        'black', // pure black
        'dark', // default dark
        'night', // deep blue-gray
        'dracula', // purple/black
        'abyss', // muted dark
        'luxury', // dark with subtle contrast
        'dim', // muted dark gray
        'coffee', // warm dark brown
        'sunset', // dark with warm tones
        'synthwave', // neon purple/pink
        'forest', // dark earthy green
        'halloween', // orange/yellow dark
        'business', // dark professional palette
      ],
      light: [
        'light', // pure white
        'cupcake', // soft pastel white
        'bumblebee', // yellowish accents on light
        'emerald', // bright green on light
        'corporate', // professional clean light
        'silk', // soft light gray
        'procyon', // light blue-gray
        'garden', // soft green light
        'aqua', // blue/cyan light
        'lofi', // muted soft light
        'nord', // cold light gray/blue
        'pastel', // soft pastels
        'fantasy', // colorful pastels
        'winter', // light bluish-gray
        'acid', // bright neon on light
        'cmyk', // light with bright accent
        'retro', // muted retro light
        'wireframe', // minimal light gray/white
        'autumn', // warm light browns
        'lemonade', // soft yellow pastel
        'valentine', // pink/red pastel
        'caramellatte', // cream/light beige palette
        'cyberpunk', // neon on light yellow
      ],
    },
  },

  // Cache configuration to reduce rate limits
  // By default, data is cached for 30 minutes (1800000 ms). You can adjust this value as needed.
  cache: {
    enabled: true,
    ttl: 10 * 60 * 1000, // 10 minutes in milliseconds
  },

  // Optional Footer. Supports plain text or HTML.
  footer: `Made with <a 
      class="text-primary font-bold hover:underline" href="https://github.com/ruxy1212/git-portfolio"
      target="_blank"
      rel="noreferrer"
    >Git-Portfolio</a>. To create your portfolio in minutes <a 
      class="text-primary font-bold hover:underline" href="https://github.com/ruxy1212/git-portfolio/fork"
      target="_blank"
      rel="noreferrer"
    >Click here</a>.`,

  enablePWA: true,
};

export default CONFIG;
