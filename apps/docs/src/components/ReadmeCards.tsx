'use client';

import React from 'react';

interface ExampleCardProps {
  title: string;
  description: string;
  framework: string;
  technologies: string[];
  status: 'ready' | 'coming-soon';
  githubUrl: string;
  demoUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const ExampleCard: React.FC<ExampleCardProps> = ({
  title,
  description,
  framework,
  technologies,
  status,
  githubUrl,
  demoUrl,
  difficulty,
}) => {
  const statusConfig = {
    ready: {
      badge: 'Ready',
      badgeClass: 'text-[var(--tuwa-success-text)] bg-[var(--tuwa-success-bg)]',
      cardClass: 'border-[var(--tuwa-success-icon)] hover:border-[var(--tuwa-success-text)]',
    },
    'coming-soon': {
      badge: 'Coming Soon',
      badgeClass: 'text-[var(--tuwa-pending-text)] bg-[var(--tuwa-pending-bg)]',
      cardClass: 'border-[var(--tuwa-pending-icon)] opacity-75',
    },
  };

  const difficultyConfig = {
    beginner: { label: 'Beginner', color: 'text-[var(--tuwa-success-text)]' },
    intermediate: { label: 'Intermediate', color: 'text-[var(--tuwa-pending-text)]' },
    advanced: { label: 'Advanced', color: 'text-[var(--tuwa-error-text)]' },
  };

  const isDisabled = status === 'coming-soon';

  return (
    <div
      className={`relative p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg bg-[var(--tuwa-bg-primary)] ${
        statusConfig[status].cardClass
      } ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-xl'}`}
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig[status].badgeClass}`}>
          {statusConfig[status].badge}
        </span>
      </div>

      {/* Header */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-[var(--tuwa-text-primary)] mb-2">{title}</h3>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm font-medium text-[var(--tuwa-text-accent)]">{framework}</span>
          <span className={`text-sm font-medium ${difficultyConfig[difficulty].color}`}>
            {difficultyConfig[difficulty].label}
          </span>
        </div>
        <p className="text-[var(--tuwa-text-secondary)] text-sm leading-relaxed">{description}</p>
      </div>

      {/* Technologies */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-[var(--tuwa-bg-muted)] text-[var(--tuwa-text-secondary)] rounded-md border border-[var(--tuwa-border-secondary)]"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center flex-1 px-4 py-2 text-sm font-medium text-center rounded-lg transition-all duration-200 ${
            isDisabled
              ? 'bg-[var(--tuwa-bg-muted)] text-[var(--tuwa-text-tertiary)] cursor-not-allowed'
              : 'text-[var(--tuwa-text-on-accent)]'
          }`}
          style={
            !isDisabled
              ? {
                  background: `linear-gradient(135deg, var(--tuwa-button-gradient-from), var(--tuwa-button-gradient-to))`,
                }
              : {}
          }
          onMouseEnter={(e) => {
            if (!isDisabled) {
              e.currentTarget.style.background = `linear-gradient(135deg, var(--tuwa-button-gradient-from-hover), var(--tuwa-button-gradient-to-hover))`;
            }
          }}
          onMouseLeave={(e) => {
            if (!isDisabled) {
              e.currentTarget.style.background = `linear-gradient(135deg, var(--tuwa-button-gradient-from), var(--tuwa-button-gradient-to))`;
            }
          }}
          onClick={(e) => isDisabled && e.preventDefault()}
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            View Code
          </span>
        </a>

        {demoUrl && !isDisabled && (
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-medium border-2 border-[var(--tuwa-border-primary)] text-[var(--tuwa-text-secondary)] rounded-lg hover:border-[var(--tuwa-text-accent)] hover:text-[var(--tuwa-text-accent)] transition-all duration-200"
          >
            Live Demo
          </a>
        )}
      </div>
    </div>
  );
};

export const ReadmeCards: React.FC = () => {
  const examples: ExampleCardProps[] = [
    {
      title: 'Next.js + Dynamic.xyz',
      description: 'Next.js application using Dynamic.xyz for a minimal and clean wallet connection experience.',
      framework: 'Next.js 15',
      technologies: ['React 19', 'TypeScript', 'Dynamic.xyz', 'Wagmi', 'TailwindCSS'],
      status: 'ready',
      githubUrl: 'https://github.com/TuwaIO/web3-transactions-tracking-examples/tree/main/examples/nextjs-dynamic',
      difficulty: 'intermediate',
      demoUrl: 'https://dynamic.example.tuwa.io/',
    },
    {
      title: 'Next.js + ConnectKit',
      description: 'Next.js application using ConnectKit for a minimal and clean wallet connection experience.',
      framework: 'Next.js 15',
      technologies: ['React 19', 'TypeScript', 'ConnectKit', 'Wagmi', 'TailwindCSS'],
      status: 'ready',
      githubUrl: 'https://github.com/TuwaIO/web3-transactions-tracking-examples/tree/main/examples/nextjs-connectkit',
      difficulty: 'beginner',
      demoUrl: 'https://connectkit.example.tuwa.io/',
    },
    {
      title: 'Next.js + Reown AppKit',
      description: 'Next.js application using Reown AppKit for a minimal and clean wallet connection experience.',
      framework: 'Next.js 15',
      technologies: ['React 19', 'TypeScript', 'Reown AppKit', 'Wagmi', 'TailwindCSS'],
      status: 'ready',
      githubUrl: 'https://github.com/TuwaIO/web3-transactions-tracking-examples/tree/main/examples/nextjs-reown',
      difficulty: 'intermediate',
    },
    {
      title: 'Next.js + RainbowKit',
      description:
        'Full-featured Next.js App Directory example with beautiful wallet connection UI and comprehensive transaction tracking.',
      framework: 'Next.js 15',
      technologies: ['React 19', 'TypeScript', 'RainbowKit', 'Wagmi', 'TailwindCSS'],
      status: 'ready',
      githubUrl: 'https://github.com/TuwaIO/web3-transactions-tracking-examples/tree/main/examples/nextjs-rainbowkit',
      difficulty: 'beginner',
    },
    {
      title: 'Next.js + Web3Auth',
      description: 'Next.js application using Web3Auth for a minimal and clean wallet connection experience.',
      framework: 'Next.js 15',
      technologies: ['React 19', 'TypeScript', 'Web3Auth', 'Wagmi', 'TailwindCSS'],
      status: 'ready',
      githubUrl: 'https://github.com/TuwaIO/web3-transactions-tracking-examples/tree/main/examples/nextjs-web3auth',
      difficulty: 'advanced',
    },
    {
      title: 'Vite + RainbowKit',
      description:
        'Lightweight and fast Vite React application with RainbowKit integration. Perfect for rapid development and testing.',
      framework: 'Vite + React',
      technologies: ['React 19', 'TypeScript', 'Vite', 'RainbowKit', 'TailwindCSS'],
      status: 'ready',
      githubUrl: 'https://github.com/TuwaIO/web3-transactions-tracking-examples/tree/main/examples/vite-rainbowkit',
      difficulty: 'beginner',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {examples.map((example, index) => (
          <ExampleCard key={index} {...example} />
        ))}
      </div>
    </div>
  );
};
