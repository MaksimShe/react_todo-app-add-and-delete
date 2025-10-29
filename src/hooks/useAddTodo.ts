// hooks/useAddTodo.ts
import { useState } from 'react';
import { addTodos } from '../api/todos';
import { ErrorMessages, Todo, USER_ID } from '../types';

export const useAddTodo = (
  handleAddTodo: (todo: Todo) => void,
  handleError: (error: ErrorMessages) => void,
  handleIdTodoLoading: (id: number[]) => void,
  handleSetLoading: (loading: boolean) => void,
  hanleActivateTempTodo: (todo: Todo) => void,
  hanleDeleteTempTodo: () => void,
) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = async (event, inputRef) => {
    event.preventDefault();

    if (!inputText.trim()) {
      handleError(ErrorMessages.EmptyTitle);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: inputText.trim(),
      completed: false,
    };

    handleSetLoading(true);
    hanleActivateTempTodo(newTodo);
    handleIdTodoLoading([0]);

    try {
      const response = await addTodos(newTodo);

      setInputText('');
      newTodo.id = response.id;
      handleAddTodo(newTodo);
    } catch {
      handleError(ErrorMessages.Add);
      setTimeout(() => handleError(ErrorMessages.WithoutError), 3000);
    } finally {
      handleSetLoading(false);
      hanleDeleteTempTodo();
      handleIdTodoLoading([]);
      inputRef.current?.focus();
    }
  };

  return {
    inputText,
    setInputText,
    handleSubmit,
  };
};
