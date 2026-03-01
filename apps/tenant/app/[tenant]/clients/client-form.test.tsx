import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddClientDialog } from './client-form';
import React from 'react';

// Mock the server action
vi.mock('./actions', () => {
  const { z } = require('zod');
  return {
    createClientAction: vi.fn(),
    createClientSchema: z.object({
      name: z.string(),
      email: z.string(),
      phone: z.string(),
      tenantId: z.string(),
    })
  };
});

// Mock next-safe-action/hooks
vi.mock('next-safe-action/hooks', () => ({
  useAction: () => ({
    execute: vi.fn(),
    isPending: false,
    result: {}
  })
}));

vi.mock('@maatwork/ui', () => ({
  Button: ({ children, onClick, disabled, type }: any) => (
    <button data-testid="button" onClick={onClick} disabled={disabled} type={type}>{children}</button>
  ),
  Input: (props: any) => <input {...props} />,
  Label: ({ children, htmlFor }: any) => <label htmlFor={htmlFor}>{children}</label>,
  Dialog: ({ children, open }: any) => <div data-testid="dialog">{children}</div>,
  DialogContent: ({ children }: any) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogTrigger: ({ children }: any) => <div data-testid="dialog-trigger">{children}</div>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
  Badge: ({ children }: any) => <span>{children}</span>,
  Card: ({ children }: any) => <div>{children}</div>,
  useToast: () => ({
    toast: vi.fn()
  }),
  Form: ({ children }: any) => <div data-testid="form">{children}</div>,
  FormField: ({ render, name }: any) => <div data-testid={`field-${name}`}>{render({ field: { name, value: '', onChange: vi.fn(), onBlur: vi.fn(), ref: vi.fn() } })}</div>,
  FormItem: ({ children }: any) => <div>{children}</div>,
  FormLabel: ({ children }: any) => <label>{children}</label>,
  FormControl: ({ children }: any) => <div>{children}</div>,
  FormMessage: ({ children }: any) => <div>{children}</div>,
  FormDescription: ({ children }: any) => <div>{children}</div>,
}));

describe('AddClientDialog', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<AddClientDialog tenantId="test-tenant" />);
    expect(getByTestId('dialog-trigger')).toBeDefined();
  });
});
