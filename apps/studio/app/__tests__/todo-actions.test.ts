import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTodos, addTodo, toggleTodo, deleteTodo } from '../todo-actions';
import { db, studio_todos } from '@maatwork/database';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

vi.mock('@maatwork/database', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  studio_todos: {
    createdAt: 'createdAt_mock_col',
    id: 'id_mock_col',
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
    it('should query the database for all todos and order by createdAt', async () => {
      const mockOrderBy = vi.fn().mockResolvedValue([{ id: '1', text: 'Test Todo' }]);
      const mockFrom = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
      (db.select as any).mockReturnValue({ from: mockFrom });

      const result = await getTodos();

      expect(db.select).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalledWith(studio_todos);
      expect(mockOrderBy).toHaveBeenCalledWith(studio_todos.createdAt);
      expect(result).toEqual([{ id: '1', text: 'Test Todo' }]);
    });
  });

  describe('addTodo', () => {
    it('should insert a new todo with the given text and default medium priority, then revalidate', async () => {
      const mockValues = vi.fn().mockResolvedValue([{ insertId: 'mock-uuid-1234' }]);
      (db.insert as any).mockReturnValue({ values: mockValues });

      await addTodo('Buy milk');

      expect(db.insert).toHaveBeenCalledWith(studio_todos);
      expect(mockValues).toHaveBeenCalledWith({
        id: 'mock-uuid-1234',
        text: 'Buy milk',
        priority: 'medium',
        completed: false,
      });
      expect(revalidatePath).toHaveBeenCalledWith('/');
    });

    it('should insert a new todo with a specific priority', async () => {
      const mockValues = vi.fn().mockResolvedValue([{ insertId: 'mock-uuid-1234' }]);
      (db.insert as any).mockReturnValue({ values: mockValues });

      await addTodo('Urgent task', 'high');

      expect(db.insert).toHaveBeenCalledWith(studio_todos);
      expect(mockValues).toHaveBeenCalledWith(expect.objectContaining({
        priority: 'high',
      }));
    });
  });

  describe('toggleTodo', () => {
    it('should update the completed status of a specific todo and revalidate', async () => {
      const mockWhere = vi.fn().mockResolvedValue([{ id: 'mock-id' }]);
      const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
      (db.update as any).mockReturnValue({ set: mockSet });

      // Mock the return value of eq
      const eqMockResult = 'mock-eq-clause';
      (eq as any).mockReturnValue(eqMockResult);

      await toggleTodo('todo-123', true);

      expect(db.update).toHaveBeenCalledWith(studio_todos);
      expect(mockSet).toHaveBeenCalledWith({ completed: true });
      expect(eq).toHaveBeenCalledWith(studio_todos.id, 'todo-123');
      expect(mockWhere).toHaveBeenCalledWith(eqMockResult);
      expect(revalidatePath).toHaveBeenCalledWith('/');
    });
  });

  describe('deleteTodo', () => {
    it('should delete the specific todo and revalidate', async () => {
      const mockWhere = vi.fn().mockResolvedValue([{ id: 'mock-id' }]);
      (db.delete as any).mockReturnValue({ where: mockWhere });

      const eqMockResult = 'mock-eq-clause';
      (eq as any).mockReturnValue(eqMockResult);

      await deleteTodo('todo-456');

      expect(db.delete).toHaveBeenCalledWith(studio_todos);
      expect(eq).toHaveBeenCalledWith(studio_todos.id, 'todo-456');
      expect(mockWhere).toHaveBeenCalledWith(eqMockResult);
      expect(revalidatePath).toHaveBeenCalledWith('/');
    });
  });
});
