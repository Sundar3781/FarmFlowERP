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
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Animal, MilkYield, InsertMilkYield } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMilkYieldSchema } from "@shared/schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function LivestockPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [addAnimalDialogOpen, setAddAnimalDialogOpen] = useState(false);
  const [addMilkYieldDialogOpen, setAddMilkYieldDialogOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);

  const { data: animals = [], isLoading: animalsLoading, error: animalsError } = useQuery<Animal[]>({
    queryKey: ["/api/animals"],
  });

  const { data: milkYields = [], isLoading: milkYieldsLoading, error: milkYieldsError } = useQuery<MilkYield[]>({
    queryKey: ["/api/milk-yields"],
  });

  // Milk Yield form schema with validation
  const milkYieldFormSchema = insertMilkYieldSchema.extend({
    morningYield: z.string().optional().transform(val => val && val !== "" ? val : undefined),
    eveningYield: z.string().optional().transform(val => val && val !== "" ? val : undefined),
  });

  const milkYieldForm = useForm<z.infer<typeof milkYieldFormSchema>>({
    resolver: zodResolver(milkYieldFormSchema),
    defaultValues: {
      animalId: "",
      date: format(new Date(), "yyyy-MM-dd"),
      morningYield: undefined,
      eveningYield: undefined,
      totalYield: "0",
      quality: "",
    },
  });

  const createMilkYieldMutation = useMutation({
    mutationFn: async (data: InsertMilkYield) => {
      return await apiRequest("/api/milk-yields", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/milk-yields"], exact: false });
      toast({
        title: "Success",
        description: "Milk yield recorded successfully",
      });
      milkYieldForm.reset();
      setAddMilkYieldDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to record milk yield",
        variant: "destructive",
      });
    },
  });

  const handleMilkYieldSubmit = milkYieldForm.handleSubmit((data) => {
    const morning = parseFloat(data.morningYield || "0");
    const evening = parseFloat(data.eveningYield || "0");
    const total = (morning + evening).toFixed(2);

    createMilkYieldMutation.mutate({
      ...data,
      morningYield: data.morningYield || undefined,
      eveningYield: data.eveningYield || undefined,
      totalYield: total,
    } as InsertMilkYield);
  });

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

  const stats = useMemo(() => {
    const totalAnimals = animals.length;
    const milkProducers = animals.filter(a => a.type === "Cow" || a.type === "Goat").length;
    const totalValue = animals.reduce((sum, a) => sum + (Number(a.currentValue) || 0), 0);
    
    // Calculate average milk yield from recent records (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentYields = milkYields.filter(y => new Date(y.date) >= sevenDaysAgo);
    const avgMilkYield = recentYields.length > 0
      ? recentYields.reduce((sum, y) => sum + Number(y.totalYield), 0) / recentYields.length
      : 0;
    
    return {
      totalAnimals,
      milkProducers,
      avgMilkYield: Number(avgMilkYield.toFixed(1)),
      totalValue,
    };
  }, [animals, milkYields]);

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
      {animalsError ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-destructive">Failed to load livestock. Stats unavailable.</div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Animals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{animalsLoading ? "-" : stats.totalAnimals}</div>
              <p className="text-xs text-muted-foreground mt-1">Registered livestock</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Milk Producing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono text-primary">
                {animalsLoading ? "-" : stats.milkProducers}
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
                {animalsLoading ? "-" : `${stats.avgMilkYield.toFixed(1)}L`}
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
                {animalsLoading ? "-" : `₹${stats.totalValue.toLocaleString()}`}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Current livestock value</p>
            </CardContent>
          </Card>
        </div>
      )}

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
                    {animalsLoading ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          Loading animals...
                        </TableCell>
                      </TableRow>
                    ) : animals.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          No animals registered yet. Click "Register Animal" to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      animals.map((animal) => (
                        <TableRow key={animal.id} data-testid={`row-animal-${animal.id}`}>
                          <TableCell className="font-mono font-medium">{animal.tagNumber}</TableCell>
                          <TableCell>{animal.name || "-"}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{animal.type}</p>
                              <p className="text-xs text-muted-foreground">{animal.breed || "-"}</p>
                            </div>
                          </TableCell>
                          <TableCell>{animal.gender}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {animal.dateOfBirth ? calculateAge(animal.dateOfBirth) : "Unknown"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(animal.status)}>{animal.status}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{animal.location || "-"}</TableCell>
                          <TableCell className="font-mono">-</TableCell>
                          <TableCell>
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
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
                  <Form {...milkYieldForm}>
                    <form onSubmit={handleMilkYieldSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={milkYieldForm.control}
                          name="animalId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Animal</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-milk-animal">
                                    <SelectValue placeholder="Select animal" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {animals.filter(a => a.type === "Cow" || a.type === "Goat").map((animal) => (
                                    <SelectItem key={animal.id} value={animal.id}>
                                      {animal.tagNumber} - {animal.name || "Unnamed"}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={milkYieldForm.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} data-testid="input-milk-date" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={milkYieldForm.control}
                          name="morningYield"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Morning Yield (Liters)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.1" placeholder="9.2" {...field} data-testid="input-morning-yield" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={milkYieldForm.control}
                          name="eveningYield"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Evening Yield (Liters)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.1" placeholder="9.3" {...field} data-testid="input-evening-yield" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={milkYieldForm.control}
                        name="quality"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quality</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-milk-quality">
                                  <SelectValue placeholder="Select quality" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Good">Good</SelectItem>
                                <SelectItem value="Average">Average</SelectItem>
                                <SelectItem value="Poor">Poor</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setAddMilkYieldDialogOpen(false)} 
                          data-testid="button-cancel-milk"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={createMilkYieldMutation.isPending} 
                          data-testid="button-submit-milk"
                        >
                          {createMilkYieldMutation.isPending ? "Recording..." : "Record Yield"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
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
                    {milkYieldsLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Loading milk yield records...
                        </TableCell>
                      </TableRow>
                    ) : milkYieldsError ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-destructive">
                          Failed to load milk yield records. Please try refreshing the page.
                        </TableCell>
                      </TableRow>
                    ) : milkYields.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No milk yield records yet. Click "Record Yield" to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      milkYields.map((record) => {
                        const animal = animals.find(a => a.id === record.animalId);
                        return (
                          <TableRow key={record.id} data-testid={`row-milk-yield-${record.id}`}>
                            <TableCell className="font-mono">{format(new Date(record.date), "PP")}</TableCell>
                            <TableCell className="font-medium">
                              {animal ? `${animal.tagNumber} - ${animal.name || "Unnamed"}` : "Unknown"}
                            </TableCell>
                            <TableCell className="font-mono">{record.morningYield || "-"}</TableCell>
                            <TableCell className="font-mono">{record.eveningYield || "-"}</TableCell>
                            <TableCell className="font-mono font-semibold">{Number(record.totalYield).toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{record.quality || "N/A"}</Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
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
