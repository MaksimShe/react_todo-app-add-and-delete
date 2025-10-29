import cn from 'classnames';
import * as React from 'react';
import { useEffect } from 'react';
import { ErrorMessages, Todo } from '../../types';
import { useAddTodo } from '../../hooks/useAddTodo';

type Props = {
  quantityActiveTasks: number;
  preparedTodos: Todo[];
  isDisabledInput: boolean;
  inputRef;

  handleError: (error: ErrorMessages) => void;
  handleIdTodoLoading: (id: number[]) => void;
  handleSetDisableInput: (loading: boolean) => void;
  handlePreparedTodos: (todos: Todo[]) => void;
};

export const TodoHeader: React.FC<Props> = ({
  quantityActiveTasks,
  preparedTodos,
  isDisabledInput,
  inputRef,

  handleError,
  handleIdTodoLoading,
  handleSetDisableInput,
  handlePreparedTodos,
}) => {
  const { inputText, setInputText, handleSubmit } = useAddTodo({
    handleError,
    handleIdTodoLoading,
    handleSetDisableInput,
    handlePreparedTodos,
  });

  useEffect(() => {
    inputRef.current.focus();
  }, [inputRef, isDisabledInput]);

  return (
    <header className="todoapp__header">
      {preparedTodos.length > 0 && (
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
          disabled={isDisabledInput}
        />
      </form>
    </header>
  );
};
