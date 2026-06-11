"use client";

import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, profile, isLoading } = useAuthStore();
  const router = useRouter();

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      {user && (
        <>
          <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>

          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Auth Session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm font-mono">
              <p>
                <span className="font-semibold">ID:</span> {user.id}
              </p>
              <p>
                <span className="font-semibold">Name:</span> {user.name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-semibold">Verified:</span>{" "}
                {user.emailVerified ? "Yes" : "No"}
              </p>
              <p>
                <span className="font-semibold">Role:</span>{" "}
                {user.role || "user"}
              </p>
              {user.phoneNumber && (
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  {user.phoneNumber}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Downstream API Profile</CardTitle>
            </CardHeader>
            <CardContent>
              {profile ? (
                <div className="space-y-1 text-sm font-mono">
                  {Object.entries(profile).map(([key, value]) => (
                    <p key={key}>
                      <span className="font-semibold">{key}:</span>{" "}
                      {value === null ? (
                        <span className="text-muted-foreground">null</span>
                      ) : (
                        String(value)
                      )}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Profile not loaded
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <Button
        variant="outline"
        onClick={async () => {
          await fetch("/api/auth/sign-out", { method: "POST" });
          useAuthStore.getState().clearAuth();
          router.push("/sign-in");
        }}
      >
        Sign Out
      </Button>
    </div>
  );
}
