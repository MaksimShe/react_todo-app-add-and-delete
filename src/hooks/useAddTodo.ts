import { useState } from 'react';
import { addTodos } from '../api/todos';
import { ErrorMessages, Todo, USER_ID } from '../types';

export const useAddTodo = (
  preparedTodos: Todo[],
  handleAddTodo: (todo: Todo) => void,
  handleError: (error: ErrorMessages) => void,
  handleIdTodoLoading: (id: number[]) => void,
  handleSetDisableInput: (loading: boolean) => void,
  handleTempTodo: (todo: Todo) => void,
  handlePreparedTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
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

    handleSetDisableInput(true);
    handleTempTodo(newTodo);
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
      handleSetDisableInput(false);
      handleTempTodo(null);
      handleIdTodoLoading([]);
      handlePreparedTodos(prev => prev.filter(i => i.id !== 0));
      inputRef.current?.focus();
    }
  };

  return {
    inputText,
    setInputText,
    handleSubmit,
  };
};
