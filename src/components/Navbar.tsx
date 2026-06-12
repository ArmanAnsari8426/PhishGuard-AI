import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X, Sun, Moon, User, LogOut, ChevronDown, Wrench } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getCurrentUser, logoutUser, isAdmin } from '../utils/auth';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const admin = isAdmin();

  const isLanding = location.pathname === '/';

  const handleLogout = () => {
    logoutUser();
    setProfileOpen(false);
    navigate('/');
  };

  const tools = [
    { label: 'URL Scanner', path: '/scan', emoji: '🔍' },
    { label: 'Password Checker', path: '/password-checker', emoji: '🔐' },
    { label: 'QR Scanner', path: '/qr-scanner', emoji: '📱' },
    { label: 'Bulk Scanner', path: '/bulk-scanner', emoji: '📊' },
    { label: 'Domain Monitor', path: '/domain-monitor', emoji: '🌐' },
  ];

  const navLinks = user
    ? [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Tools', path: '#', dropdown: true },
        { label: 'History', path: '/history' },
        { label: 'Analytics', path: '/analytics' },
        { label: 'API', path: '/api-docs' },
        ...(admin ? [{ label: 'Admin', path: '/admin' }] : []),
      ]
    : [
        { label: 'Features', path: '/#features' },
        { label: 'How It Works', path: '/#how-it-works' },
        { label: 'Tools', path: '#', dropdown: true },
        { label: 'API', path: '/api-docs' },
        { label: 'Pricing', path: '/#pricing' },
        { label: 'Blog', path: '/blog' },
      ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 ${isLanding ? 'glass' : 'glass-strong'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="relative">
              <Shield className="w-8 h-8 text-cyber-blue transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-cyber-blue/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold">
              <span className="gradient-text">PhishGuard</span>
              <span className={`${isDark ? 'text-white' : 'text-slate-800'}`}> AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div key={link.label} className="relative">
                {link.dropdown ? (
                  <button
                    onClick={() => setToolsOpen(!toolsOpen)}
                    onBlur={() => setTimeout(() => setToolsOpen(false), 200)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                      toolsOpen ? 'text-cyber-blue bg-cyber-blue/10' : isDark
                      ? 'text-slate-300 hover:text-white hover:bg-white/5'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Wrench className="w-4 h-4" />
                    {link.label}
                    <ChevronDown className={`w-3 h-3 transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link
                    to={link.path}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      location.pathname === link.path.split('#')[0] && link.path !== '/#features'
                        ? 'text-cyber-blue bg-cyber-blue/10'
                        : isDark
                        ? 'text-slate-300 hover:text-white hover:bg-white/5'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                )}

                {link.dropdown && toolsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`absolute top-full left-0 mt-2 w-64 rounded-xl overflow-hidden shadow-2xl ${isDark ? 'glass-strong' : 'bg-white border border-slate-200'}`}
                  >
                    <div className="p-2">
                      {tools.map((tool) => (
                        <Link
                          key={tool.path}
                          to={tool.path}
                          onClick={() => setToolsOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                            isDark ? 'text-slate-200 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50'
                          } ${location.pathname === tool.path ? 'text-cyber-blue bg-cyber-blue/10' : ''}`}
                        >
                          <span className="text-base">{tool.emoji}</span>
                          <span>{tool.label}</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-2">
            <button onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all ${isDark ? 'text-slate-300 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'}`}>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyber-blue to-cyber-purple flex items-center justify-center text-white text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${profileOpen ? 'rotate-180' : ''} ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`absolute right-0 mt-2 w-52 rounded-xl overflow-hidden shadow-2xl ${isDark ? 'glass-strong' : 'bg-white border border-slate-200'}`}
                    >
                      <div className="p-2">
                        <Link to="/profile" onClick={() => setProfileOpen(false)}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm ${isDark ? 'text-slate-200 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50'}`}>
                          <User className="w-4 h-4" /> Profile
                        </Link>
                        <Link to="/dashboard" onClick={() => setProfileOpen(false)}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm ${isDark ? 'text-slate-200 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50'}`}>
                          <Shield className="w-4 h-4" /> Dashboard
                        </Link>
                        <Link to="/about" onClick={() => setProfileOpen(false)}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm ${isDark ? 'text-slate-200 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50'}`}>
                          <Shield className="w-4 h-4" /> About
                        </Link>
                        <div className={`my-1 border-t ${isDark ? 'border-cyber-border' : 'border-slate-200'}`} />
                        <button onClick={handleLogout}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm w-full text-left ${isDark ? 'text-rose-400 hover:bg-white/5' : 'text-rose-500 hover:bg-slate-50'}`}>
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                  Sign In
                </Link>
                <Link to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-cyber-blue to-cyber-purple text-white hover:opacity-90 transition-opacity">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden ${isDark ? 'glass-strong border-t border-cyber-border' : 'bg-white border-t border-slate-200'}`}
          >
            <div className="px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto scrollbar-thin">
              {/* Tools */}
              <div className={`text-xs uppercase font-semibold px-4 py-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Tools
              </div>
              {tools.map((tool) => (
                <Link key={tool.path} to={tool.path} onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm ${
                    location.pathname === tool.path ? 'text-cyber-blue bg-cyber-blue/10' : isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                  <span>{tool.emoji}</span>
                  <span>{tool.label}</span>
                </Link>
              ))}

              <div className={`border-t my-2 ${isDark ? 'border-cyber-border' : 'border-slate-200'}`} />

              {/* Pages */}
              <div className={`text-xs uppercase font-semibold px-4 py-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Pages
              </div>
              <Link to="/api-docs" onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                API Documentation
              </Link>
              <Link to="/about" onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                About
              </Link>
              <Link to="/blog" onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Blog
              </Link>
              <Link to="/contact" onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Contact
              </Link>

              <div className={`border-t my-2 ${isDark ? 'border-cyber-border' : 'border-slate-200'}`} />

              {/* User */}
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-2.5 rounded-lg text-sm font-semibold ${isDark ? 'text-cyber-blue' : 'text-cyber-blue'}`}>
                    Dashboard
                  </Link>
                  <Link to="/history" onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-2.5 rounded-lg text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    History
                  </Link>
                  <Link to="/analytics" onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-2.5 rounded-lg text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Analytics
                  </Link>
                  <Link to="/profile" onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-2.5 rounded-lg text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Profile
                  </Link>
                  {admin && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)}
                      className={`block px-4 py-2.5 rounded-lg text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className="block px-4 py-2.5 text-sm text-rose-400 w-full text-left">
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2 px-4">
                  <Link to="/login" onClick={() => setMobileOpen(false)}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm text-center font-medium ${isDark ? 'text-slate-300 border border-cyber-border' : 'text-slate-600 border border-slate-200'}`}>
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm text-center font-medium bg-gradient-to-r from-cyber-blue to-cyber-purple text-white">
                    Get Started
                  </Link>
                </div>
              )}

              {/* Theme toggle */}
              <div className={`px-4 pt-2 border-t ${isDark ? 'border-cyber-border' : 'border-slate-200'}`}>
                <button onClick={toggleTheme}
                  className={`flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
