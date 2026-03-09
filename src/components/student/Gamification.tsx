import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, Award, Crown, Zap, Target, BookOpen, Loader2 } from 'lucide-react';
import { Badge, LeaderboardEntry } from '@/types';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

interface GamificationProps {
  level?: number;
  xp?: number;
  xpToNextLevel?: number;
  badges?: Badge[];
  leaderboard?: LeaderboardEntry[];
  currentUserId?: string;
}

const getBadgeIcon = (icon: string) => {
  switch (icon) {
    case 'star': return Star;
    case 'book': return BookOpen;
    case 'trophy': return Trophy;
    case 'zap': return Zap;
    case 'target': return Target;
    default: return Award;
  }
};

const getTierStyle = (tier: Badge['tier']) => {
  switch (tier) {
    case 'gold': return 'badge-gold text-yellow-900';
    case 'silver': return 'badge-silver text-gray-700';
    case 'bronze': return 'badge-bronze text-amber-900';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1: return 'bg-gradient-to-br from-yellow-400 to-amber-500 text-yellow-900';
    case 2: return 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700';
    case 3: return 'bg-gradient-to-br from-amber-600 to-amber-700 text-amber-100';
    default: return 'bg-muted text-muted-foreground';
  }
};

export const Gamification: React.FC<Partial<GamificationProps>> = ({
  level: initialLevel,
  xp: initialXp,
  xpToNextLevel: initialXpToNextLevel,
  badges: initialBadges,
  leaderboard: initialLeaderboard,
  currentUserId,
}) => {
  const [level, setLevel] = useState(initialLevel || 0);
  const [xp, setXp] = useState(initialXp || 0);
  const [xpToNextLevel, setXpToNextLevel] = useState(initialXpToNextLevel || 5000);
  const [badges, setBadges] = useState<Badge[]>(initialBadges || []);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(initialLeaderboard || []);
  const [isLoading, setIsLoading] = useState(!initialBadges);

  // Load gamification data from API if not provided
  useEffect(() => {
    if (!initialBadges || !initialLeaderboard) {
      const loadGamificationData = async () => {
        try {
          const [statsRes, badgesRes, leaderboardRes] = await Promise.all([
            api.get('/learning/student-progress/'),
            api.get('/learning/badges/'),
            api.get('/analytics/leaderboard/'),
          ]);
          
          setLevel(statsRes.data.level || 0);
          setXp(statsRes.data.xp || 0);
          setXpToNextLevel(statsRes.data.xp_to_next_level || 5000);
          setBadges(badgesRes.data || []);
          setLeaderboard(leaderboardRes.data || []);
        } catch (error) {
          console.error('Failed to load gamification data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      loadGamificationData();
    }
  }, [initialBadges, initialLeaderboard]);

  const xpProgress = xpToNextLevel > 0 ? (xp / xpToNextLevel) * 100 : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Level & XP Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 col-span-full"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex items-center gap-6">
            {/* Level Badge */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25"
            >
              <Crown className="absolute -top-3 -right-3 w-8 h-8 text-warning animate-bounce-subtle" />
              <div className="text-center text-primary-foreground">
                <p className="text-3xl font-display font-bold">{level}</p>
                <p className="text-xs font-medium opacity-80">DARAJA</p>
              </div>
            </motion.div>

            {/* XP Progress */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-semibold text-lg">Tajriba ballari</h3>
                <span className="text-sm text-muted-foreground">{xp} / {xpToNextLevel} XP</span>
              </div>
              <div className="level-progress">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="level-progress-bar"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Keyingi darajaga {xpToNextLevel - xp} XP qoldi
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Badges Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-warning" />
          <h3 className="font-display font-semibold text-lg">Yutuqlar</h3>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {badges.map((badge, index) => {
            const BadgeIcon = getBadgeIcon(badge.icon);
            const isEarned = !!badge.earnedAt;

            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className={cn(
                  "relative w-14 h-14 rounded-xl flex items-center justify-center cursor-pointer transition-all",
                  isEarned ? getTierStyle(badge.tier) : 'bg-muted/50 text-muted-foreground opacity-40'
                )}
                title={`${badge.name}: ${badge.description}`}
              >
                <BadgeIcon className="w-6 h-6" />
                {isEarned && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-success flex items-center justify-center"
                  >
                    <Star className="w-2.5 h-2.5 text-success-foreground" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Medal className="w-5 h-5 text-accent" />
          <h3 className="font-display font-semibold text-lg">Reyting jadvali</h3>
        </div>

        <div className="space-y-2">
          {leaderboard.map((entry, index) => {
            const isCurrentUser = entry.userId === currentUserId;

            return (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl transition-colors",
                  isCurrentUser ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
                )}
              >
                {/* Rank */}
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
                  getRankStyle(entry.rank)
                )}>
                  {entry.rank}
                </div>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold">
                  {entry.userName.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-medium truncate",
                    isCurrentUser && "text-primary"
                  )}>
                    {isCurrentUser ? 'Siz' : entry.userName}
                  </p>
                  <p className="text-sm text-muted-foreground">Daraja {entry.level}</p>
                </div>

                {/* XP */}
                <div className="text-right">
                  <p className="font-semibold">{entry.xp.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">XP</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
