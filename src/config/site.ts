export const siteConfig = {
  // ====== CUSTOMIZE THESE FOR EACH TOOL ======
  name: "Chmod Calculator",
  title: "Chmod Calculator - Visual Unix File Permission Calculator",
  description:
    "Calculate Unix file permissions visually. Convert between numeric (755) and symbolic (rwxr-xr-x) chmod formats instantly. Free online tool for developers and sysadmins.",
  url: "https://chmod-calculator.tools.jagodana.com",
  ogImage: "/opengraph-image",

  // Header
  headerIcon: "Shield", // lucide-react icon name
  // Brand gradient colors for Tailwind are in globals.css (--brand / --brand-accent)
  brandAccentColor: "#06b6d4", // hex accent for OG image gradient (must match --brand-accent in globals.css)

  // SEO
  keywords: [
    "chmod calculator",
    "unix permissions",
    "file permissions",
    "linux chmod",
    "rwx calculator",
    "permission calculator",
    "octal permissions",
    "symbolic permissions",
    "chmod 755",
    "chmod 644",
  ],
  applicationCategory: "DeveloperApplication",

  // Theme
  themeColor: "#10b981",

  // Branding
  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  // Social Profiles (for Organization schema sameAs)
  socialProfiles: [
    "https://twitter.com/jagodana",
  ],

  // Links
  links: {
    github: "https://github.com/Jagodana-Studio-Private-Limited/chmod-calculator",
    website: "https://jagodana.com",
  },

  // Footer
  footer: {
    about:
      "A free visual chmod calculator for developers and sysadmins. Instantly convert between numeric and symbolic Unix file permission formats.",
    featuresTitle: "Features",
    features: [
      "Visual checkbox permission builder",
      "Numeric ↔ symbolic conversion",
      "Common permission presets",
      "One-click chmod command copy",
    ],
  },

  // Hero Section
  hero: {
    badge: "Free Developer Tool",
    titleLine1: "Calculate Unix Permissions",
    titleGradient: "Visually",
    subtitle:
      "Stop guessing chmod values. Set permissions with checkboxes, enter numeric codes, or pick a preset — and instantly see the numeric value, symbolic notation, and ready-to-run chmod command.",
  },

  // Feature Cards (shown on homepage)
  featureCards: [
    {
      icon: "⚡",
      title: "Instant Conversion",
      description:
        "Toggle any permission bit and see the numeric code and symbolic notation update in real-time. No page reloads, no servers.",
    },
    {
      icon: "🎛️",
      title: "Bidirectional Input",
      description:
        "Type a numeric value like 755 and the checkboxes snap to match, or click checkboxes and watch the number update instantly.",
    },
    {
      icon: "📋",
      title: "Ready-to-Run Commands",
      description:
        "Get a complete chmod command with one click. Copy the numeric value, symbolic string, or the full shell command to your clipboard.",
    },
  ],

  // Related Tools (cross-linking to sibling Jagodana tools for internal SEO)
  relatedTools: [
    {
      name: "Regex Playground",
      url: "https://regex-playground.jagodana.com",
      icon: "🧪",
      description: "Build, test & debug regular expressions in real-time.",
    },
    {
      name: "Favicon Generator",
      url: "https://favicon-generator.jagodana.com",
      icon: "🎨",
      description: "Generate all favicon sizes + manifest from any image.",
    },
    {
      name: "Sitemap Checker",
      url: "https://sitemap-checker.jagodana.com",
      icon: "🔍",
      description: "Discover and validate sitemaps on any website.",
    },
    {
      name: "Screenshot Beautifier",
      url: "https://screenshot-beautifier.jagodana.com",
      icon: "📸",
      description: "Transform screenshots into beautiful images.",
    },
    {
      name: "Color Palette Explorer",
      url: "https://color-palette-explorer.jagodana.com",
      icon: "🎭",
      description: "Extract color palettes from any image.",
    },
    {
      name: "Logo Maker",
      url: "https://logo-maker.jagodana.com",
      icon: "✏️",
      description: "Create a professional logo in 60 seconds.",
    },
  ],

  // HowTo Steps (drives HowTo JSON-LD schema for rich results)
  howToSteps: [
    {
      name: "Select File Type",
      text: "Choose whether you are setting permissions on a regular file, a directory, or a symbolic link using the file type selector.",
      url: "",
    },
    {
      name: "Toggle Permission Bits",
      text: "Check or uncheck the Read, Write, and Execute boxes for Owner, Group, and Other. The numeric and symbolic values update instantly.",
      url: "",
    },
    {
      name: "Or Enter a Numeric Value",
      text: "Type a 3-digit octal number (e.g. 755) into the numeric input field. The checkboxes will snap to the corresponding permission bits automatically.",
      url: "",
    },
    {
      name: "Copy the chmod Command",
      text: "Click the copy button next to the chmod command preview to copy it to your clipboard, then paste it into your terminal.",
      url: "",
    },
  ],
  howToTotalTime: "PT1M",

  // FAQ (drives both the FAQ UI section and FAQPage JSON-LD schema)
  faq: [
    {
      question: "What does chmod 755 mean?",
      answer:
        "chmod 755 grants the owner full read, write, and execute permissions (7 = 4+2+1), while the group and others get read and execute permissions but not write (5 = 4+0+1). It is the standard permission for web server directories and executable scripts.",
    },
    {
      question: "What is the difference between numeric and symbolic chmod formats?",
      answer:
        "Numeric (octal) format uses three digits (e.g. 755) where each digit is the sum of read (4), write (2), and execute (1) for owner, group, and others respectively. Symbolic format (e.g. rwxr-xr-x) spells out each bit explicitly with letters — r for read, w for write, x for execute, and - for no permission.",
    },
    {
      question: "What chmod value should I use for a web server file?",
      answer:
        "For regular web files (HTML, CSS, JS, PHP), use 644 (owner can read/write, everyone else can read). For directories, use 755 (owner can read/write/enter, everyone else can read/enter). Never use 777 in production — it grants write access to all users on the system.",
    },
    {
      question: "What does chmod 600 mean and when should I use it?",
      answer:
        "chmod 600 gives the owner read and write access only — no group or other permissions at all. Use this for sensitive files like SSH private keys (~/.ssh/id_rsa) and configuration files with passwords. SSH will actually refuse to use a private key unless it has 600 or 400 permissions.",
    },
    {
      question: "How do I apply chmod recursively to all files in a directory?",
      answer:
        "Use the -R flag: chmod -R 755 /path/to/directory. Be careful with recursive chmod — it applies the same permission to both files and directories. A common pattern is to use find to apply different permissions: find /path -type f -exec chmod 644 {} \\; for files and find /path -type d -exec chmod 755 {} \\; for directories.",
    },
    {
      question: "What is the sticky bit, setuid, and setgid in chmod?",
      answer:
        "These are special permission bits represented by a leading digit in a 4-digit octal value. Setuid (4xxx) runs an executable as its owner. Setgid (2xxx) runs it as its group, or makes new files in a directory inherit the group. Sticky bit (1xxx) on a directory prevents users from deleting files they don't own (used on /tmp). Example: chmod 1777 /tmp sets the sticky bit plus full rwx for everyone.",
    },
  ],

  // ====== PAGES (for sitemap + per-page SEO) ======
  pages: {
    "/": {
      title:
        "Chmod Calculator - Visual Unix File Permission Calculator",
      description:
        "Calculate Unix file permissions visually. Convert between numeric (755) and symbolic (rwxr-xr-x) chmod formats instantly. Free online tool for developers and sysadmins.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
