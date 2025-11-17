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
import { Package, Plus, AlertTriangle, TrendingDown, TrendingUp, Download, ArrowUpDown } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { Progress } from "@/components/ui/progress";

export default function InventoryPage() {
  const { t } = useLanguage();
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: inventory, isLoading } = useQuery({
    queryKey: ["/api/inventory"],
  });

  const mockInventory = [
    { 
      id: "1", 
      name: "NPK Fertilizer (10-26-26)", 
      category: "Fertilizer", 
      currentStock: 25, 
      reorderLevel: 100, 
      unit: "kg",
      location: "Warehouse A",
      unitPrice: 45,
      lastRestocked: "2024-11-10",
      status: "critical"
    },
    { 
      id: "2", 
      name: "Pesticide - Chlorpyrifos", 
      category: "Pesticide", 
      currentStock: 8, 
      reorderLevel: 20, 
      unit: "liters",
      location: "Storage Room B",
      unitPrice: 850,
      lastRestocked: "2024-11-05",
      status: "low"
    },
    { 
      id: "3", 
      name: "Drip Irrigation Pipes", 
      category: "Equipment", 
      currentStock: 450, 
      reorderLevel: 200, 
      unit: "meters",
      location: "Warehouse A",
      unitPrice: 25,
      lastRestocked: "2024-10-20",
      status: "adequate"
    },
    { 
      id: "4", 
      name: "Banana Seeds - Grand Naine", 
      category: "Seeds", 
      currentStock: 2400, 
      reorderLevel: 500, 
      unit: "pieces",
      location: "Cold Storage",
      unitPrice: 12,
      lastRestocked: "2024-11-15",
      status: "adequate"
    },
    { 
      id: "5", 
      name: "Diesel Fuel", 
      category: "Fuel", 
      currentStock: 380, 
      reorderLevel: 500, 
      unit: "liters",
      location: "Fuel Tank",
      unitPrice: 95,
      lastRestocked: "2024-11-16",
      status: "low"
    },
  ];

  const getStockStatus = (current: number, reorder: number) => {
    const percentage = (current / reorder) * 100;
    if (percentage <= 50) return "critical";
    if (percentage <= 100) return "low";
    return "adequate";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "destructive";
      case "low": return "secondary";
      case "adequate": return "default";
      default: return "default";
    }
  };

  const getStockPercentage = (current: number, reorder: number) => {
    return Math.min((current / reorder) * 100, 100);
  };

  const categories = ["all", "Fertilizer", "Pesticide", "Equipment", "Seeds", "Fuel"];
  const filteredInventory = selectedCategory === "all" 
    ? mockInventory 
    : mockInventory.filter(item => item.category === selectedCategory);

  const lowStockCount = mockInventory.filter(item => item.status === "critical" || item.status === "low").length;

  return (
    <div className="p-6 space-y-6" data-testid="page-inventory">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Package className="h-8 w-8 text-orange-600" />
            {t("inventory")}
          </h1>
          <p className="text-muted-foreground mt-1">Track stock levels and manage inventory</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={addItemDialogOpen} onOpenChange={setAddItemDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-item">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Inventory Item</DialogTitle>
                <DialogDescription>
                  Register a new item in inventory
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="item-name">Item Name</Label>
                  <Input id="item-name" placeholder="e.g., NPK Fertilizer" data-testid="input-item-name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger id="category" data-testid="select-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fertilizer">Fertilizer</SelectItem>
                        <SelectItem value="pesticide">Pesticide</SelectItem>
                        <SelectItem value="seeds">Seeds</SelectItem>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="fuel">Fuel</SelectItem>
                        <SelectItem value="tools">Tools</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Select>
                      <SelectTrigger id="unit" data-testid="select-unit">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                        <SelectItem value="liters">Liters</SelectItem>
                        <SelectItem value="pieces">Pieces</SelectItem>
                        <SelectItem value="bags">Bags</SelectItem>
                        <SelectItem value="meters">Meters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reorder-level">Reorder Level</Label>
                    <Input id="reorder-level" type="number" placeholder="100" data-testid="input-reorder-level" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit-price">Unit Price (₹)</Label>
                    <Input id="unit-price" type="number" step="0.01" placeholder="45.00" data-testid="input-unit-price" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Storage Location</Label>
                  <Input id="location" placeholder="Warehouse A" data-testid="input-location" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddItemDialogOpen(false)} data-testid="button-cancel">
                  Cancel
                </Button>
                <Button onClick={() => setAddItemDialogOpen(false)} data-testid="button-submit-item">
                  Add Item
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" data-testid="button-export-inventory">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{mockInventory.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Unique items tracked</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-orange-600 dark:text-orange-400">
              {lowStockCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Items need reordering</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              ₹{mockInventory.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Current inventory value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">6</div>
            <p className="text-xs text-muted-foreground mt-1">Item categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all-items">All Items</TabsTrigger>
          <TabsTrigger value="alerts" data-testid="tab-alerts">Low Stock Alerts</TabsTrigger>
          <TabsTrigger value="movements" data-testid="tab-movements">Stock Movements</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Inventory Items</CardTitle>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]" data-testid="select-filter-category">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat === "all" ? "All Categories" : cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Reorder Level</TableHead>
                      <TableHead>Stock Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map((item) => (
                      <TableRow key={item.id} data-testid={`row-item-${item.id}`}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.category}</Badge>
                        </TableCell>
                        <TableCell className="font-mono">
                          {item.currentStock} {item.unit}
                        </TableCell>
                        <TableCell className="font-mono text-muted-foreground">
                          {item.reorderLevel} {item.unit}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant={getStatusColor(item.status)}>
                              {item.status === "critical" ? "Critical" : item.status === "low" ? "Low" : "Adequate"}
                            </Badge>
                            <Progress 
                              value={getStockPercentage(item.currentStock, item.reorderLevel)} 
                              className="w-24 h-1.5"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.location}</TableCell>
                        <TableCell className="font-mono">₹{item.unitPrice}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="outline" data-testid={`button-stock-in-${item.id}`}>
                              <TrendingUp className="h-3 w-3 mr-1" />
                              In
                            </Button>
                            <Button size="sm" variant="outline" data-testid={`button-stock-out-${item.id}`}>
                              <TrendingDown className="h-3 w-3 mr-1" />
                              Out
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Low Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockInventory
                  .filter(item => item.status === "critical" || item.status === "low")
                  .map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border hover-elevate">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Current: <span className="font-mono">{item.currentStock} {item.unit}</span> • 
                          Reorder: <span className="font-mono">{item.reorderLevel} {item.unit}</span>
                        </p>
                        <Progress 
                          value={getStockPercentage(item.currentStock, item.reorderLevel)} 
                          className="w-48 h-2 mt-2"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(item.status)}>
                          {item.status === "critical" ? "Critical" : "Low"}
                        </Badge>
                        <Button size="sm" data-testid={`button-reorder-${item.id}`}>
                          Reorder
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Stock Movements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Stock movement history will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
