import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sprout, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import { LanguageToggle } from "@/components/language-toggle";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Demo accounts
  const demoAccounts = [
    { username: "admin", password: "admin", fullName: "Admin User", role: "Admin", email: "admin@farm.com" },
    { username: "manager", password: "manager", fullName: "Farm Manager", role: "Manager", email: "manager@farm.com" },
    { username: "user", password: "user", fullName: "Farm Operator", role: "Operator", email: "user@farm.com" },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Login failed");
        setIsLoading(false);
        return;
      }

      const userData = await response.json();
      login({
        ...userData,
        createdAt: new Date(userData.createdAt),
      });
      setLocation("/dashboard");
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoUsername: string) => {
    const account = demoAccounts.find(acc => acc.username === demoUsername);
    if (account) {
      setUsername(account.username);
      setPassword(account.password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary text-primary-foreground mx-auto">
            <Sprout className="h-9 w-9" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Farm Management ERP</h1>
          <p className="text-muted-foreground">Complete farm operations at your fingertips</p>
        </div>

        {/* Login Card */}
        <Card data-testid="card-login">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">{t("login")}</CardTitle>
            <CardDescription>Enter your credentials to access the system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">{t("username")}</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  data-testid="input-username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("password")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="input-password"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                data-testid="button-login"
              >
                {isLoading ? "Signing in..." : t("login")}
              </Button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-6 space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Quick Login</span>
                </div>
              </div>

              <div className="grid gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDemoLogin("admin")}
                  className="w-full justify-start"
                  data-testid="button-demo-admin"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-semibold text-primary">AD</span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">Admin</p>
                      <p className="text-xs text-muted-foreground">Full Access</p>
                    </div>
                  </div>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDemoLogin("manager")}
                  className="w-full justify-start"
                  data-testid="button-demo-manager"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <span className="text-xs font-semibold text-blue-600">MG</span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">Manager</p>
                      <p className="text-xs text-muted-foreground">Most Modules</p>
                    </div>
                  </div>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDemoLogin("user")}
                  className="w-full justify-start"
                  data-testid="button-demo-user"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-500/10 flex items-center justify-center">
                      <span className="text-xs font-semibold text-gray-600">OP</span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">Operator</p>
                      <p className="text-xs text-muted-foreground">Limited Access</p>
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          © 2024 Farm Management ERP. All rights reserved.
        </p>
      </div>
    </div>
  );
}
