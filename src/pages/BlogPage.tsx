import { motion } from 'framer-motion';
import { Calendar, Clock, User, Search } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function BlogPage() {
  const { isDark } = useTheme();

  const posts = [
    {
      title: 'How AI is Revolutionizing Phishing Detection in 2024',
      excerpt: 'Discover how machine learning models trained on millions of samples are making the internet safer.',
      author: 'PhishGuard Team',
      date: 'Dec 15, 2024',
      readTime: '8 min',
      category: 'AI & ML',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800'
    },
    {
      title: 'Top 10 Phishing Scams to Watch Out for This Year',
      excerpt: 'Learn about the most common phishing techniques and how to protect yourself from them.',
      author: 'Security Team',
      date: 'Dec 10, 2024',
      readTime: '6 min',
      category: 'Security Tips',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800'
    },
    {
      title: 'The Rise of QR Code Phishing (Quishing)',
      excerpt: 'QR codes are being used by attackers to bypass email security. Here is what you need to know.',
      author: 'Research Team',
      date: 'Dec 5, 2024',
      readTime: '5 min',
      category: 'Threats',
      image: 'https://images.unsplash.com/photo-1614064548237-096d6e1ce6e7?w=800'
    },
    {
      title: 'Understanding SSL Certificates and HTTPS',
      excerpt: 'A complete guide to SSL/TLS certificates and why HTTPS matters for your security.',
      author: 'Education Team',
      date: 'Nov 28, 2024',
      readTime: '10 min',
      category: 'Education',
      image: 'https://images.unsplash.com/photo-1614064548237-096d6e1ce6e7?w=800'
    },
    {
      title: 'How We Built a 99.7% Accurate Phishing Detector',
      excerpt: 'A deep dive into our machine learning pipeline and feature engineering process.',
      author: 'Engineering',
      date: 'Nov 20, 2024',
      readTime: '12 min',
      category: 'AI & ML',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800'
    },
    {
      title: 'Protecting Your Business from Phishing Attacks',
      excerpt: 'Best practices for organizations to defend against sophisticated phishing campaigns.',
      author: 'Business Team',
      date: 'Nov 15, 2024',
      readTime: '7 min',
      category: 'Business',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800'
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Security <span className="gradient-text">Blog</span>
          </h1>
          <p className={`text-lg max-w-xl mx-auto mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Latest insights, tips, and news about cybersecurity
          </p>
          <div className="max-w-md mx-auto relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <input type="text" placeholder="Search articles..."
              className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all outline-none ${
                isDark ? 'bg-cyber-darker border border-cyber-border text-white placeholder-slate-500 focus:border-cyber-blue'
                : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyber-blue'
              }`} />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.article key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
              className={`rounded-2xl overflow-hidden group cursor-pointer transition-all ${
                isDark ? 'glass hover:border-cyber-blue/30' : 'bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:border-cyber-blue/30'
              }`}>
              <div className="h-48 bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 flex items-center justify-center">
                <span className="text-4xl">🛡️</span>
              </div>
              <div className="p-5">
                <span className="inline-block px-2 py-1 rounded-md text-xs font-medium bg-cyber-blue/10 text-cyber-blue mb-3">
                  {post.category}
                </span>
                <h2 className={`text-lg font-semibold mb-2 line-clamp-2 group-hover:text-cyber-blue transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {post.title}
                </h2>
                <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {post.excerpt}
                </p>
                <div className={`flex items-center gap-3 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
