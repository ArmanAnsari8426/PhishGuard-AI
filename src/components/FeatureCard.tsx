import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export default function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`group relative p-6 rounded-2xl transition-all duration-300 ${
        isDark
          ? 'glass hover:border-cyber-blue/30'
          : 'bg-white border border-slate-200 hover:border-cyber-blue/30 shadow-sm hover:shadow-lg'
      }`}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyber-blue/5 to-cyber-purple/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6 text-cyber-blue" />
        </div>
        
        <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
          {title}
        </h3>
        
        <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {description}
        </p>
      </div>
    </motion.div>
  );
}
