/* eslint-disable no-console */
import cn from 'classnames';
import { ErrorMessages, Todo, USER_ID } from '../../types';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { addTodos } from '../../api/todos';

//i will refactor this piece of shit

type Props = {
  quantityActiveTasks: number;
  todos: Todo[];
  loadingTodos: number[];
  handleAddTodo: (todo: Todo) => void;
  handleError: (error: ErrorMessages) => void;
  isLoading: boolean;
  handleIdTodoLoading: (id: number[]) => void;
  handleSetLoading: (loading: boolean) => void;
  hanleActivateTempTodo: (todo: Todo) => void;
  hanleDeleteTempTodo: () => void;
  inputRef;
};

export const TodoHeader: React.FC<Props> = ({
  quantityActiveTasks,
  todos,
  handleAddTodo,
  handleError,
  isLoading,
  handleIdTodoLoading,
  handleSetLoading,
  hanleActivateTempTodo,
  hanleDeleteTempTodo,
  inputRef,
}) => {
  const [inputText, setInputText] = useState<string>('');

  const handleSubmit = async event => {
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

    console.log(newTodo);

    handleSetLoading(true);
    hanleActivateTempTodo(newTodo);
    handleIdTodoLoading([0]);
    try {
      const response = await addTodos(newTodo);

      setInputText('');

      newTodo.id = response.id;
    } catch (error) {
      handleError(ErrorMessages.Add);
      console.error('Error adding todo:', error);
      setTimeout(() => {
        handleError(ErrorMessages.WithoutError);
      }, 3000);
    } finally {
      handleSetLoading(false);
      hanleDeleteTempTodo();
      handleIdTodoLoading([]);
    }

    handleAddTodo(newTodo);

    inputRef.current?.focus();
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }

    if (!isLoading) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: quantityActiveTasks === 0,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          value={inputText}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setInputText(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
