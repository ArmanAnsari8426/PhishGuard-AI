import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import type { ScanResult } from '../utils/urlAnalyzer';

interface RiskGaugeProps {
  score: number;
  category: ScanResult['category'];
  size?: number;
}

export default function RiskGauge({ score, category, size = 200 }: RiskGaugeProps) {
  const { isDark } = useTheme();
  const [animatedScore, setAnimatedScore] = useState(0);
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const getColor = () => {
    if (score <= 20) return '#00ff88';
    if (score <= 40) return '#00d4ff';
    if (score <= 60) return '#ffdd00';
    if (score <= 80) return '#ffaa00';
    return '#ff3366';
  };

  const getGlowClass = () => {
    if (score <= 20) return 'glow-green';
    if (score <= 40) return 'glow-blue';
    if (score <= 60) return 'glow-orange';
    if (score <= 80) return 'glow-orange';
    return 'glow-red';
  };

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="risk-gauge-circle"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-4xl font-bold"
          style={{ color: getColor() }}
        >
          {animatedScore}
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className={`text-xs font-medium mt-1 px-2 py-0.5 rounded-full ${getGlowClass()}`}
          style={{ color: getColor(), backgroundColor: `${getColor()}15` }}
        >
          {category}
        </motion.span>
      </div>
    </div>
  );
}
