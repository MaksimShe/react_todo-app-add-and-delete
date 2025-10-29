import { Dispatch, SetStateAction } from 'react';
import { deleteTodos } from '../api/todos';
import { ErrorMessages, Todo } from '../types';

export const useDeleteTodos = (
  setPreparedTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setCurrentError: (error: ErrorMessages | '') => void,
  setTodoIdLoading: Dispatch<SetStateAction<number[]>>,
  todos: Todo[],
) => {
  const completedTodos = todos.filter(todo => todo.completed);

  const handleDeleteTodos = async (id: number) => {
    try {
      setTodoIdLoading([id]);
      await deleteTodos(id);
      setPreparedTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setCurrentError(ErrorMessages.Delete);
      setTimeout(() => {
        setCurrentError(ErrorMessages.WithoutError);
      }, 3000);
    } finally {
      setTodoIdLoading([]);
    }
  };

  const handleDeleteAllCompletedTodos = async () => {
    const completedIds = completedTodos.map(todo => todo.id);

    setTodoIdLoading(completedIds);

    try {
      const results = await Promise.allSettled(
        completedTodos.map(todo => deleteTodos(todo.id)),
      );

      const successfulIds = completedIds.filter(
        (_, index) => results[index].status === 'fulfilled',
      );

      setPreparedTodos(prev =>
        prev.filter(todo => !successfulIds.includes(todo.id)),
      );

      const hasError = results.some(r => r.status === 'rejected');

      if (hasError) {
        setCurrentError(ErrorMessages.Delete);
        setTimeout(() => setCurrentError(ErrorMessages.WithoutError), 3000);
      }
    } finally {
      setTodoIdLoading([]);
    }
  };

  return { handleDeleteTodos, handleDeleteAllCompletedTodos };
};
