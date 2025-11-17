import { useQuery } from "@tanstack/react-query";
import { KPICard } from "@/components/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LayoutGrid, 
  Users, 
  Sprout, 
  Package, 
  Beef, 
  DollarSign, 
  AlertTriangle,
  TrendingUp,
  Calendar
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export default function DashboardPage() {
  const { t } = useLanguage();

  // Fetch dashboard statistics
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  // Mock data for charts
  const attendanceData = [
    { day: "Mon", present: 42, absent: 3 },
    { day: "Tue", present: 45, absent: 0 },
    { day: "Wed", present: 43, absent: 2 },
    { day: "Thu", present: 44, absent: 1 },
    { day: "Fri", present: 45, absent: 0 },
  ];

  const monthlyFinancials = [
    { month: "Jan", revenue: 450000, expense: 320000 },
    { month: "Feb", revenue: 520000, expense: 380000 },
    { month: "Mar", revenue: 480000, expense: 340000 },
    { month: "Apr", revenue: 550000, expense: 390000 },
    { month: "May", revenue: 610000, expense: 420000 },
    { month: "Jun", revenue: 580000, expense: 410000 },
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" data-testid="page-dashboard">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to your farm management system</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title={t("total_plots")}
          value={stats?.totalPlots || 12}
          icon={Sprout}
          trend={{ value: 8.2, isPositive: true }}
          gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        />
        <KPICard
          title={t("employees")}
          value={stats?.totalEmployees || 45}
          icon={Users}
          trend={{ value: 2.5, isPositive: true }}
          gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
        />
        <KPICard
          title={t("total_animals")}
          value={stats?.totalAnimals || 87}
          icon={Beef}
          trend={{ value: 5.1, isPositive: true }}
          gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
        />
        <KPICard
          title={t("inventory_alerts")}
          value={stats?.inventoryAlerts || 3}
          icon={AlertTriangle}
          className="border-orange-200 dark:border-orange-800"
          gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
        />
      </div>

      {/* Financial Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">₹5,80,000</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-primary font-medium">+12.5%</span> from last month
            </p>
            <Progress value={75} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Monthly Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">₹4,10,000</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-orange-600 font-medium">+8.2%</span> from last month
            </p>
            <Progress value={60} className="mt-3" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Attendance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Weekly Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="present" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Financial Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              Financial Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyFinancials}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expense" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--destructive))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities & Alerts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { item: "NPK Fertilizer (10-26-26)", stock: "25 kg", reorder: "100 kg", status: "critical" },
              { item: "Pesticide - Chlorpyrifos", stock: "8 liters", reorder: "20 liters", status: "warning" },
              { item: "Drip Irrigation Pipes", stock: "45 meters", reorder: "200 meters", status: "low" },
            ].map((alert, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border hover-elevate">
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.item}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Current: <span className="font-mono">{alert.stock}</span> • Reorder: <span className="font-mono">{alert.reorder}</span>
                  </p>
                </div>
                <Badge variant={alert.status === "critical" ? "destructive" : "secondary"} className="ml-2">
                  {alert.status === "critical" ? "Critical" : "Low"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { task: "Banana Plot A - Fertilizer Application", due: "Today", priority: "high" },
              { task: "Cow #B-234 - Vaccination Due", due: "Tomorrow", priority: "medium" },
              { task: "Tractor Service - Due in 3 days", due: "Dec 20", priority: "medium" },
              { task: "Monthly Financial Report", due: "Dec 31", priority: "low" },
            ].map((task, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border hover-elevate">
                <div className={`h-2 w-2 rounded-full mt-1.5 ${
                  task.priority === "high" ? "bg-red-500" :
                  task.priority === "medium" ? "bg-yellow-500" : "bg-blue-500"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{task.task}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Due: {task.due}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
