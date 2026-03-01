import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@maatwork/ui";
import { signIn } from "@maatwork/auth";
import { Button } from "@maatwork/ui";
import { Input } from "@maatwork/ui";
import { Label } from "@maatwork/ui";

export default function TenantLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background/50">
      <div className="max-w-md w-full p-4">
        <Card>
          <CardHeader className="text-center">
            <div className="mb-4 mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-primary">MW</span>
            </div>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your MaatWork dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              action={async (formData) => {
                "use server";
                await signIn("credentials", formData);
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
            <div className="mt-4 relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <form
              action={async () => {
                "use server";
                await signIn("google");
              }}
              className="mt-4"
            >
              <Button type="submit" variant="outline" className="w-full">
                Google
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
