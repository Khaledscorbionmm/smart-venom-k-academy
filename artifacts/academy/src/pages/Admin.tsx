import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useGetAdminStats, useAdminGetUsers, useGetSubscriptions, useApproveSubscription, useRejectSubscription, useAdminUpdateUser, getGetAdminStatsQueryKey, getAdminGetUsersQueryKey, getGetSubscriptionsQueryKey } from "@workspace/api-client-react";
import { Redirect } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Users, BookOpen, CreditCard, Award, Check, X, ShieldAlert } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Admin() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isAdmin = user?.role === 'admin';
  const { data: stats } = useGetAdminStats({ query: { queryKey: getGetAdminStatsQueryKey(), enabled: isAdmin } as any });
  const { data: users } = useAdminGetUsers({ query: { queryKey: getAdminGetUsersQueryKey(), enabled: isAdmin } as any });
  const { data: subscriptions } = useGetSubscriptions({ query: { queryKey: getGetSubscriptionsQueryKey(), enabled: isAdmin } as any });

  const approveSub = useApproveSubscription();
  const rejectSub = useRejectSubscription();
  const updateUser = useAdminUpdateUser();

  if (user?.role !== 'admin') {
    return <Redirect to="/dashboard" />;
  }

  const handleApprove = (id: number) => {
    approveSub.mutate(
      { id },
      {
        onSuccess: () => {
          toast.success(t('تم قبول الاشتراك', 'Subscription approved'));
          queryClient.invalidateQueries({ queryKey: getGetSubscriptionsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
        }
      }
    );
  };

  const handleReject = (id: number) => {
    rejectSub.mutate(
      { id },
      {
        onSuccess: () => {
          toast.success(t('تم رفض الاشتراك', 'Subscription rejected'));
          queryClient.invalidateQueries({ queryKey: getGetSubscriptionsQueryKey() });
        }
      }
    );
  };

  const handleToggleRole = (userId: number, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'student' : 'admin';
    updateUser.mutate(
      { id: userId, data: { role: newRole as any } },
      {
        onSuccess: () => {
          toast.success(t('تم تحديث الصلاحية', 'Role updated'));
          queryClient.invalidateQueries({ queryKey: getAdminGetUsersQueryKey() });
        }
      }
    );
  };

  const pendingSubs = subscriptions?.filter(s => s.status === 'pending') || [];

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <ShieldAlert className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">{t('لوحة الإدارة', 'Admin Dashboard')}</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-card">
          <CardContent className="p-6 flex flex-col justify-center">
            <Users className="w-6 h-6 text-blue-500 mb-2" />
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <div className="text-sm text-muted-foreground">{t('إجمالي المستخدمين', 'Total Users')}</div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-6 flex flex-col justify-center">
            <BookOpen className="w-6 h-6 text-purple-500 mb-2" />
            <div className="text-2xl font-bold">{stats?.totalCourses || 0}</div>
            <div className="text-sm text-muted-foreground">{t('إجمالي الدورات', 'Total Courses')}</div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-6 flex flex-col justify-center">
            <CreditCard className="w-6 h-6 text-green-500 mb-2" />
            <div className="text-2xl font-bold">{stats?.pendingSubscriptions || 0}</div>
            <div className="text-sm text-muted-foreground">{t('طلبات انتظار', 'Pending Requests')}</div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-6 flex flex-col justify-center">
            <Award className="w-6 h-6 text-yellow-500 mb-2" />
            <div className="text-2xl font-bold">{stats?.totalXpAwarded || 0}</div>
            <div className="text-sm text-muted-foreground">{t('مجموع الخبرة', 'Total XP Awarded')}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="subscriptions" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="subscriptions">
            {t('طلبات الاشتراك', 'Subscription Requests')}
            {pendingSubs.length > 0 && (
              <Badge variant="destructive" className="ml-2 rtl:mr-2 rtl:ml-0">{pendingSubs.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="users">{t('المستخدمين', 'Users')}</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>{t('طلبات قيد الانتظار', 'Pending Requests')}</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingSubs.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                  {t('لا توجد طلبات جديدة', 'No pending requests')}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('المستخدم', 'User')}</TableHead>
                        <TableHead>{t('المسار', 'Course')}</TableHead>
                        <TableHead>{t('التاريخ', 'Date')}</TableHead>
                        <TableHead className="text-right rtl:text-left">{t('الإجراء', 'Action')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingSubs.map((sub) => (
                        <TableRow key={sub.id}>
                          <TableCell className="font-medium">
                            {sub.username} <span className="text-muted-foreground text-sm">({sub.userEmail})</span>
                          </TableCell>
                          <TableCell>{t(sub.courseTitleAr || '', sub.courseTitleEn || '')}</TableCell>
                          <TableCell>{new Date(sub.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right rtl:text-left">
                            <div className="flex justify-end rtl:justify-start gap-2">
                              <Button size="sm" variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20" onClick={() => handleApprove(sub.id)}>
                                <Check className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" /> {t('قبول', 'Approve')}
                              </Button>
                              <Button size="sm" variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20" onClick={() => handleReject(sub.id)}>
                                <X className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" /> {t('رفض', 'Reject')}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>{t('إدارة المستخدمين', 'User Management')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('الاسم', 'Username')}</TableHead>
                      <TableHead>{t('البريد', 'Email')}</TableHead>
                      <TableHead>{t('الرتبة', 'Role')}</TableHead>
                      <TableHead>{t('الخبرة', 'XP')}</TableHead>
                      <TableHead className="text-right rtl:text-left">{t('الإجراء', 'Action')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.username}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>
                          <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>
                            {u.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{u.xp}</TableCell>
                        <TableCell className="text-right rtl:text-left">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            disabled={u.id === user.id} // Can't change own role
                            onClick={() => handleToggleRole(u.id, u.role)}
                          >
                            {u.role === 'admin' ? t('تخفيض لصلاحية طالب', 'Demote to Student') : t('ترقية كمدير', 'Promote to Admin')}
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