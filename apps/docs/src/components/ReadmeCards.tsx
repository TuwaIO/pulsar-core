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
      cardClass:
        'border-zinc-200/60 dark:border-zinc-800/40 hover:border-indigo-500/30 dark:hover:border-violet-500/30',
    },
    'coming-soon': {
      badge: 'Coming Soon',
      badgeClass: 'text-[var(--tuwa-pending-text)] bg-[var(--tuwa-pending-bg)]',
      cardClass: 'border-zinc-200/30 dark:border-zinc-800/20 opacity-70',
    },
  };

  const difficultyConfig = {
    beginner: {
      label: 'Beginner',
      color: 'text-emerald-500 dark:text-emerald-400',
      gradient: 'from-emerald-500 to-teal-500',
    },
    intermediate: {
      label: 'Intermediate',
      color: 'text-amber-500 dark:text-amber-400',
      gradient: 'from-amber-500 to-orange-500',
    },
    advanced: {
      label: 'Advanced',
      color: 'text-rose-500 dark:text-rose-400',
      gradient: 'from-rose-500 to-violet-600',
    },
  };

  const isDisabled = status === 'coming-soon';

  return (
    <div
      className={`readme-card-container group relative flex flex-col overflow-hidden p-6 rounded-[var(--tuwa-rounded-corners)] border transition-all duration-300 ${
        isDisabled ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-2xl hover:-translate-y-1'
      }`}
    >
      {/* Top Accent Gradient Line */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${difficultyConfig[difficulty].gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300`}
      />

      {/* Status Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span
          className={`px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full ${statusConfig[status].badgeClass}`}
        >
          {statusConfig[status].badge}
        </span>
      </div>

      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-[var(--tuwa-text-primary)] mb-2 group-hover:text-[var(--tuwa-text-accent)] transition-colors duration-300 pr-20">
          {title}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--tuwa-text-accent)]">
            {framework}
          </span>
          <span className="text-xs font-bold text-zinc-300 dark:text-zinc-700 font-mono">•</span>
          <span className={`text-xs font-semibold uppercase tracking-wider ${difficultyConfig[difficulty].color}`}>
            {difficultyConfig[difficulty].label}
          </span>
        </div>
        <p className="readme-card-desc text-sm leading-relaxed min-h-[48px]">{description}</p>
      </div>

      {/* Technologies */}
      <div className="mb-6 mt-auto">
        <div className="flex flex-wrap gap-1.5">
          {technologies.map((tech, index) => (
            <span key={index} className="readme-card-tag px-2 py-0.5 text-[11px] font-mono rounded-[4px] border">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-zinc-100/50 dark:border-zinc-800/30">
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`readme-card-github-btn flex items-center justify-center flex-1 px-4 py-2 text-sm font-semibold text-center rounded-[var(--tuwa-rounded-corners)] transition-all duration-300 ${
            isDisabled
              ? 'bg-[var(--tuwa-bg-muted)] text-[var(--tuwa-text-tertiary)] cursor-not-allowed'
              : 'shadow-sm hover:shadow-indigo-500/10 hover:-translate-y-0.5'
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
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
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
            className="readme-card-demo-btn flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold border rounded-[var(--tuwa-rounded-corners)] hover:-translate-y-0.5 shadow-sm hover:shadow-indigo-500/[0.01] transition-all duration-300"
          >
            Live Demo
            <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
};

export const ReadmeCards: React.FC = () => {
  const examples: ExampleCardProps[] = [
    {
      title: 'Next.js + Nova Connect + Quasar (Full-Stack)',
      description:
        'Sovereign multi-chain gateway integrating Nova Connect connectivity with Quasar Indexer Engine for real-time transaction tracking, billing, and identity.',
      framework: 'Next.js 16',
      technologies: ['React 19', 'TypeScript', '@tuwaio/nova-connect', 'Quasar SDK', 'Wagmi', 'TailwindCSS'],
      status: 'ready',
      githubUrl: 'https://github.com/TuwaIO/cosmos-playground/tree/main/examples/nextjs-tuwa-quasar',
      difficulty: 'advanced',
      demoUrl: 'https://demo.tuwa.io/',
    },
    {
      title: 'Vite + Nova Connect (Custom Styles)',
      description:
        'Lightweight and fast Vite React application showcasing Nova Connect custom styling adapters. Perfect for rapid prototyping.',
      framework: 'Vite + React',
      technologies: ['React 19', 'TypeScript', 'Vite', '@tuwaio/nova-connect', 'TailwindCSS', 'Custom Styles'],
      status: 'ready',
      githubUrl: 'https://github.com/TuwaIO/cosmos-playground/tree/main/examples/custom-style',
      difficulty: 'intermediate',
      demoUrl: 'https://custom-style.tuwa.io/',
    },
    {
      title: 'Next.js + Nova Connect',
      description:
        'Sovereign multi-chain starter template showcasing unified wallet connectivity and headless transaction state lifecycles.',
      framework: 'Next.js 16',
      technologies: ['React 19', 'TypeScript', '@tuwaio/nova-connect', 'Wagmi', 'TailwindCSS'],
      status: 'ready',
      githubUrl: 'https://github.com/TuwaIO/cosmos-playground/tree/main/examples/nextjs-tuwa',
      difficulty: 'beginner',
    },
    {
      title: 'Next.js + Nova Connect (EVM only)',
      description: 'Specialized template focused strictly on EVM provider mapping and transaction status indexing.',
      framework: 'Next.js 16',
      technologies: ['React 19', 'TypeScript', '@tuwaio/nova-connect', 'Wagmi', 'TailwindCSS'],
      status: 'ready',
      githubUrl: 'https://github.com/TuwaIO/cosmos-playground/tree/main/examples/nextjs-evm',
      difficulty: 'beginner',
    },
    {
      title: 'Next.js + Nova Connect (Solana only)',
      description:
        'Dedicated Solana ecosystem template featuring Gill cluster manager integration and signature status tracking.',
      framework: 'Next.js 16',
      technologies: ['React 19', 'TypeScript', '@tuwaio/nova-connect', 'Wagmi', 'TailwindCSS'],
      status: 'ready',
      githubUrl: 'https://github.com/TuwaIO/cosmos-playground/tree/main/examples/nextjs-solana',
      difficulty: 'beginner',
    },
    {
      title: 'Vite + Nova Connect',
      description: 'Lightweight and fast Vite React template showcasing standard wallet connectivity configurations.',
      framework: 'Vite + React',
      technologies: ['React 19', 'TypeScript', 'Vite', '@tuwaio/nova-connect', 'TailwindCSS'],
      status: 'ready',
      githubUrl: 'https://github.com/TuwaIO/cosmos-playground/tree/main/examples/vite-tuwa',
      difficulty: 'beginner',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .readme-card-container {
              background-color: rgba(255, 255, 255, 0.45) !important;
              border-color: rgba(228, 228, 231, 0.8) !important;
              backdrop-filter: blur(8px) !important;
            }
            .dark .readme-card-container {
              background-color: rgba(24, 24, 27, 0.4) !important;
              border-color: rgba(63, 63, 70, 0.45) !important;
            }
            .readme-card-container:hover {
              border-color: rgba(99, 102, 241, 0.35) !important;
            }
            .dark .readme-card-container:hover {
              border-color: rgba(139, 92, 246, 0.35) !important;
            }
            .readme-card-desc {
              color: #4b5563 !important;
            }
            .dark .readme-card-desc {
              color: #a1a1aa !important;
            }
            .readme-card-tag {
              background-color: rgba(244, 244, 245, 0.9) !important;
              color: #27272a !important;
              border-color: rgba(228, 228, 231, 0.8) !important;
            }
            .dark .readme-card-tag {
              background-color: rgba(39, 39, 42, 0.5) !important;
              color: #d4d4d8 !important;
              border-color: rgba(63, 63, 70, 0.4) !important;
            }
            .readme-card-github-btn {
              color: #ffffff !important;
              text-decoration: none !important;
            }
            .readme-card-github-btn svg {
              fill: #ffffff !important;
            }
            .readme-card-demo-btn {
              color: #4b5563 !important;
              border-color: rgba(228, 228, 231, 1) !important;
              text-decoration: none !important;
              background-color: transparent !important;
            }
            .dark .readme-card-demo-btn {
              color: #d4d4d8 !important;
              border-color: rgba(63, 63, 70, 1) !important;
              background-color: transparent !important;
            }
            .readme-card-demo-btn:hover {
              color: var(--tuwa-primary) !important;
              border-color: var(--tuwa-primary) !important;
              background-color: rgba(99, 102, 241, 0.06) !important;
            }
            .dark .readme-card-demo-btn:hover {
              color: var(--tuwa-secondary) !important;
              border-color: var(--tuwa-secondary) !important;
              background-color: rgba(139, 92, 246, 0.08) !important;
            }
          `,
        }}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {examples.map((example, index) => (
          <ExampleCard key={index} {...example} />
        ))}
      </div>
    </div>
  );
};
