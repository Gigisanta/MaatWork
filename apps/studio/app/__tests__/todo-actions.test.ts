import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addTodo } from '../todo-actions';
import { db, studio_todos } from '@maatwork/database';
import { revalidatePath } from 'next/cache';

// Mock dependencies
vi.mock('@maatwork/database', () => {
  return {
    db: {
      insert: vi.fn(() => ({
        values: vi.fn(),
      })),
    },
    studio_todos: {
      id: 'mock-id-col',
      text: 'mock-text-col',
      priority: 'mock-priority-col',
      completed: 'mock-completed-col',
      createdAt: 'mock-createdat-col',
    },
  };
});

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('uuid', () => ({
  v4: vi.fn(() => 'test-uuid-1234'),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('todo-actions', () => {
  describe('addTodo', () => {
    it('should successfully add a todo with default priority and revalidate path', async () => {
      const mockInsertValues = vi.fn();
      (db.insert as any).mockReturnValue({ values: mockInsertValues });

      await addTodo('Buy groceries');

      expect(db.insert).toHaveBeenCalledWith(studio_todos);
      expect(mockInsertValues).toHaveBeenCalledWith({
        id: 'test-uuid-1234',
        text: 'Buy groceries',
        priority: 'medium',
        completed: false,
      });

      expect(revalidatePath).toHaveBeenCalledWith('/');
    });

    it('should successfully add a todo with explicit priority', async () => {
      const mockInsertValues = vi.fn();
      (db.insert as any).mockReturnValue({ values: mockInsertValues });

      await addTodo('Pay bills', 'high');

      expect(db.insert).toHaveBeenCalledWith(studio_todos);
      expect(mockInsertValues).toHaveBeenCalledWith({
        id: 'test-uuid-1234',
        text: 'Pay bills',
        priority: 'high',
        completed: false,
      });

      expect(revalidatePath).toHaveBeenCalledWith('/');
    });
  });
});
