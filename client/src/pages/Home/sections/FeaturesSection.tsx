import { BarChart3, Globe, Zap, GitBranch, Lightbulb, Share2 } from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Interactive Dashboards',
    description: 'Contribution heatmaps, commit velocity charts, language distribution — all live-updated from GitHub.',
    color: 'text-primary-500 bg-primary-50 dark:bg-primary-900/20',
  },
  {
    icon: Lightbulb,
    title: 'AI-Powered Insights',
    description: 'Automatically surfaced patterns: streak analysis, peak productivity hours, language growth trajectory.',
    color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
  },
  {
    icon: GitBranch,
    title: 'Repository Analytics',
    description: 'Deep-dive into individual repositories. Commit frequency, language breakdown, and momentum scoring.',
    color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    icon: Share2,
    title: 'Shareable Portfolio',
    description: 'A public profile page at /u/username — clean, recruiter-friendly, no account required to view.',
    color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: Zap,
    title: 'Productivity Scoring',
    description: 'A composite score built from consistency, volume, diversity, and momentum. Track your developer growth.',
    color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20',
  },
  {
    icon: Globe,
    title: 'Zero Installation',
    description: 'OAuth-only onboarding. No plugins, no editor integrations, no manual setup. Connect and see everything.',
    color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20',
  },
];

export const FeaturesSection = () => (
  <section className="py-20 bg-gray-50 dark:bg-surface-800/50">
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Everything a developer portfolio needs
        </h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Built for individual developers who want data-driven visibility into their work — 
          and a professional presence that speaks for itself.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map(({ icon: Icon, title, description, color }) => (
          <div
            key={title}
            className="card p-6 hover:shadow-card-hover transition-shadow duration-200"
          >
            <div className={`inline-flex p-2.5 rounded-xl mb-4 ${color}`}>
              <Icon size={22} />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
