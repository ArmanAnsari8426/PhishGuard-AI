import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  delay?: number;
}

export default function StatCard({ icon: Icon, value, label, delay = 0 }: StatCardProps) {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`text-center p-6 rounded-2xl ${
        isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'
      }`}
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 flex items-center justify-center mx-auto mb-3">
        <Icon className="w-6 h-6 text-cyber-blue" />
      </div>
      <div className="text-3xl font-bold gradient-text mb-1">{value}</div>
      <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</div>
    </motion.div>
  );
}
