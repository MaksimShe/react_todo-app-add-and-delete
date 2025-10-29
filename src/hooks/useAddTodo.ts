import { Dispatch, RefObject, SetStateAction } from 'react';
import { ErrorMessages, Todo, USER_ID } from '../types';
import { addTodos } from '../api/todos';

type Props = {
  setCurrentError: Dispatch<SetStateAction<ErrorMessages | ''>>;
  setTodoIdLoading: number[];
  setTempTodo: Todo;
  inputRef: RefObject<HTMLInputElement>;
};

const useAddTodo: React.FC<Props> = (
  setCurrentError,
  setTodoIdLoading,
  setTempTodo,
  inputRef,
) => {
  const handleAddTodo = async (title, setInputText: (text: string) => void) => {
    if (title.trim() === '') {
      setCurrentError(ErrorMessages.EmptyTitle);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: title,
      completed: false,
    };

    setTodoIdLoading(prev => [...prev], newTodo.id);
    setTempTodo(newTodo);

    try {
      const response = await addTodos(newTodo);

      setInputText('');

      newTodo.id = response.id;
    } catch (error) {
      setCurrentError(ErrorMessages.Add);
      setTempTodo(null);
    } finally {
      setTodoIdLoading(prev => prev.filter(id => id !== newTodo.id));
      if (!inputRef.current && !inputRef.current.disabled) {
        inputRef.current.focus();
      }
    }
  };
};
