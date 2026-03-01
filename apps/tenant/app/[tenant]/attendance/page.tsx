"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from "@maatwork/ui";
import { useToast } from "@maatwork/ui";

export default function AttendancePage({ params }: { params: Promise<{ tenant: string }> }) {
  const [clientId, setClientId] = useState("");
  const { toast } = useToast();

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return;
    
    // Simulate API call
    toast({
      title: "Success",
      description: `Client #${clientId} checked in successfully.`,
    });
    setClientId("");
  };

  return (
    <div className="p-8 max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-center mb-8">Quick Check-in</h1>
      
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Scan or Enter Client ID</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCheckIn} className="flex gap-2">
            <Input 
              value={clientId} 
              onChange={(e) => setClientId(e.target.value)} 
              placeholder="e.g. 12345" 
              className="text-lg py-6"
              autoFocus
            />
            <Button type="submit" size="lg" className="py-6">Register</Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Recent check-ins will appear here...</p>
      </div>
    </div>
  );
}
