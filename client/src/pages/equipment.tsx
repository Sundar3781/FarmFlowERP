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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Wrench, Plus, Calendar, Fuel, AlertCircle } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { format } from "date-fns";

export default function EquipmentPage() {
  const { t } = useLanguage();
  const [addEquipmentDialogOpen, setAddEquipmentDialogOpen] = useState(false);
  const [addMaintenanceDialogOpen, setAddMaintenanceDialogOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);

  const { data: equipment, isLoading } = useQuery({
    queryKey: ["/api/equipment"],
  });

  const mockEquipment = [
    { 
      id: "1", 
      name: "Mahindra Tractor 575 DI", 
      type: "Tractor",
      registrationNumber: "TN-38-AB-1234",
      status: "Operational",
      lastService: "2024-10-15",
      nextService: "2024-12-15",
      purchaseDate: "2020-03-10",
      purchaseCost: 750000,
      location: "Main Barn"
    },
    { 
      id: "2", 
      name: "Knapsack Sprayer", 
      type: "Sprayer",
      registrationNumber: "-",
      status: "Operational",
      lastService: "2024-11-01",
      nextService: "2025-02-01",
      purchaseDate: "2023-06-20",
      purchaseCost: 12000,
      location: "Tool Shed"
    },
    { 
      id: "3", 
      name: "Submersible Pump 5HP", 
      type: "Pump",
      registrationNumber: "-",
      status: "UnderMaintenance",
      lastService: "2024-11-10",
      nextService: "2025-01-10",
      purchaseDate: "2021-08-15",
      purchaseCost: 45000,
      location: "Well #2"
    },
    { 
      id: "4", 
      name: "Pickup Truck", 
      type: "Vehicle",
      registrationNumber: "TN-38-CD-5678",
      status: "Operational",
      lastService: "2024-10-20",
      nextService: "2024-12-20",
      purchaseDate: "2019-11-05",
      purchaseCost: 850000,
      location: "Parking Area"
    },
  ];

  const mockFuelLogs = [
    { id: "1", equipmentId: "1", date: "2024-11-17", quantity: 45, cost: 4275, operator: "Rajesh Kumar" },
    { id: "2", equipmentId: "4", date: "2024-11-16", quantity: 30, cost: 2850, operator: "Arun Patel" },
    { id: "3", equipmentId: "1", date: "2024-11-15", quantity: 50, cost: 4750, operator: "Suresh Babu" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Operational": return "default";
      case "UnderMaintenance": return "secondary";
      case "Broken": return "destructive";
      default: return "default";
    }
  };

  const isServiceDue = (nextService: string) => {
    const daysUntilService = Math.ceil((new Date(nextService).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilService <= 7;
  };

  return (
    <div className="p-6 space-y-6" data-testid="page-equipment">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Wrench className="h-8 w-8 text-gray-600" />
            {t("equipment")}
          </h1>
          <p className="text-muted-foreground mt-1">Manage equipment and vehicle maintenance</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={addEquipmentDialogOpen} onOpenChange={setAddEquipmentDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-equipment">
                <Plus className="h-4 w-4 mr-2" />
                Add Equipment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Register Equipment</DialogTitle>
                <DialogDescription>
                  Add new equipment or vehicle to the system
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="equipment-name">Equipment Name</Label>
                  <Input id="equipment-name" placeholder="e.g., Mahindra Tractor" data-testid="input-equipment-name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select>
                      <SelectTrigger id="type" data-testid="select-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tractor">Tractor</SelectItem>
                        <SelectItem value="sprayer">Sprayer</SelectItem>
                        <SelectItem value="pump">Pump</SelectItem>
                        <SelectItem value="vehicle">Vehicle</SelectItem>
                        <SelectItem value="tool">Tool</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registration">Registration Number</Label>
                    <Input id="registration" placeholder="Optional" data-testid="input-registration" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="purchase-date">Purchase Date</Label>
                    <Input id="purchase-date" type="date" data-testid="input-purchase-date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchase-cost">Purchase Cost (₹)</Label>
                    <Input id="purchase-cost" type="number" placeholder="750000" data-testid="input-purchase-cost" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="equipment-location">Location</Label>
                  <Input id="equipment-location" placeholder="e.g., Main Barn" data-testid="input-equipment-location" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddEquipmentDialogOpen(false)} data-testid="button-cancel">
                  Cancel
                </Button>
                <Button onClick={() => setAddEquipmentDialogOpen(false)} data-testid="button-submit-equipment">
                  Register Equipment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{mockEquipment.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operational</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-primary">
              {mockEquipment.filter(e => e.status === "Operational").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Working equipment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-orange-600 dark:text-orange-400">
              {mockEquipment.filter(e => e.status === "UnderMaintenance").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Being serviced</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-red-600 dark:text-red-400">
              {mockEquipment.filter(e => isServiceDue(e.nextService)).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Within 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="equipment" className="space-y-4">
        <TabsList>
          <TabsTrigger value="equipment" data-testid="tab-equipment">Equipment List</TabsTrigger>
          <TabsTrigger value="maintenance" data-testid="tab-maintenance">Maintenance Records</TabsTrigger>
          <TabsTrigger value="fuel" data-testid="tab-fuel">Fuel Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="equipment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Equipment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Equipment Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Registration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Service</TableHead>
                      <TableHead>Next Service</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockEquipment.map((item) => (
                      <TableRow key={item.id} data-testid={`row-equipment-${item.id}`}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.type}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{item.registrationNumber}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(item.status)}>
                            {item.status === "UnderMaintenance" ? "Under Maintenance" : item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{format(new Date(item.lastService), "PP")}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={isServiceDue(item.nextService) ? "text-red-600 dark:text-red-400 font-medium" : ""}>
                              {format(new Date(item.nextService), "PP")}
                            </span>
                            {isServiceDue(item.nextService) && (
                              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.location}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" data-testid={`button-maintenance-${item.id}`}>
                            Log Maintenance
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

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Maintenance History</CardTitle>
              <Dialog open={addMaintenanceDialogOpen} onOpenChange={setAddMaintenanceDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" data-testid="button-add-maintenance">
                    <Plus className="h-4 w-4 mr-2" />
                    Log Maintenance
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Log Maintenance Record</DialogTitle>
                    <DialogDescription>
                      Record equipment maintenance or repair
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="maintenance-equipment">Equipment</Label>
                      <Select>
                        <SelectTrigger id="maintenance-equipment" data-testid="select-maintenance-equipment">
                          <SelectValue placeholder="Select equipment" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockEquipment.map((eq) => (
                            <SelectItem key={eq.id} value={eq.id}>{eq.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="maintenance-date">Date</Label>
                        <Input id="maintenance-date" type="date" data-testid="input-maintenance-date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maintenance-type">Type</Label>
                        <Select>
                          <SelectTrigger id="maintenance-type" data-testid="select-maintenance-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="routine">Routine Service</SelectItem>
                            <SelectItem value="repair">Repair</SelectItem>
                            <SelectItem value="inspection">Inspection</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maintenance-description">Description</Label>
                      <Textarea id="maintenance-description" placeholder="Describe the maintenance work..." data-testid="textarea-maintenance-description" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="maintenance-cost">Cost (₹)</Label>
                        <Input id="maintenance-cost" type="number" step="0.01" data-testid="input-maintenance-cost" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="next-service-due">Next Service Due</Label>
                        <Input id="next-service-due" type="date" data-testid="input-next-service-due" />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAddMaintenanceDialogOpen(false)} data-testid="button-cancel-maintenance">
                      Cancel
                    </Button>
                    <Button onClick={() => setAddMaintenanceDialogOpen(false)} data-testid="button-submit-maintenance">
                      Save Record
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Maintenance records will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fuel" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Fuel className="h-5 w-5 text-blue-600" />
                Fuel Consumption Logs
              </CardTitle>
              <Button size="sm" data-testid="button-add-fuel-log">
                <Plus className="h-4 w-4 mr-2" />
                Log Fuel
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Equipment</TableHead>
                      <TableHead>Quantity (L)</TableHead>
                      <TableHead>Cost (₹)</TableHead>
                      <TableHead>Operator</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockFuelLogs.map((log) => {
                      const equipment = mockEquipment.find(e => e.id === log.equipmentId);
                      return (
                        <TableRow key={log.id} data-testid={`row-fuel-log-${log.id}`}>
                          <TableCell>{format(new Date(log.date), "PP")}</TableCell>
                          <TableCell className="font-medium">{equipment?.name}</TableCell>
                          <TableCell className="font-mono">{log.quantity}L</TableCell>
                          <TableCell className="font-mono">₹{log.cost.toLocaleString()}</TableCell>
                          <TableCell className="text-muted-foreground">{log.operator}</TableCell>
                        </TableRow>
                      );
                    })}
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
