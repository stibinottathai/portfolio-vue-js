export const portfolioData = {
  personalInfo: {
    name: 'Stibin Augustine',
    title: 'Flutter Developer | Mobile & Web Application Engineer',
    summary: 'Flutter Developer with 4+ years of hands-on experience delivering scalable cross-platform mobile and web applications across fintech, GovTech, and enterprise domains. Built production apps for the Qatar Olympic Committee and UAE-based remittance platforms, with strong command of Clean Architecture, state management (Riverpod, Bloc, Provider), REST API integration, Firebase, and Supabase. Also experienced in web development with Next.js and React, and currently expanding into backend development with Python and Node.js. Based in Dubai and available to join immediately.',
    location: 'Bur Dubai, Dubai, UAE',
    visaStatus: 'Visit Visa - Available Immediately',
    email: 'stibinaugustine3047@gmail.com',
    phone: '+971 56 556 4136',
    website: 'stibin.online',
    github: 'https://github.com/stibinottathai',
    linkedin: 'https://in.linkedin.com/in/stibin-augustine-8075b1197',
    resumeUrl: '/cv.pdf'
  },
  skills: [
    {
      category: 'Languages',
      items: ['Dart', 'JavaScript', 'TypeScript', 'Python']
    },
    {
      category: 'Mobile (Primary)',
      items: ['Flutter (Mobile & Web)', 'Dart', 'Riverpod', 'Bloc', 'Provider']
    },
    {
      category: 'Web',
      items: ['Next.js', 'React.js', 'HTML5', 'CSS3', 'Tailwind CSS', 'Responsive Design']
    },
    {
      category: 'Backend (Learning)',
      items: ['Node.js', 'Python', 'REST API Integration']
    },
    {
      category: 'Architecture',
      items: ['Clean Architecture', 'MVVM', 'MVC', 'Component-Driven Design']
    },
    {
      category: 'Backend / BaaS',
      items: ['Firebase (Auth, Firestore, Realtime DB, FCM)', 'Supabase']
    },
    {
      category: 'State Management',
      items: ['Riverpod', 'Bloc', 'Provider', 'Context API', 'Zustand']
    },
    {
      category: 'Tools & DevOps',
      items: ['Git', 'GitHub', 'VS Code', 'Postman', 'Figma', 'Agile / Scrum']
    }
  ],
  experience: [
    {
      company: 'App Station (Subsidiary of Applab, Qatar)',
      role: 'Flutter Developer',
      period: 'Sep 2024 - Feb 2026',
      location: 'Qatar (Remote)',
      description: [
        'Architected and delivered Khadoom, a cross-platform Flutter mobile and web application for the Qatar Olympic Committee, streamlining HR operations including leave requests, approvals, delegations, and grievance management.',
        'Implemented Clean Architecture across presentation, domain, and data layers, ensuring scalability, testability, and long-term maintainability of a complex enterprise codebase.',
        'Adopted Riverpod for predictable, reactive state management, reducing UI-related bugs and improving developer productivity.',
        'Built a library of 30+ responsive, reusable UI components optimised for both Flutter Mobile and Web, cutting feature development time by approximately 25%.',
        'Integrated multiple REST APIs and engineered robust data-flow pipelines, ensuring reliable data consistency across the application.'
      ]
    },
    {
      company: 'Active Lobby',
      role: 'Flutter Developer',
      period: 'Oct 2022 - Sep 2024',
      location: 'Kerala, India (Remote - UAE Clients)',
      description: [
        'Co-developed LM Pay, a Flutter web and mobile cross-border remittance platform enabling UAE residents to transfer funds to 10+ countries with real-time multi-currency exchange rates.',
        'Implemented MVVM architecture with Provider, achieving clean separation between UI, business logic, and data layers and speeding up onboarding of new developers.',
        'Integrated payment gateway, KYC compliance, and transaction-tracking REST APIs, ensuring a secure, regulation-compliant money-transfer flow.',
        'Applied performance optimisation (lazy loading, widget caching) that improved app startup time and reduced frame drops on lower-end devices.',
        'Enforced security best practices including encrypted local storage, token refresh flows, and input validation to protect sensitive financial data.'
      ]
    },
    {
      company: 'Tazy Solutions',
      role: 'Flutter Developer',
      period: 'Jan 2022 - Oct 2022',
      location: 'Remote',
      description: [
        'Built a Flutter mobile app for internal blood donation management, covering donor registration, blood-group filtering, and request workflows for an organisational user base.',
        'Integrated Firebase Authentication, Firestore, and Realtime Database for secure, real-time data handling, and implemented Firebase Cloud Messaging (FCM) for push notifications.',
        'Applied Provider for efficient state management and delivered a clean, responsive UI following Material Design guidelines.'
      ]
    }
  ],
  projects: [
    {
      title: 'QuickReceipt',
      subtitle: 'Billing & Business Management App',
      tags: ['Flutter', 'Dart', 'Firebase'],
      description: 'All-in-one billing and business management solution built with Flutter for a fast, smooth experience on both Android and iOS. Designed for retailers, wholesalers, and small business owners, it brings invoicing, inventory, and daily operations into a single, easy-to-use app.',
      image: '/quick_receipt.jpg',
      websiteLink: '#',
      sourceLink: '#'
    },
    {
      title: 'Smart Wallet',
      subtitle: 'AI-Powered Expense Tracker',
      tags: ['Flutter', 'Dart', 'Firebase'],
      description: 'Intelligent expense tracker that records income and expenses in one place and uses AI to analyse spending patterns and income trends, delivering clear, actionable insights. Built-in reminders keep users on track with bills and financial goals.',
      image: '/spendly.png',
      websiteLink: '#',
      sourceLink: '#'
    },
    {
      title: 'Shop Ledger & Flow Tracker',
      subtitle: 'Operations & Menstrual Cycle Tracking',
      tags: ['Flutter', 'Dart', 'Firebase'],
      description: 'Two Flutter mobile apps: Shop Ledger digitises daily shop operations (sales, purchases, credits, and stock), while Flow Tracker is a menstrual cycle tracking app with period logging, cycle prediction, and reminders.',
      image: '/shop_ledger.png',
      websiteLink: '#',
      sourceLink: '#'
    },
    {
      title: 'ReVault (TechBasket)',
      subtitle: 'Refurbished Electronics E-Commerce',
      tags: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Firebase'],
      description: 'Full-stack e-commerce web app for refurbished electronics across 9 categories, featuring advanced search and filtering, Google Sign-In, multi-admin roles, cart persistence, order processing, and stock management. Deployed on Vercel.',
      image: '/quick_receipt.jpg',
      websiteLink: '#',
      sourceLink: '#'
    },
    {
      title: 'Daily Updates News',
      subtitle: 'Article Sharing Platform',
      tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
      description: 'Article publishing platform covering 9 content categories, backed by a Supabase (Postgres) data layer, with trending articles, category-based navigation, paginated feeds, SEO optimisation, and a responsive mobile-first UI.',
      image: '/Time_Tracker.png',
      websiteLink: '#',
      sourceLink: '#'
    },
    {
      title: 'Personal Password Manager',
      subtitle: 'Zero-Trust Encrypted Web App',
      tags: ['Next.js', 'TypeScript', 'Web Crypto API', 'Firebase'],
      description: 'Secure, client-side encrypted password manager on a zero-trust model; credentials are AES-256 encrypted in the browser before any data leaves the device. Features credential CRUD, masked fields with reveal toggle, and instant search/filter.',
      image: '/luckey_spinner.png',
      websiteLink: '#',
      sourceLink: '#'
    },
    {
      title: 'Wedding Invitation Website',
      subtitle: 'Bilingual Digital Invite',
      tags: ['Next.js', 'Tailwind CSS', 'Vercel'],
      description: 'Custom single-page bilingual digital wedding invitation with interactive guest features, family listings, venue maps, a Wishes Wall, and scroll animations. Deployed on Vercel with a custom domain.',
      image: '/dately.png',
      websiteLink: '#',
      sourceLink: '#'
    },
    {
      title: 'ATS AI CV Builder',
      subtitle: 'Gulf Tech Roles CV Builder',
      tags: ['Next.js', 'Firebase', 'TypeScript', 'Tailwind CSS'],
      description: 'Resume generation tool producing ATS-optimised, keyword-rich CVs that avoid common rejection points such as tables, multi-column layouts, and non-standard fonts, tailored for Gulf-market tech roles.',
      image: '/flow_track.png',
      websiteLink: '#',
      sourceLink: '#'
    }
  ],
  education: [
    {
      institution: 'Manipal University Jaipur',
      degree: 'Bachelor of Computer Applications (BCA) - Online',
      period: '2024 - 2027 (Expected)',
      coursework: 'Programming, Databases, Operating Systems, Cloud Computing'
    },
    {
      institution: 'NTTF',
      degree: 'Diploma in Computer Engineering (3 Years)',
      period: 'Completed'
    }
  ]
};
