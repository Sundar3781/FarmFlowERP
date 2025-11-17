import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { ClipboardCheck, Camera, Calendar as CalendarIcon, Download, UserPlus, Search } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function AttendancePage() {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [biometricDialogOpen, setBiometricDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: attendanceRecords, isLoading } = useQuery({
    queryKey: ["/api/attendance", format(selectedDate, "yyyy-MM-dd")],
  });

  const mockEmployees = [
    { id: "1", name: "Rajesh Kumar", role: "Supervisor", status: "Present", checkIn: "08:45", checkOut: "17:30", hours: "8.75" },
    { id: "2", name: "Priya Sharma", role: "Operator", status: "Present", checkIn: "09:00", checkOut: "17:45", hours: "8.75" },
    { id: "3", name: "Arun Patel", role: "Worker", status: "Late", checkIn: "09:30", checkOut: "-", hours: "-" },
    { id: "4", name: "Meena Devi", role: "Worker", status: "Absent", checkIn: "-", checkOut: "-", hours: "0" },
    { id: "5", name: "Suresh Babu", role: "Operator", status: "Present", checkIn: "08:30", checkOut: "17:15", hours: "8.75" },
  ];

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
    // Simulate biometric capture
    setTimeout(() => {
      setBiometricDialogOpen(false);
    }, 1500);
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
                Biometric Capture
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Biometric Attendance</DialogTitle>
                <DialogDescription>
                  Place your finger on the scanner
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                    <Camera className="h-16 w-16 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Scanning fingerprint...</p>
                </div>
                <Button className="w-full" onClick={handleBiometricCapture} data-testid="button-confirm-capture">
                  Confirm Attendance
                </Button>
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
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">45</div>
            <p className="text-xs text-muted-foreground mt-1">Active workers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-primary">42</div>
            <p className="text-xs text-muted-foreground mt-1">93.3% attendance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-destructive">3</div>
            <p className="text-xs text-muted-foreground mt-1">6.7% absent rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Work Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">8.5</div>
            <p className="text-xs text-muted-foreground mt-1">Hours per day</p>
          </CardContent>
        </Card>
      </div>

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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockEmployees.map((emp) => (
                        <TableRow key={emp.id} data-testid={`row-employee-${emp.id}`}>
                          <TableCell className="font-medium">{emp.name}</TableCell>
                          <TableCell className="text-muted-foreground">{emp.role}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(emp.status)}>
                              {emp.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono">{emp.checkIn}</TableCell>
                          <TableCell className="font-mono">{emp.checkOut}</TableCell>
                          <TableCell className="font-mono font-semibold">{emp.hours}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
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
