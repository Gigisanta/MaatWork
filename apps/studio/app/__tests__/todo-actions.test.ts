import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTodos, addTodo, toggleTodo, deleteTodo } from '../todo-actions';
import { db, studio_todos } from '@maatwork/database';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

vi.mock('@maatwork/database', () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        orderBy: vi.fn(),
      })),
    })),
    insert: vi.fn(() => ({
      values: vi.fn(),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(),
      })),
    })),
    delete: vi.fn(() => ({
      where: vi.fn(),
    })),
  },
  studio_todos: {
    id: 'mock-id-col',
    createdAt: 'mock-createdAt-col',
  },
}));

vi.mock('drizzle-orm', () => ({
  eq: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('uuid', () => ({
  v4: vi.fn(() => 'mock-uuid-1234'),
}));

describe('todo-actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTodos', () => {
    it('should select from studio_todos and order by createdAt', async () => {
      const mockOrderBy = vi.fn().mockResolvedValue([{ id: 'todo-1' }]);
      const mockFrom = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
      (db.select as any).mockReturnValue({ from: mockFrom });

      const result = await getTodos();

      expect(db.select).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith(studio_todos);
      expect(mockOrderBy).toHaveBeenCalledWith(studio_todos.createdAt);
      expect(result).toEqual([{ id: 'todo-1' }]);
    });
  });

  describe('addTodo', () => {
    it('should insert a new todo and revalidate path', async () => {
      const mockValues = vi.fn().mockResolvedValue(undefined);
      (db.insert as any).mockReturnValue({ values: mockValues });

      await addTodo('Test Todo', 'high');

      expect(db.insert).toHaveBeenCalledWith(studio_todos);
      expect(mockValues).toHaveBeenCalledWith({
        id: 'mock-uuid-1234',
        text: 'Test Todo',
        priority: 'high',
        completed: false,
      });
      expect(revalidatePath).toHaveBeenCalledWith('/');
    });

    it('should use default priority "medium"', async () => {
      const mockValues = vi.fn().mockResolvedValue(undefined);
      (db.insert as any).mockReturnValue({ values: mockValues });

      await addTodo('Another Todo');

      expect(mockValues).toHaveBeenCalledWith(
        expect.objectContaining({ priority: 'medium' })
      );
    });
  });

  describe('toggleTodo', () => {
    it('should update completed status and revalidate path', async () => {
      const mockWhere = vi.fn().mockResolvedValue(undefined);
      const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
      (db.update as any).mockReturnValue({ set: mockSet });
      (eq as any).mockReturnValue('mock-eq');

      await toggleTodo('todo-id-123', true);

      expect(db.update).toHaveBeenCalledWith(studio_todos);
      expect(mockSet).toHaveBeenCalledWith({ completed: true });
      expect(eq).toHaveBeenCalledWith(studio_todos.id, 'todo-id-123');
      expect(mockWhere).toHaveBeenCalledWith('mock-eq');
      expect(revalidatePath).toHaveBeenCalledWith('/');
    });
  });

  describe('deleteTodo', () => {
    it('should delete todo and revalidate path', async () => {
      const mockWhere = vi.fn().mockResolvedValue(undefined);
      (db.delete as any).mockReturnValue({ where: mockWhere });
      (eq as any).mockReturnValue('mock-eq');

      await deleteTodo('todo-id-456');

      expect(db.delete).toHaveBeenCalledWith(studio_todos);
      expect(eq).toHaveBeenCalledWith(studio_todos.id, 'todo-id-456');
      expect(mockWhere).toHaveBeenCalledWith('mock-eq');
      expect(revalidatePath).toHaveBeenCalledWith('/');
    });
  });
});
