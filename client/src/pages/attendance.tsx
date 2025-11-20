import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardCheck, Camera, Calendar as CalendarIcon, Download, UserPlus, Search, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { User, Attendance } from "@shared/schema";

export default function AttendancePage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [biometricDialogOpen, setBiometricDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const dateStr = format(selectedDate, "yyyy-MM-dd");

  const { data: users, isLoading: usersLoading, error: usersError } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: attendanceRecords = [], isLoading: attendanceLoading, error: attendanceError } = useQuery<Attendance[]>({
    queryKey: ["/api/attendance", { date: dateStr }],
    enabled: !!dateStr,
  });

  const createAttendanceMutation = useMutation({
    mutationFn: async (data: { userId: string; status: string }) => {
      const now = new Date();
      const res = await apiRequest("POST", "/api/attendance", {
        userId: data.userId,
        date: dateStr,
        status: data.status,
        checkIn: data.status !== "Absent" ? format(now, "HH:mm:ss") : null,
        checkOut: null,
        workHours: null,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/attendance"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"], exact: false });
      toast({
        title: "Success",
        description: "Attendance recorded successfully",
      });
      setBiometricDialogOpen(false);
      setSelectedUserId("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to record attendance",
        variant: "destructive",
      });
    },
  });

  const updateCheckoutMutation = useMutation({
    mutationFn: async (attendanceId: string) => {
      const now = new Date();
      const attendance = attendanceRecords.find(a => a.id === attendanceId);
      if (!attendance?.checkIn) {
        throw new Error("No check-in time found");
      }

      const checkInTime = new Date(`${dateStr}T${attendance.checkIn}`);
      const checkOutTime = now;
      const hours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

      const res = await apiRequest("PATCH", `/api/attendance/${attendanceId}`, {
        checkOut: format(now, "HH:mm:ss"),
        workHours: Math.round(hours * 100) / 100,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/attendance"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"], exact: false });
      toast({
        title: "Success",
        description: "Check-out recorded successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to record check-out",
        variant: "destructive",
      });
    },
  });

  const employeeUsers = useMemo(() => {
    return users?.filter(u => u.role !== "Admin") || [];
  }, [users]);

  const attendanceWithUsers = useMemo(() => {
    if (!users || !attendanceRecords) return [];
    const allRecords = attendanceRecords.map(attendance => {
      const user = users.find(u => u.id === attendance.userId);
      return {
        ...attendance,
        userName: user?.fullName || "Unknown",
        userRole: user?.role || "Unknown",
      };
    });

    if (!searchQuery.trim()) return allRecords;

    const query = searchQuery.toLowerCase();
    return allRecords.filter(record => 
      record.userName.toLowerCase().includes(query) ||
      record.userRole.toLowerCase().includes(query)
    );
  }, [users, attendanceRecords, searchQuery]);

  const stats = useMemo(() => {
    const total = employeeUsers.length;
    const present = attendanceRecords.filter(a => a.status === "Present").length;
    const late = attendanceRecords.filter(a => a.status === "Late").length;
    
    const uniqueUserIds = new Set(attendanceRecords.map(a => a.userId));
    const recordedEmployees = uniqueUserIds.size;
    const absent = total - recordedEmployees;
    
    const totalWorkHours = attendanceRecords.reduce((sum, a) => {
      const hours = typeof a.workHours === 'number' ? a.workHours : parseFloat(String(a.workHours || 0));
      return sum + (isNaN(hours) ? 0 : hours);
    }, 0);
    const workingCount = attendanceRecords.filter(a => {
      const hours = typeof a.workHours === 'number' ? a.workHours : parseFloat(String(a.workHours || 0));
      return !isNaN(hours) && hours > 0;
    }).length;
    const avgHours = workingCount > 0 ? totalWorkHours / workingCount : 0;

    return {
      total,
      present: present + late,
      absent: Math.max(0, absent),
      avgHours: isNaN(avgHours) ? 0 : Math.round(avgHours * 100) / 100,
      attendanceRate: total > 0 ? Math.round(((present + late) / total) * 1000) / 10 : 0,
    };
  }, [employeeUsers, attendanceRecords]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present": return "default";
      case "Late": return "secondary";
      case "Absent": return "destructive";
      case "HalfDay": return "secondary";
      default: return "default";
    }
  };

  const handleBiometricCapture = () => {
    if (!selectedUserId) {
      toast({
        title: "Error",
        description: "Please select an employee",
        variant: "destructive",
      });
      return;
    }

    const existingRecord = attendanceRecords.find(a => a.userId === selectedUserId);
    if (existingRecord) {
      toast({
        title: "Error",
        description: "Attendance already recorded for this employee today",
        variant: "destructive",
      });
      return;
    }

    createAttendanceMutation.mutate({ userId: selectedUserId, status: "Present" });
  };

  return (
    <div className="p-6 space-y-6" data-testid="page-attendance">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ClipboardCheck className="h-8 w-8 text-purple-600" />
            {t("attendance")}
          </h1>
          <p className="text-muted-foreground mt-1">Track employee attendance and work hours</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={biometricDialogOpen} onOpenChange={setBiometricDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-biometric-capture">
                <Camera className="h-4 w-4 mr-2" />
                Check-In
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Attendance</DialogTitle>
                <DialogDescription>
                  Select employee and record check-in
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {usersError ? (
                  <div className="text-sm text-destructive p-4 bg-destructive/10 rounded-md">
                    Failed to load employee list. Please try again.
                  </div>
                ) : usersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="employee-select">Employee</Label>
                      <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                        <SelectTrigger id="employee-select" data-testid="select-employee">
                          <SelectValue placeholder="Select employee..." />
                        </SelectTrigger>
                        <SelectContent>
                          {employeeUsers.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.fullName} ({user.role})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handleBiometricCapture} 
                      disabled={createAttendanceMutation.isPending || !selectedUserId}
                      data-testid="button-confirm-capture"
                    >
                      {createAttendanceMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Recording...
                        </>
                      ) : (
                        "Confirm Check-In"
                      )}
                    </Button>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" data-testid="button-export-attendance">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {attendanceError ? (
        <Card className="col-span-4">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              Failed to load attendance data. Stats unavailable.
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{usersLoading ? "-" : stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">Active workers</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono text-primary">
                {attendanceLoading ? "-" : stats.present}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stats.attendanceRate}% attendance</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono text-destructive">
                {attendanceLoading ? "-" : stats.absent}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.total > 0 ? `${Math.round((stats.absent / stats.total) * 1000) / 10}%` : "0%"} absent rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Work Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">
                {attendanceLoading ? "-" : stats.avgHours}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Hours per day</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily" data-testid="tab-daily">Daily View</TabsTrigger>
          <TabsTrigger value="weekly" data-testid="tab-weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly" data-testid="tab-monthly">Monthly Report</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Attendance - {format(selectedDate, "PPP")}</CardTitle>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[240px] justify-start" data-testid="button-date-picker">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(selectedDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search employees..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      data-testid="input-search-employee"
                    />
                  </div>
                </div>

                {attendanceError ? (
                  <div className="text-center py-12">
                    <div className="text-destructive mb-2">Failed to load attendance records</div>
                    <p className="text-sm text-muted-foreground">Please try again or contact support</p>
                  </div>
                ) : attendanceLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : attendanceWithUsers.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No attendance records for this date</p>
                    <p className="text-sm mt-2">Click "Check-In" to record attendance</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee Name</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Check In</TableHead>
                          <TableHead>Check Out</TableHead>
                          <TableHead>Hours</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attendanceWithUsers.map((record) => (
                          <TableRow key={record.id} data-testid={`row-employee-${record.userId}`}>
                            <TableCell className="font-medium">{record.userName}</TableCell>
                            <TableCell className="text-muted-foreground">{record.userRole}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusColor(record.status)}>
                                {record.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono">
                              {record.checkIn ? record.checkIn.substring(0, 5) : "-"}
                            </TableCell>
                            <TableCell className="font-mono">
                              {record.checkOut ? record.checkOut.substring(0, 5) : "-"}
                            </TableCell>
                            <TableCell className="font-mono font-semibold">
                              {record.workHours != null && typeof record.workHours === 'number' 
                                ? record.workHours.toFixed(2) 
                                : record.workHours != null && !isNaN(Number(record.workHours))
                                ? Number(record.workHours).toFixed(2)
                                : "-"}
                            </TableCell>
                            <TableCell>
                              {record.checkIn && !record.checkOut && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateCheckoutMutation.mutate(record.id)}
                                  disabled={updateCheckoutMutation.isPending}
                                  data-testid={`button-checkout-${record.id}`}
                                >
                                  Check-Out
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Attendance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Weekly attendance visualization will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Attendance Report</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Monthly attendance statistics and reports will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
