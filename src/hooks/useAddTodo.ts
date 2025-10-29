import { useState } from 'react';
import { addTodos } from '../api/todos';
import { ErrorMessages, Todo, USER_ID } from '../types';

type Props = {
  handleError: (error: ErrorMessages) => void;
  handleIdTodoLoading: (id: number[]) => void;
  handleSetDisableInput: (loading: boolean) => void;
  handlePreparedTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export const useAddTodo = ({
  handleError,
  handleIdTodoLoading,
  handleSetDisableInput,
  handlePreparedTodos,
}: Props) => {
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
    handlePreparedTodos(prev => [...prev, { ...newTodo, id: 0 }]); //create temp todo
    handleIdTodoLoading([0]);

    try {
      const response = await addTodos(newTodo);

      setInputText('');
      newTodo.id = response.id;
      handlePreparedTodos(prev => [...prev, { ...newTodo }]); //add newTodo in list
    } catch {
      handleError(ErrorMessages.Add);
    } finally {
      handleSetDisableInput(false);
      handleIdTodoLoading([]);
      handlePreparedTodos(prev => prev.filter(i => i.id !== 0)); //delete temp todo
      inputRef.current?.focus();
    }
  };

  return {
    inputText,
    setInputText,
    handleSubmit,
  };
};
