import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Label } from "@maatwork/ui";
import { MessageSquare, Receipt } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Integrations & Settings</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-500" />
              <CardTitle>WhatsApp Cloud API</CardTitle>
            </div>
            <CardDescription>
              Connect your WhatsApp Business account to send automated reminders and notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Phone Number ID</Label>
              <Input placeholder="e.g. 1020304050" />
            </div>
            <div className="space-y-2">
              <Label>Access Token</Label>
              <Input type="password" placeholder="EAA..." />
            </div>
            <Button>Connect WhatsApp</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-blue-500" />
              <CardTitle>AFIP Facturación</CardTitle>
            </div>
            <CardDescription>
              Configure electronic billing with AFIP to generate formal invoices. (Requires certificate)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>CUIT</Label>
              <Input placeholder="20-12345678-9" />
            </div>
            <div className="space-y-2">
              <Label>Punto de Venta</Label>
              <Input placeholder="0001" />
            </div>
            <Button variant="outline">Upload Certificate</Button>
            <Button className="ml-2">Save Configuration</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
