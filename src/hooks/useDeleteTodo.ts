import { Dispatch, SetStateAction } from 'react';
import { deleteTodos } from '../api/todos';
import { ErrorMessages, Todo } from '../types';

type Props = {
  filteredTodos: Todo[];
  inputRef;

  handleSetPreparedTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  handleSetError: (error: ErrorMessages) => void;
  handleSetTodoIdLoading: Dispatch<SetStateAction<number[]>>;
};

export const useDeleteTodos = ({
  filteredTodos,
  inputRef,

  handleSetPreparedTodos,
  handleSetError,
  handleSetTodoIdLoading,
}: Props) => {
  const completedTodos = filteredTodos.filter(todo => todo.completed);

  const handleDeleteTodos = async (id: number) => {
    try {
      handleSetTodoIdLoading([id]);
      await deleteTodos(id);
      handleSetPreparedTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      handleSetError(ErrorMessages.Delete);
      setTimeout(() => {
        handleSetError(ErrorMessages.WithoutError);
      }, 3000);
    } finally {
      handleSetTodoIdLoading([]);
      inputRef.current?.focus();
    }
  };

  const handleDeleteAllCompletedTodos = async () => {
    const completedIds = completedTodos.map(todo => todo.id);

    handleSetTodoIdLoading(completedIds);

    try {
      const results = await Promise.allSettled(
        completedTodos.map(todo => deleteTodos(todo.id)),
      );

      const successfulIds = completedIds.filter(
        (_, index) => results[index].status === 'fulfilled',
      );

      handleSetPreparedTodos(prev =>
        prev.filter(todo => !successfulIds.includes(todo.id)),
      );

      const hasError = results.some(r => r.status === 'rejected');

      if (hasError) {
        handleSetError(ErrorMessages.Delete);
        setTimeout(() => handleSetError(ErrorMessages.WithoutError), 3000);
      }
    } finally {
      handleSetTodoIdLoading([]);
      inputRef.current?.focus();
    }
  };

  return { handleDeleteTodos, handleDeleteAllCompletedTodos };
};
