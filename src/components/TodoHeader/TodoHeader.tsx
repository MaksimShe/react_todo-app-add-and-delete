import cn from 'classnames';
import * as React from 'react';
import { useEffect } from 'react';
import { ErrorMessages, Todo } from '../../types';
import { useAddTodo } from '../../hooks/useAddTodo';

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
  const { inputText, setInputText, handleSubmit } = useAddTodo(
    handleAddTodo,
    handleError,
    handleIdTodoLoading,
    handleSetLoading,
    hanleActivateTempTodo,
    hanleDeleteTempTodo,
  );

  useEffect(() => {
    inputRef.current.focus();
  }, [inputRef, isLoading]);

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

      <form onSubmit={event => handleSubmit(event, inputRef)}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          value={inputText}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={e => setInputText(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
