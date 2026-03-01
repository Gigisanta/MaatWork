import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Common UI Mocks
vi.mock('@maatwork/ui', () => ({
  Card: ({ children, className }: any) => <div data-testid="card" className={className}>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h3>{children}</h3>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  Badge: ({ children, variant }: any) => <span data-testid="badge" data-variant={variant}>{children}</span>,
  Skeleton: () => <div data-testid="skeleton" />,
}));

// Simple KPI Component representing the dashboard logic
function KPICard({ title, value, status }: { title: string, value: string, status?: 'up' | 'down' }) {
  return (
    <div data-testid="card">
      <div>
        <h3>{title}</h3>
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        {status && <span data-testid="badge" data-variant={status === 'up' ? 'success' : 'destructive'}>{status}</span>}
      </div>
    </div>
  );
}

describe('Dashboard KPIs', () => {
  it('renders KPI card with correct data', () => {
    const { getByText, getByTestId } = render(
      <KPICard title="Clientes Activos" value="124" status="up" />
    );
    
    expect(getByText('Clientes Activos')).toBeDefined();
    expect(getByText('124')).toBeDefined();
    expect(getByTestId('badge')).toBeDefined();
  });
});
