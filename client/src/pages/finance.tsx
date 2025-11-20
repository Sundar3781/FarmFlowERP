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
import { DollarSign, Plus, FileText, TrendingUp, TrendingDown, Download } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { format } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Account } from "@shared/schema";

export default function FinancePage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [addJournalDialogOpen, setAddJournalDialogOpen] = useState(false);
  const [addPettyCashDialogOpen, setAddPettyCashDialogOpen] = useState(false);

  const { data: accounts = [], isLoading: accountsLoading, error: accountsError } = useQuery<Account[]>({
    queryKey: ["/api/accounts"],
  });

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "Asset": return "text-blue-600 dark:text-blue-400";
      case "Liability": return "text-red-600 dark:text-red-400";
      case "Equity": return "text-purple-600 dark:text-purple-400";
      case "Revenue": return "text-green-600 dark:text-green-400";
      case "Expense": return "text-orange-600 dark:text-orange-400";
      default: return "";
    }
  };

  const stats = useMemo(() => {
    const totalAssets = accounts.filter(a => a.accountType === "Asset").reduce((sum, a) => sum + (Number(a.balance) || 0), 0);
    const totalLiabilities = accounts.filter(a => a.accountType === "Liability").reduce((sum, a) => sum + (Number(a.balance) || 0), 0);
    const totalRevenue = accounts.filter(a => a.accountType === "Revenue").reduce((sum, a) => sum + (Number(a.balance) || 0), 0);
    const totalExpenses = accounts.filter(a => a.accountType === "Expense").reduce((sum, a) => sum + (Number(a.balance) || 0), 0);
    
    return {
      totalAssets,
      totalLiabilities,
      totalRevenue,
      totalExpenses,
    };
  }, [accounts]);

  return (
    <div className="p-6 space-y-6" data-testid="page-finance">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <DollarSign className="h-8 w-8 text-indigo-600" />
            {t("finance")}
          </h1>
          <p className="text-muted-foreground mt-1">Manage accounts, transactions, and financial reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" data-testid="button-export-reports">
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              {accountsLoading ? "-" : `₹${stats.totalAssets.toLocaleString()}`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Current assets value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              {accountsLoading ? "-" : `₹${stats.totalLiabilities.toLocaleString()}`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Outstanding liabilities</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue (Month)</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-green-600 dark:text-green-400">
              {accountsLoading ? "-" : `₹${stats.totalRevenue.toLocaleString()}`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">November 2024</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses (Month)</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-orange-600 dark:text-orange-400">
              {accountsLoading ? "-" : `₹${stats.totalExpenses.toLocaleString()}`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">November 2024</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accounts" data-testid="tab-accounts">Chart of Accounts</TabsTrigger>
          <TabsTrigger value="journal" data-testid="tab-journal">Journal Entries</TabsTrigger>
          <TabsTrigger value="petty-cash" data-testid="tab-petty-cash">Petty Cash</TabsTrigger>
          <TabsTrigger value="reports" data-testid="tab-reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Chart of Accounts</CardTitle>
              <Button size="sm" data-testid="button-add-account">
                <Plus className="h-4 w-4 mr-2" />
                Add Account
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account Code</TableHead>
                      <TableHead>Account Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Balance (₹)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accountsLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          Loading accounts...
                        </TableCell>
                      </TableRow>
                    ) : accounts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No accounts created yet. Click "Add Account" to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      accounts.map((account) => (
                        <TableRow key={account.id} data-testid={`row-account-${account.id}`}>
                          <TableCell className="font-mono">{account.accountCode}</TableCell>
                          <TableCell className="font-medium">{account.accountName}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getAccountTypeColor(account.accountType)}>
                              {account.accountType}
                            </Badge>
                          </TableCell>
                          <TableCell className={`text-right font-mono font-semibold ${getAccountTypeColor(account.accountType)}`}>
                            {Number(account.balance).toLocaleString()}
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

        <TabsContent value="journal" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                Journal Entries
              </CardTitle>
              <Dialog open={addJournalDialogOpen} onOpenChange={setAddJournalDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" data-testid="button-add-journal">
                    <Plus className="h-4 w-4 mr-2" />
                    New Entry
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Journal Entry</DialogTitle>
                    <DialogDescription>
                      Record a new financial transaction
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="journal-date">Date</Label>
                        <Input id="journal-date" type="date" defaultValue={format(new Date(), "yyyy-MM-dd")} data-testid="input-journal-date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reference">Reference Number</Label>
                        <Input id="reference" placeholder="INV-2024-048" data-testid="input-reference" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="journal-description">Description</Label>
                      <Textarea id="journal-description" placeholder="Transaction description..." data-testid="textarea-journal-description" />
                    </div>
                    <div className="space-y-3">
                      <Label>Transaction Lines</Label>
                      <div className="grid grid-cols-3 gap-3">
                        <Select>
                          <SelectTrigger data-testid="select-debit-account">
                            <SelectValue placeholder="Debit Account" />
                          </SelectTrigger>
                          <SelectContent>
                            {accounts.map((acc) => (
                              <SelectItem key={acc.id} value={acc.id}>
                                {acc.accountCode} - {acc.accountName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input type="number" placeholder="Debit amount" data-testid="input-debit-amount" />
                        <Input type="number" placeholder="Credit amount" data-testid="input-credit-amount" />
                      </div>
                      <Button variant="outline" size="sm" className="w-full" data-testid="button-add-line">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Line
                      </Button>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAddJournalDialogOpen(false)} data-testid="button-cancel-journal">
                      Cancel
                    </Button>
                    <Button onClick={() => setAddJournalDialogOpen(false)} data-testid="button-submit-journal">
                      Create Entry
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
                      <TableHead>Description</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead className="text-right">Debit (₹)</TableHead>
                      <TableHead className="text-right">Credit (₹)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No journal entries recorded yet
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="petty-cash" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Petty Cash Register</CardTitle>
              <Dialog open={addPettyCashDialogOpen} onOpenChange={setAddPettyCashDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" data-testid="button-add-petty-cash">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Entry
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Petty Cash Entry</DialogTitle>
                    <DialogDescription>
                      Record a petty cash transaction
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="petty-date">Date</Label>
                        <Input id="petty-date" type="date" defaultValue={format(new Date(), "yyyy-MM-dd")} data-testid="input-petty-date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="petty-type">Type</Label>
                        <Select>
                          <SelectTrigger id="petty-type" data-testid="select-petty-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="income">Income</SelectItem>
                            <SelectItem value="expense">Expense</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="petty-category">Category</Label>
                      <Select>
                        <SelectTrigger id="petty-category" data-testid="select-petty-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="travel">Travel</SelectItem>
                          <SelectItem value="office">Office Supplies</SelectItem>
                          <SelectItem value="labour">Labour</SelectItem>
                          <SelectItem value="misc">Miscellaneous</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="petty-description">Description</Label>
                      <Textarea id="petty-description" placeholder="What was this for?" data-testid="textarea-petty-description" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="petty-amount">Amount (₹)</Label>
                      <Input id="petty-amount" type="number" step="0.01" placeholder="850.00" data-testid="input-petty-amount" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="received-by">Received/Paid By</Label>
                      <Input id="received-by" placeholder="Person's name" data-testid="input-received-by" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAddPettyCashDialogOpen(false)} data-testid="button-cancel-petty">
                      Cancel
                    </Button>
                    <Button onClick={() => setAddPettyCashDialogOpen(false)} data-testid="button-submit-petty">
                      Add Entry
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
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount (₹)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No petty cash entries recorded yet
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="hover-elevate cursor-pointer" data-testid="card-trial-balance">
              <CardHeader>
                <CardTitle className="text-base">Trial Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">View account balances and verify debits/credits match</p>
                <Button className="w-full mt-4" variant="outline">Generate Report</Button>
              </CardContent>
            </Card>
            <Card className="hover-elevate cursor-pointer" data-testid="card-pl-statement">
              <CardHeader>
                <CardTitle className="text-base">Profit & Loss</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Income statement showing revenue and expenses</p>
                <Button className="w-full mt-4" variant="outline">Generate Report</Button>
              </CardContent>
            </Card>
            <Card className="hover-elevate cursor-pointer" data-testid="card-balance-sheet">
              <CardHeader>
                <CardTitle className="text-base">Balance Sheet</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Assets, liabilities, and equity statement</p>
                <Button className="w-full mt-4" variant="outline">Generate Report</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
