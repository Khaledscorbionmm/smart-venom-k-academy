import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  useGetAdminStats, useAdminGetUsers, useGetSubscriptions,
  useApproveSubscription, useRejectSubscription, useAdminUpdateUser,
  useSuspendSubscription, useReactivateSubscription,
  getGetAdminStatsQueryKey, getAdminGetUsersQueryKey, getGetSubscriptionsQueryKey
} from "@workspace/api-client-react";
import { Redirect } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Users, BookOpen, CreditCard, Award, Check, X,
  ShieldAlert, PauseCircle, PlayCircle, Search,
  TrendingUp, Activity, Clock
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

type SubStatus = "all" | "pending" | "active" | "suspended" | "rejected";

const statusConfig: Record<string, { label: string; labelEn: string; color: string }> = {
  pending:   { label: "انتظار",  labelEn: "Pending",   color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" },
  active:    { label: "نشط",    labelEn: "Active",    color: "bg-green-500/10 text-green-400 border-green-500/30" },
  suspended: { label: "موقوف",  labelEn: "Suspended", color: "bg-orange-500/10 text-orange-400 border-orange-500/30" },
  rejected:  { label: "مرفوض", labelEn: "Rejected",  color: "bg-red-500/10 text-red-400 border-red-500/30" },
};

export default function Admin() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [subFilter, setSubFilter] = useState<SubStatus>("all");
  const [subSearch, setSubSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");

  const isAdmin = user?.role === "admin";
  const { data: stats } = useGetAdminStats({ query: { queryKey: getGetAdminStatsQueryKey(), enabled: isAdmin } as any });
  const { data: users } = useAdminGetUsers({ query: { queryKey: getAdminGetUsersQueryKey(), enabled: isAdmin } as any });
  const { data: subscriptions } = useGetSubscriptions({ query: { queryKey: getGetSubscriptionsQueryKey(), enabled: isAdmin } as any });

  const approveSub = useApproveSubscription();
  const rejectSub = useRejectSubscription();
  const suspendSub = useSuspendSubscription();
  const reactivateSub = useReactivateSubscription();
  const updateUser = useAdminUpdateUser();

  if (user?.role !== "admin") return <Redirect to="/dashboard" />;

  // Show skeleton while admin data loads
  const isAdminDataLoading = !stats || !users || !subscriptions;
  if (isAdminDataLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8 space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-24 bg-card rounded-xl border border-border animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const invalidateSubs = () => {
    queryClient.invalidateQueries({ queryKey: getGetSubscriptionsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
  };

  const handleApprove = (id: number) => {
    approveSub.mutate({ id }, {
      onSuccess: () => { toast.success(t("تم قبول الاشتراك ✓", "Subscription approved ✓")); invalidateSubs(); },
      onError: () => toast.error(t("حدث خطأ", "An error occurred")),
    });
  };

  const handleReject = (id: number) => {
    rejectSub.mutate({ id }, {
      onSuccess: () => { toast.success(t("تم رفض الاشتراك", "Subscription rejected")); invalidateSubs(); },
      onError: () => toast.error(t("حدث خطأ", "An error occurred")),
    });
  };

  const handleSuspend = (id: number) => {
    suspendSub.mutate({ id }, {
      onSuccess: () => { toast.success(t("تم إيقاف الاشتراك", "Subscription suspended")); invalidateSubs(); },
      onError: () => toast.error(t("حدث خطأ", "An error occurred")),
    });
  };

  const handleReactivate = (id: number) => {
    reactivateSub.mutate({ id }, {
      onSuccess: () => { toast.success(t("تم تفعيل الاشتراك ✓", "Subscription reactivated ✓")); invalidateSubs(); },
      onError: () => toast.error(t("حدث خطأ", "An error occurred")),
    });
  };

  const handleToggleRole = (uid: number, currentRole: string) => {
    const newRole = currentRole === "admin" ? "student" : "admin";
    updateUser.mutate({ id: uid, data: { role: newRole as any } }, {
      onSuccess: () => { toast.success(t("تم تحديث الصلاحية", "Role updated")); queryClient.invalidateQueries({ queryKey: getAdminGetUsersQueryKey() }); },
      onError: () => toast.error(t("حدث خطأ", "An error occurred")),
    });
  };

  const allSubs = subscriptions || [];
  const pendingCount = allSubs.filter(s => s.status === "pending").length;
  const activeCount  = allSubs.filter(s => s.status === "active").length;
  const suspendedCount = allSubs.filter(s => s.status === "suspended").length;

  const filteredSubs = useMemo(() => {
    return allSubs
      .filter(s => subFilter === "all" || s.status === subFilter)
      .filter(s => {
        if (!subSearch) return true;
        const q = subSearch.toLowerCase();
        return (
          (s.username || "").toLowerCase().includes(q) ||
          (s.userEmail || "").toLowerCase().includes(q) ||
          (s.courseTitleAr || "").toLowerCase().includes(q) ||
          (s.courseTitleEn || "").toLowerCase().includes(q)
        );
      });
  }, [allSubs, subFilter, subSearch]);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (!userSearch) return users;
    const q = userSearch.toLowerCase();
    return users.filter(u =>
      u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [users, userSearch]);

  const statCards = [
    { icon: Users,     value: stats?.totalUsers || 0,           label: t("إجمالي المتدربين", "Total Trainees"),      color: "text-blue-400",   bg: "bg-blue-500/10" },
    { icon: Activity,  value: activeCount,                       label: t("اشتراكات نشطة", "Active Subscriptions"),   color: "text-green-400",  bg: "bg-green-500/10" },
    { icon: Clock,     value: pendingCount,                      label: t("طلبات انتظار", "Pending Requests"),        color: "text-yellow-400", bg: "bg-yellow-500/10" },
    { icon: PauseCircle, value: suspendedCount,                  label: t("اشتراكات موقوفة", "Suspended"),            color: "text-orange-400", bg: "bg-orange-500/10" },
    { icon: BookOpen,  value: stats?.totalCourses || 0,          label: t("إجمالي المسارات", "Total Courses"),        color: "text-purple-400", bg: "bg-purple-500/10" },
    { icon: TrendingUp, value: stats?.totalXpAwarded || 0,       label: t("مجموع الخبرة XP", "Total XP Awarded"),    color: "text-pink-400",   bg: "bg-pink-500/10" },
    { icon: CreditCard, value: stats?.totalSubscriptions || 0,   label: t("إجمالي الاشتراكات", "Total Subscriptions"), color: "text-cyan-400",  bg: "bg-cyan-500/10" },
    { icon: Award,     value: stats?.recentSignups || 0,         label: t("انضم مؤخراً", "Recent Signups"),          color: "text-indigo-400", bg: "bg-indigo-500/10" },
  ];

  const filterButtons: { key: SubStatus; labelAr: string; labelEn: string; count?: number }[] = [
    { key: "all",       labelAr: "الكل",    labelEn: "All",       count: allSubs.length },
    { key: "pending",   labelAr: "انتظار",  labelEn: "Pending",   count: pendingCount },
    { key: "active",    labelAr: "نشط",    labelEn: "Active",    count: activeCount },
    { key: "suspended", labelAr: "موقوف",  labelEn: "Suspended", count: suspendedCount },
    { key: "rejected",  labelAr: "مرفوض", labelEn: "Rejected",  count: allSubs.filter(s => s.status === "rejected").length },
  ];

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 max-w-7xl">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10">
          <ShieldAlert className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{t("لوحة الإدارة", "Admin Dashboard")}</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{t("إدارة المتدربين والاشتراكات", "Manage trainees and subscriptions")}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map((card, i) => (
          <Card key={i} className="border-border/50 hover:border-border transition-colors">
            <CardContent className="p-5">
              <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div className="text-2xl font-bold">{card.value.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{card.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="subscriptions" className="w-full">
        <TabsList className="mb-6 h-auto gap-1 p-1">
          <TabsTrigger value="subscriptions" className="gap-2">
            <CreditCard className="w-4 h-4" />
            {t("إدارة الاشتراكات", "Subscriptions")}
            {pendingCount > 0 && (
              <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="w-4 h-4" />
            {t("المتدربون", "Trainees")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {filterButtons.map(fb => (
                <button
                  key={fb.key}
                  onClick={() => setSubFilter(fb.key)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 border ${
                    subFilter === fb.key
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  {lang === "ar" ? fb.labelAr : fb.labelEn}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${subFilter === fb.key ? "bg-white/20" : "bg-muted"}`}>
                    {fb.count}
                  </span>
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t("بحث بالاسم أو الدورة...", "Search by name or course...")}
                value={subSearch}
                onChange={e => setSubSearch(e.target.value)}
                className="ps-9"
              />
            </div>
          </div>

          <Card className="border-border/50">
            <CardContent className="p-0">
              {filteredSubs.length === 0 ? (
                <div className="text-center p-12 text-muted-foreground">
                  <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>{t("لا توجد اشتراكات", "No subscriptions found")}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/50">
                        <TableHead className="font-semibold">{t("المتدرب", "Trainee")}</TableHead>
                        <TableHead className="font-semibold">{t("المسار", "Course")}</TableHead>
                        <TableHead className="font-semibold">{t("الحالة", "Status")}</TableHead>
                        <TableHead className="font-semibold">{t("تاريخ الطلب", "Request Date")}</TableHead>
                        <TableHead className="font-semibold">{t("تاريخ الموافقة", "Approved Date")}</TableHead>
                        <TableHead className="font-semibold text-center">{t("الإجراءات", "Actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubs.map(sub => {
                        const sc = statusConfig[sub.status] || statusConfig.pending;
                        return (
                          <TableRow key={sub.id} className="border-border/30 hover:bg-muted/30">
                            <TableCell>
                              <div className="font-medium">{sub.username}</div>
                              <div className="text-xs text-muted-foreground">{sub.userEmail}</div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{lang === "ar" ? sub.courseTitleAr : sub.courseTitleEn}</div>
                              <div className="text-xs text-muted-foreground">{sub.courseSlug}</div>
                            </TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${sc.color}`}>
                                {lang === "ar" ? sc.label : sc.labelEn}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(sub.createdAt).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-GB")}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {sub.approvedAt
                                ? new Date(sub.approvedAt).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-GB")
                                : <span className="text-muted-foreground/50">—</span>}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                {(sub.status === "pending" || sub.status === "rejected" || sub.status === "suspended") && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 px-3 bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20 hover:text-green-300"
                                    onClick={() => handleApprove(sub.id)}
                                    disabled={approveSub.isPending}
                                  >
                                    <Check className="w-3.5 h-3.5 me-1" />
                                    {t("قبول", "Approve")}
                                  </Button>
                                )}
                                {sub.status === "active" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 px-3 bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20 hover:text-orange-300"
                                    onClick={() => handleSuspend(sub.id)}
                                    disabled={suspendSub.isPending}
                                  >
                                    <PauseCircle className="w-3.5 h-3.5 me-1" />
                                    {t("إيقاف", "Suspend")}
                                  </Button>
                                )}
                                {sub.status === "suspended" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 px-3 bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20 hover:text-blue-300"
                                    onClick={() => handleReactivate(sub.id)}
                                    disabled={reactivateSub.isPending}
                                  >
                                    <PlayCircle className="w-3.5 h-3.5 me-1" />
                                    {t("تفعيل", "Reactivate")}
                                  </Button>
                                )}
                                {sub.status !== "rejected" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 px-3 bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 hover:text-red-300"
                                    onClick={() => handleReject(sub.id)}
                                    disabled={rejectSub.isPending}
                                  >
                                    <X className="w-3.5 h-3.5 me-1" />
                                    {t("رفض", "Reject")}
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("بحث بالاسم أو البريد...", "Search by name or email...")}
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
              className="ps-9"
            />
          </div>

          <Card className="border-border/50">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead className="font-semibold">{t("المتدرب", "Trainee")}</TableHead>
                      <TableHead className="font-semibold">{t("الصلاحية", "Role")}</TableHead>
                      <TableHead className="font-semibold">{t("الخبرة", "XP")}</TableHead>
                      <TableHead className="font-semibold">{t("المستوى", "Level")}</TableHead>
                      <TableHead className="font-semibold">{t("السلسلة", "Streak")}</TableHead>
                      <TableHead className="font-semibold text-center">{t("الإجراء", "Action")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map(u => (
                      <TableRow key={u.id} className="border-border/30 hover:bg-muted/30">
                        <TableCell>
                          <div className="font-medium">{u.username}</div>
                          <div className="text-xs text-muted-foreground">{u.email}</div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={u.role === "admin" ? "default" : "secondary"}
                            className={u.role === "admin" ? "bg-primary/20 text-primary border-primary/30" : ""}
                          >
                            {u.role === "admin" ? t("مدير", "Admin") : t("متدرب", "Student")}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-yellow-400">{u.xp.toLocaleString()}</TableCell>
                        <TableCell>{u.level}</TableCell>
                        <TableCell>{u.streak} 🔥</TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={u.id === user.id}
                            className={u.role === "admin"
                              ? "border-red-500/20 text-red-400 hover:bg-red-500/10"
                              : "border-primary/20 text-primary hover:bg-primary/10"}
                            onClick={() => handleToggleRole(u.id, u.role)}
                          >
                            {u.role === "admin"
                              ? t("تخفيض لمتدرب", "Demote to Student")
                              : t("ترقية لمدير", "Promote to Admin")}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
