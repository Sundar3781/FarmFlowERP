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
import { Beef, Plus, Droplet, Heart, TrendingUp } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { format } from "date-fns";

export default function LivestockPage() {
  const { t } = useLanguage();
  const [addAnimalDialogOpen, setAddAnimalDialogOpen] = useState(false);
  const [addMilkYieldDialogOpen, setAddMilkYieldDialogOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);

  const { data: animals, isLoading } = useQuery({
    queryKey: ["/api/animals"],
  });

  const mockAnimals = [
    {
      id: "1",
      tagNumber: "C-001",
      name: "Lakshmi",
      type: "Cow",
      breed: "Jersey",
      gender: "Female",
      dateOfBirth: "2020-05-15",
      status: "Active",
      location: "Barn A",
      avgMilkYield: 18.5,
      purchaseCost: 65000,
      currentValue: 85000,
    },
    {
      id: "2",
      tagNumber: "C-002",
      name: "Nandi",
      type: "Cow",
      breed: "Holstein",
      gender: "Female",
      dateOfBirth: "2019-08-20",
      status: "Active",
      location: "Barn A",
      avgMilkYield: 22.0,
      purchaseCost: 75000,
      currentValue: 95000,
    },
    {
      id: "3",
      tagNumber: "H-001",
      name: "Raja",
      type: "Horse",
      breed: "Kathiawari",
      gender: "Male",
      dateOfBirth: "2018-03-10",
      status: "Active",
      location: "Stable",
      avgMilkYield: 0,
      purchaseCost: 120000,
      currentValue: 150000,
    },
    {
      id: "4",
      tagNumber: "D-001",
      name: "Bruno",
      type: "Dog",
      breed: "German Shepherd",
      gender: "Male",
      dateOfBirth: "2021-11-05",
      status: "Active",
      location: "Guard Post",
      avgMilkYield: 0,
      purchaseCost: 15000,
      currentValue: 18000,
    },
  ];

  const mockMilkYields = [
    { id: "1", animalId: "1", date: "2024-11-17", morningYield: 9.2, eveningYield: 9.3, totalYield: 18.5, quality: "Good" },
    { id: "2", animalId: "2", date: "2024-11-17", morningYield: 11.0, eveningYield: 11.0, totalYield: 22.0, quality: "Good" },
    { id: "3", animalId: "1", date: "2024-11-16", morningYield: 9.0, eveningYield: 9.5, totalYield: 18.5, quality: "Good" },
  ];

  const getHealthStatus = (animalId: string) => {
    // Simulated health status
    return "good";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "default";
      case "Sold": return "secondary";
      case "Deceased": return "destructive";
      default: return "default";
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const years = Math.floor((new Date().getTime() - new Date(dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365));
    return `${years} years`;
  };

  return (
    <div className="p-6 space-y-6" data-testid="page-livestock">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Beef className="h-8 w-8 text-amber-600" />
            {t("livestock")}
          </h1>
          <p className="text-muted-foreground mt-1">Manage animals, health records, and milk production</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={addAnimalDialogOpen} onOpenChange={setAddAnimalDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-animal">
                <Plus className="h-4 w-4 mr-2" />
                Register Animal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Register Animal</DialogTitle>
                <DialogDescription>
                  Add a new animal to the livestock registry
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tag-number">Tag Number</Label>
                    <Input id="tag-number" placeholder="C-001" data-testid="input-tag-number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="animal-name">Name (Optional)</Label>
                    <Input id="animal-name" placeholder="Lakshmi" data-testid="input-animal-name" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="animal-type">Type</Label>
                    <Select>
                      <SelectTrigger id="animal-type" data-testid="select-animal-type">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cow">Cow</SelectItem>
                        <SelectItem value="buffalo">Buffalo</SelectItem>
                        <SelectItem value="horse">Horse</SelectItem>
                        <SelectItem value="goat">Goat</SelectItem>
                        <SelectItem value="sheep">Sheep</SelectItem>
                        <SelectItem value="dog">Dog</SelectItem>
                        <SelectItem value="chicken">Chicken</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="breed">Breed</Label>
                    <Input id="breed" placeholder="Jersey" data-testid="input-breed" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select>
                      <SelectTrigger id="gender" data-testid="select-gender">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date-of-birth">Date of Birth</Label>
                    <Input id="date-of-birth" type="date" data-testid="input-date-of-birth" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchase-date">Purchase Date</Label>
                    <Input id="purchase-date" type="date" data-testid="input-purchase-date" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="animal-purchase-cost">Purchase Cost (₹)</Label>
                    <Input id="animal-purchase-cost" type="number" placeholder="65000" data-testid="input-animal-purchase-cost" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="animal-location">Location</Label>
                    <Input id="animal-location" placeholder="Barn A" data-testid="input-animal-location" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddAnimalDialogOpen(false)} data-testid="button-cancel-animal">
                  Cancel
                </Button>
                <Button onClick={() => setAddAnimalDialogOpen(false)} data-testid="button-submit-animal">
                  Register Animal
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
            <CardTitle className="text-sm font-medium">Total Animals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{mockAnimals.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered livestock</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Milk Producing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-primary">
              {mockAnimals.filter(a => a.avgMilkYield > 0).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Cows/Buffaloes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Milk Yield</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              {mockAnimals.reduce((sum, a) => sum + a.avgMilkYield, 0).toFixed(1)}L
            </div>
            <p className="text-xs text-muted-foreground mt-1">Average per day</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              ₹{mockAnimals.reduce((sum, a) => sum + a.currentValue, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Current livestock value</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="registry" className="space-y-4">
        <TabsList>
          <TabsTrigger value="registry" data-testid="tab-registry">Animal Registry</TabsTrigger>
          <TabsTrigger value="milk" data-testid="tab-milk">Milk Yield</TabsTrigger>
          <TabsTrigger value="health" data-testid="tab-health">Health Records</TabsTrigger>
          <TabsTrigger value="sales" data-testid="tab-sales">Sales History</TabsTrigger>
        </TabsList>

        <TabsContent value="registry" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Livestock Registry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tag Number</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type / Breed</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Avg Milk Yield</TableHead>
                      <TableHead>Health</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAnimals.map((animal) => (
                      <TableRow key={animal.id} data-testid={`row-animal-${animal.id}`}>
                        <TableCell className="font-mono font-medium">{animal.tagNumber}</TableCell>
                        <TableCell>{animal.name}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{animal.type}</p>
                            <p className="text-xs text-muted-foreground">{animal.breed}</p>
                          </div>
                        </TableCell>
                        <TableCell>{animal.gender}</TableCell>
                        <TableCell className="text-muted-foreground">{calculateAge(animal.dateOfBirth)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(animal.status)}>{animal.status}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{animal.location}</TableCell>
                        <TableCell className="font-mono">
                          {animal.avgMilkYield > 0 ? `${animal.avgMilkYield}L` : "-"}
                        </TableCell>
                        <TableCell>
                          <div className={`h-2 w-2 rounded-full ${
                            getHealthStatus(animal.id) === "good" ? "bg-green-500" :
                            getHealthStatus(animal.id) === "fair" ? "bg-yellow-500" : "bg-red-500"
                          }`} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milk" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Droplet className="h-5 w-5 text-blue-600" />
                Daily Milk Yield Records
              </CardTitle>
              <Dialog open={addMilkYieldDialogOpen} onOpenChange={setAddMilkYieldDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" data-testid="button-add-milk-yield">
                    <Plus className="h-4 w-4 mr-2" />
                    Record Yield
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Record Milk Yield</DialogTitle>
                    <DialogDescription>
                      Log daily milk production for an animal
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="milk-animal">Animal</Label>
                        <Select>
                          <SelectTrigger id="milk-animal" data-testid="select-milk-animal">
                            <SelectValue placeholder="Select animal" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockAnimals.filter(a => a.avgMilkYield > 0).map((animal) => (
                              <SelectItem key={animal.id} value={animal.id}>
                                {animal.tagNumber} - {animal.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="milk-date">Date</Label>
                        <Input id="milk-date" type="date" defaultValue={format(new Date(), "yyyy-MM-dd")} data-testid="input-milk-date" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="morning-yield">Morning Yield (Liters)</Label>
                        <Input id="morning-yield" type="number" step="0.1" placeholder="9.2" data-testid="input-morning-yield" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="evening-yield">Evening Yield (Liters)</Label>
                        <Input id="evening-yield" type="number" step="0.1" placeholder="9.3" data-testid="input-evening-yield" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="milk-quality">Quality</Label>
                      <Select>
                        <SelectTrigger id="milk-quality" data-testid="select-milk-quality">
                          <SelectValue placeholder="Select quality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="average">Average</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAddMilkYieldDialogOpen(false)} data-testid="button-cancel-milk">
                      Cancel
                    </Button>
                    <Button onClick={() => setAddMilkYieldDialogOpen(false)} data-testid="button-submit-milk">
                      Record Yield
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Animal</TableHead>
                      <TableHead>Morning (L)</TableHead>
                      <TableHead>Evening (L)</TableHead>
                      <TableHead>Total (L)</TableHead>
                      <TableHead>Quality</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockMilkYields.map((record) => {
                      const animal = mockAnimals.find(a => a.id === record.animalId);
                      return (
                        <TableRow key={record.id} data-testid={`row-milk-yield-${record.id}`}>
                          <TableCell>{format(new Date(record.date), "PP")}</TableCell>
                          <TableCell className="font-medium">
                            {animal?.tagNumber} - {animal?.name}
                          </TableCell>
                          <TableCell className="font-mono">{record.morningYield}</TableCell>
                          <TableCell className="font-mono">{record.eveningYield}</TableCell>
                          <TableCell className="font-mono font-semibold">{record.totalYield}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{record.quality}</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-600" />
                Health & Vaccination Records
              </CardTitle>
              <Button size="sm" data-testid="button-add-health-record">
                <Plus className="h-4 w-4 mr-2" />
                Add Record
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Health and vaccination records will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Animal Sales History
              </CardTitle>
              <Button size="sm" data-testid="button-add-sale">
                <Plus className="h-4 w-4 mr-2" />
                Record Sale
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Sales records will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
