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
import { DollarSign, Plus, FileText, TrendingUp, TrendingDown, Download } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { format } from "date-fns";

export default function FinancePage() {
  const { t } = useLanguage();
  const [addJournalDialogOpen, setAddJournalDialogOpen] = useState(false);
  const [addPettyCashDialogOpen, setAddPettyCashDialogOpen] = useState(false);

  const { data: accounts, isLoading } = useQuery({
    queryKey: ["/api/accounts"],
  });

  const mockAccounts = [
    { id: "1", code: "1000", name: "Cash", type: "Asset", balance: 125000 },
    { id: "2", code: "1100", name: "Bank Account", type: "Asset", balance: 850000 },
    { id: "3", code: "1200", name: "Inventory", type: "Asset", balance: 450000 },
    { id: "4", code: "2000", name: "Accounts Payable", type: "Liability", balance: 75000 },
    { id: "5", code: "3000", name: "Owner's Equity", type: "Equity", balance: 1000000 },
    { id: "6", code: "4000", name: "Milk Sales Revenue", type: "Revenue", balance: 580000 },
    { id: "7", code: "5000", name: "Fertilizer Expenses", type: "Expense", balance: 120000 },
    { id: "8", code: "5100", name: "Labour Expenses", type: "Expense", balance: 250000 },
  ];

  const mockJournalEntries = [
    { id: "1", date: "2024-11-17", description: "Milk sales - November Week 3", reference: "INV-2024-047", debit: 0, credit: 35000 },
    { id: "2", date: "2024-11-16", description: "Fertilizer purchase", reference: "PO-2024-089", debit: 15000, credit: 0 },
    { id: "3", date: "2024-11-15", description: "Labour payment - Weekly", reference: "PAY-2024-045", debit: 12500, credit: 0 },
  ];

  const mockPettyCash = [
    { id: "1", date: "2024-11-17", description: "Office supplies", category: "Office", amount: 850, type: "Expense" },
    { id: "2", date: "2024-11-16", description: "Worker transport", category: "Travel", amount: 1200, type: "Expense" },
    { id: "3", date: "2024-11-15", description: "Fuel for generator", category: "Misc", amount: 2500, type: "Expense" },
  ];

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
              ₹{mockAccounts.filter(a => a.type === "Asset").reduce((sum, a) => sum + a.balance, 0).toLocaleString()}
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
              ₹{mockAccounts.filter(a => a.type === "Liability").reduce((sum, a) => sum + a.balance, 0).toLocaleString()}
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
              ₹{mockAccounts.filter(a => a.type === "Revenue").reduce((sum, a) => sum + a.balance, 0).toLocaleString()}
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
              ₹{mockAccounts.filter(a => a.type === "Expense").reduce((sum, a) => sum + a.balance, 0).toLocaleString()}
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
                    {mockAccounts.map((account) => (
                      <TableRow key={account.id} data-testid={`row-account-${account.id}`}>
                        <TableCell className="font-mono">{account.code}</TableCell>
                        <TableCell className="font-medium">{account.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getAccountTypeColor(account.type)}>
                            {account.type}
                          </Badge>
                        </TableCell>
                        <TableCell className={`text-right font-mono font-semibold ${getAccountTypeColor(account.type)}`}>
                          {account.balance.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
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
                            {mockAccounts.map((acc) => (
                              <SelectItem key={acc.id} value={acc.id}>
                                {acc.code} - {acc.name}
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
                    {mockJournalEntries.map((entry) => (
                      <TableRow key={entry.id} data-testid={`row-journal-${entry.id}`}>
                        <TableCell>{format(new Date(entry.date), "PP")}</TableCell>
                        <TableCell className="font-medium">{entry.description}</TableCell>
                        <TableCell className="font-mono text-sm">{entry.reference}</TableCell>
                        <TableCell className="text-right font-mono">
                          {entry.debit > 0 ? entry.debit.toLocaleString() : "-"}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {entry.credit > 0 ? entry.credit.toLocaleString() : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
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
                    {mockPettyCash.map((entry) => (
                      <TableRow key={entry.id} data-testid={`row-petty-cash-${entry.id}`}>
                        <TableCell>{format(new Date(entry.date), "PP")}</TableCell>
                        <TableCell className="font-medium">{entry.description}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{entry.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={entry.type === "Income" ? "default" : "secondary"}>
                            {entry.type}
                          </Badge>
                        </TableCell>
                        <TableCell className={`text-right font-mono font-semibold ${
                          entry.type === "Income" ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"
                        }`}>
                          {entry.type === "Income" ? "+" : "-"}{entry.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
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
