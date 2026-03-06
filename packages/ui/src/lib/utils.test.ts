import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility function', () => {
  it('should merge tailwind classes', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
  });

  it('should override tailwind classes correctly using tailwind-merge', () => {
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    expect(cn('p-4', 'p-2')).toBe('p-2');
  });

  it('should handle conditional classes using clsx', () => {
    expect(cn('text-lg', true && 'font-bold', false && 'italic')).toBe('text-lg font-bold');

    const isActive = true;
    const isError = false;
    expect(cn(
      'base-class',
      isActive ? 'active-class' : 'inactive-class',
      isError ? 'error-class' : null
    )).toBe('base-class active-class');
  });

  it('should handle array inputs', () => {
    expect(cn(['text-sm', 'font-medium'])).toBe('text-sm font-medium');
  });

  it('should handle object inputs', () => {
    expect(cn({ 'text-sm': true, 'font-medium': false })).toBe('text-sm');
  });

  it('should handle mixed inputs (arrays, objects, conditionals)', () => {
    expect(cn(
      'text-base',
      ['font-bold', 'italic'],
      { 'bg-red-500': false, 'text-white': true },
      undefined,
      null,
      false && 'hidden'
    )).toBe('text-base font-bold italic text-white');
  });

  it('should handle tailwind conflict resolution with complex inputs', () => {
    expect(cn(
      'px-2 py-1',
      { 'p-4': true } // p-4 should override px-2 and py-1
    )).toBe('p-4');
  });
});
