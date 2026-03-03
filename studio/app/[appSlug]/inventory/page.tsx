import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Input,
} from '@maatwork/ui';

const MOCK_INVENTORY = [
  { id: '1', name: 'Shampoo Profesional 1L', stock: 12, price: 15000 },
  { id: '2', name: 'Acondicionador 1L', stock: 8, price: 15000 },
  { id: '3', name: 'Decolorante 500g', stock: 3, price: 22000 },
];

export default function InventoryPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
        <Button>Add Product</Button>
      </div>

      <div className="flex items-center gap-4 py-4">
        <Input placeholder="Search inventory..." className="max-w-sm" />
      </div>

      <div className="border rounded-md bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Stock Level</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_INVENTORY.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${item.stock < 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}
                  >
                    {item.stock} units
                  </span>
                </TableCell>
                <TableCell>${item.price.toLocaleString('es-AR')}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
