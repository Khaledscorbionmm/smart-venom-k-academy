import { useLanguage } from "@/contexts/LanguageContext";
import { useGetLeaderboard } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Flame, Medal } from "lucide-react";
import { offlineCache } from "@/lib/offlineCache";
import { useEffect } from "react";

export default function Leaderboard() {
  const { t } = useLanguage();
  const { data: leaderboard, isLoading } = useGetLeaderboard();

  // Cache leaderboard when loaded
  useEffect(() => {
    if (leaderboard) offlineCache.saveLeaderboard(leaderboard);
  }, [leaderboard]);

  const cachedLeaderboard = offlineCache.loadLeaderboard();
  const displayLeaderboard = leaderboard || cachedLeaderboard;

  if (isLoading && !displayLeaderboard) {
    return (
      <div className="container mx-auto p-4 md:p-8 space-y-8 max-w-4xl">
        <div className="h-10 w-48 mx-auto bg-muted animate-pulse rounded" />
        <div className="space-y-4">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-20 bg-card rounded-xl border border-border animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const getRankStyle = (rank: number) => {
    switch(rank) {
      case 1: return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case 2: return "bg-slate-300/20 text-slate-300 border-slate-300/30";
      case 3: return "bg-amber-700/20 text-amber-700 border-amber-700/30";
      default: return "bg-muted text-muted-foreground border-transparent";
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 max-w-4xl">
      <div className="text-center space-y-4 mb-8">
        <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
        <h1 className="text-4xl font-bold">{t('لوحة الشرف', 'Leaderboard')}</h1>
        <p className="text-muted-foreground">{t('أفضل المتعلمين هذا الأسبوع', 'Top learners this week')}</p>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {displayLeaderboard?.map((user: any) => (
              <div key={user.userId} className={`flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors ${user.rank <= 3 ? 'bg-muted/20' : ''}`}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold border-2 ${getRankStyle(user.rank)}`}>
                  {user.rank <= 3 ? <Medal className="w-5 h-5" /> : user.rank}
                </div>
                
                <Avatar className="h-12 w-12 border-2 border-border">
                  <AvatarImage src={user.avatarUrl || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {user.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-lg truncate">{user.username}</div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center text-primary font-medium">Lv. {user.level}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5 text-orange-500 font-bold hidden sm:flex">
                    <Flame className="w-4 h-4" />
                    {user.streak}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-black text-xl text-yellow-500 flex items-center gap-1">
                      {user.xp} <span className="text-sm font-bold opacity-70">XP</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}