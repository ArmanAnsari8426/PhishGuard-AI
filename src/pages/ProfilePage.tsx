import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Shield, Calendar, Activity, Edit2, Save, X
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getCurrentUser, getAllUsers } from '../utils/auth';
import { getScanStats } from '../utils/storage';

export default function ProfilePage() {
  const { isDark } = useTheme();
  const user = getCurrentUser();
  const stats = getScanStats();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');

  if (!user) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Please sign in to view your profile</p>
      </div>
    );
  }

  const allUsers = getAllUsers();
  const userRank = allUsers.sort((a, b) => b.scanCount - a.scanCount).findIndex(u => u.id === user.id) + 1;

  const handleSave = () => {
    setEditing(false);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl overflow-hidden mb-6 ${isDark ? 'glass-strong' : 'bg-white border border-slate-200 shadow-lg'}`}
        >
          <div className="h-32 bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20" />
          <div className="px-6 pb-6">
            <div className="relative -mt-12 mb-4">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyber-blue to-cyber-purple flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
            
            <div className="flex items-start justify-between">
              <div>
                {editing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`px-3 py-1.5 rounded-lg text-lg font-bold outline-none ${
                        isDark
                          ? 'bg-cyber-darker border border-cyber-border text-white'
                          : 'bg-slate-50 border border-slate-200 text-slate-900'
                      }`}
                    />
                    <button onClick={handleSave} className="p-1.5 rounded-lg bg-cyber-green/10 text-cyber-green">
                      <Save className="w-4 h-4" />
                    </button>
                    <button onClick={() => { setEditing(false); setName(user.name); }} className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.name}</h1>
                    <button onClick={() => setEditing(true)} className={`p-1.5 rounded-lg transition-all ${isDark ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-100 text-slate-400'}`}>
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{user.email}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                user.role === 'admin'
                  ? 'bg-cyber-purple/10 text-cyber-purple'
                  : 'bg-cyber-blue/10 text-cyber-blue'
              }`}>
                {user.role}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
        >
          {[
            { label: 'Total Scans', value: user.scanCount, icon: Activity },
            { label: 'Safe Found', value: stats.safe, icon: Shield },
            { label: 'Threats', value: stats.suspicious + stats.highRisk + stats.phishing, icon: Shield },
            { label: 'Rank', value: `#${userRank}`, icon: User },
          ].map((stat, i) => (
            <div key={i} className={`rounded-2xl p-4 text-center ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}>
              <stat.icon className="w-5 h-5 text-cyber-blue mx-auto mb-2" />
              <div className="text-xl font-bold gradient-text">{stat.value}</div>
              <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-2xl p-6 ${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'}`}
        >
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Account Information
          </h2>
          <div className="space-y-4">
            {[
              { label: 'Full Name', value: user.name, icon: User },
              { label: 'Email Address', value: user.email, icon: Mail },
              { label: 'Account Type', value: user.role, icon: Shield },
              { label: 'Member Since', value: new Date(user.createdAt).toLocaleDateString(), icon: Calendar },
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-4 p-3 rounded-xl ${isDark ? 'bg-cyber-darker/50' : 'bg-slate-50'}`}>
                <div className="w-10 h-10 rounded-lg bg-cyber-blue/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-cyber-blue" />
                </div>
                <div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.label}</div>
                  <div className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
