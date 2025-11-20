import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Textarea } from "@/components/ui/textarea";
import { Sprout, Plus, MapPin, Calendar, TrendingUp, DollarSign } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function CultivationPage() {
  const { t } = useLanguage();
  const [selectedPlot, setSelectedPlot] = useState<string | null>("plot-1");
  const [addPlotDialogOpen, setAddPlotDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"individual" | "consolidated">("individual");

  const { data: plots, isLoading } = useQuery({
    queryKey: ["/api/plots"],
  });

  const mockPlots = [
    {
      id: "plot-1",
      name: "North Field A",
      variety: "Grand Naine",
      area: 2.5,
      plantDensity: 1600,
      plantingDate: "2024-06-15",
      daysAfterPlanting: 185,
      totalPlants: 4000,
      totalCost: 926000,
      costPerPlant: 231.5,
      incurred: 606000,
      pending: 320000,
      location: "North Section",
      status: "Active"
    },
    {
      id: "plot-2",
      name: "South Field B",
      variety: "Robusta",
      area: 1.8,
      plantDensity: 1600,
      plantingDate: "2024-08-01",
      daysAfterPlanting: 138,
      totalPlants: 2880,
      totalCost: 667200,
      costPerPlant: 231.67,
      incurred: 387200,
      pending: 280000,
      location: "South Section",
      status: "Active"
    },
  ];

  const currentPlot = mockPlots.find(p => p.id === selectedPlot);

  const calculateDayProgress = (days: number) => {
    const totalCycle = 310;
    return (days / totalCycle) * 100;
  };

  return (
    <div className="p-6 space-y-6" data-testid="page-cultivation">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sprout className="h-8 w-8 text-green-600" />
            {t("cultivation")}
          </h1>
          <p className="text-muted-foreground mt-1">Manage plots, crops, and cultivation costs</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={viewMode === "consolidated" ? "default" : "outline"}
            onClick={() => setViewMode(viewMode === "individual" ? "consolidated" : "individual")}
            data-testid="button-toggle-view"
          >
            {viewMode === "individual" ? "Consolidated View" : "Individual View"}
          </Button>
          <Dialog open={addPlotDialogOpen} onOpenChange={setAddPlotDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-plot">
                <Plus className="h-4 w-4 mr-2" />
                New Plot
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Plot</DialogTitle>
                <DialogDescription>
                  Register a new banana cultivation plot
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plot-name">Plot Name</Label>
                    <Input id="plot-name" placeholder="e.g., North Field A" data-testid="input-plot-name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="variety">Variety</Label>
                    <Select>
                      <SelectTrigger id="variety" data-testid="select-variety">
                        <SelectValue placeholder="Select variety" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grand-naine">Grand Naine</SelectItem>
                        <SelectItem value="robusta">Robusta</SelectItem>
                        <SelectItem value="cavendish">Cavendish</SelectItem>
                        <SelectItem value="red-banana">Red Banana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="area">Area (Hectares)</Label>
                    <Input id="area" type="number" step="0.1" placeholder="2.5" data-testid="input-area" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plant-density">Plant Density (per hectare)</Label>
                    <Input id="plant-density" type="number" defaultValue="1600" data-testid="input-density" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="planting-date">Planting Date</Label>
                    <Input id="planting-date" type="date" data-testid="input-planting-date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="North Section" data-testid="input-location" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea id="notes" placeholder="Additional details..." data-testid="textarea-notes" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddPlotDialogOpen(false)} data-testid="button-cancel">
                  Cancel
                </Button>
                <Button onClick={() => setAddPlotDialogOpen(false)} data-testid="button-submit-plot">
                  Add Plot
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* View Modes */}
      {viewMode === "individual" && currentPlot && (
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Plot Selection Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base">All Plots</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockPlots.map((plot) => (
                <button
                  key={plot.id}
                  onClick={() => setSelectedPlot(plot.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border transition-colors hover-elevate",
                    selectedPlot === plot.id ? "border-primary bg-primary/5" : "border-border"
                  )}
                  data-testid={`button-select-plot-${plot.id}`}
                >
                  <p className="font-medium text-sm">{plot.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{plot.variety}</p>
                  <p className="text-xs font-mono mt-1">{plot.totalPlants} plants</p>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Plot Details */}
          <div className="lg:col-span-3 space-y-4">
            {/* Plot Header */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-900">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold">{currentPlot.name}</h2>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Sprout className="h-4 w-4" />
                        {currentPlot.variety}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {currentPlot.location}
                      </span>
                      <Badge>{currentPlot.status}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Day {currentPlot.daysAfterPlanting} of 310</p>
                    <Progress value={calculateDayProgress(currentPlot.daysAfterPlanting)} className="w-32 mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Overview Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="border-blue-200 dark:border-blue-900">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Total Cost</p>
                  <p className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
                    ₹{currentPlot.totalCost.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-green-200 dark:border-green-900">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Per Plant Cost</p>
                  <p className="text-2xl font-bold font-mono text-green-600 dark:text-green-400">
                    ₹{currentPlot.costPerPlant}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-orange-200 dark:border-orange-900">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Incurred</p>
                  <p className="text-2xl font-bold font-mono text-orange-600 dark:text-orange-400">
                    ₹{currentPlot.incurred.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-purple-200 dark:border-purple-900">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Pending</p>
                  <p className="text-2xl font-bold font-mono text-purple-600 dark:text-purple-400">
                    ₹{currentPlot.pending.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs for Details */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
                <TabsTrigger value="costs" data-testid="tab-costs">Costs</TabsTrigger>
                <TabsTrigger value="activities" data-testid="tab-activities">Activities</TabsTrigger>
                <TabsTrigger value="fertilizer" data-testid="tab-fertilizer">Fertilizer Schedule</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>Plot Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Area</p>
                      <p className="text-lg font-semibold mt-1">{currentPlot.area} hectares</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Plants</p>
                      <p className="text-lg font-semibold mt-1">{currentPlot.totalPlants}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Plant Density</p>
                      <p className="text-lg font-semibold mt-1">{currentPlot.plantDensity} plants/hectare</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Planting Date</p>
                      <p className="text-lg font-semibold mt-1">{format(new Date(currentPlot.plantingDate), "PPP")}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="costs">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Cost Breakdown</CardTitle>
                    <Button size="sm" data-testid="button-add-cost">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Cost
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Detailed cost breakdown will be displayed here</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activities">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Activity Log</CardTitle>
                    <Button size="sm" data-testid="button-add-activity">
                      <Plus className="h-4 w-4 mr-2" />
                      Log Activity
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Recent activities will be displayed here</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="fertilizer">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Fertilizer Schedule</CardTitle>
                    <Button size="sm" data-testid="button-add-fertilizer">
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Fertilizer
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Fertilizer application schedule will be displayed here</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      {viewMode === "consolidated" && (
        <div className="space-y-6">
          {/* Consolidated Summary */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">Total Plots</p>
                <p className="text-3xl font-bold font-mono">{mockPlots.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">Total Area</p>
                <p className="text-3xl font-bold font-mono">
                  {mockPlots.reduce((sum, p) => sum + p.area, 0)} ha
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">Total Plants</p>
                <p className="text-3xl font-bold font-mono">
                  {mockPlots.reduce((sum, p) => sum + p.totalPlants, 0).toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">Total Investment</p>
                <p className="text-3xl font-bold font-mono">
                  ₹{mockPlots.reduce((sum, p) => sum + p.totalCost, 0).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* All Plots List */}
          <Card>
            <CardHeader>
              <CardTitle>All Plots Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPlots.map((plot) => (
                  <div key={plot.id} className="p-4 rounded-lg border hover-elevate" data-testid={`card-plot-${plot.id}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{plot.name}</h3>
                        <p className="text-sm text-muted-foreground">{plot.variety} • {plot.totalPlants} plants</p>
                      </div>
                      <Badge>{plot.status}</Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Cost</p>
                        <p className="font-mono font-semibold">₹{plot.totalCost.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Per Plant</p>
                        <p className="font-mono font-semibold">₹{plot.costPerPlant}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Incurred</p>
                        <p className="font-mono font-semibold">₹{plot.incurred.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Pending</p>
                        <p className="font-mono font-semibold">₹{plot.pending.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
