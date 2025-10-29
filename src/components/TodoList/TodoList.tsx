/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { ErrorMessages, Todo } from '../../types';
import cn from 'classnames';
import * as React from 'react';
import { useDeleteTodos } from '../../hooks/useDeleteTodo';

type Props = {
  filteredTodos: Todo[];
  handleCheckTodo: (id: number) => void;
  idTodoLoading: number[];
  handleSetIdLoading: (id: number[]) => void;
  handleError(error: ErrorMessages);
  handlePreparedTodos: (todos: Todo[]) => void;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  handleCheckTodo,
  idTodoLoading,
  handleSetIdLoading,
  handleError,
  handlePreparedTodos,
}) => {
  const { handleDeleteTodos } = useDeleteTodos(
    handlePreparedTodos, //setPreparedTodos
    handleError, // setCurrentError
    handleSetIdLoading, //setTodoIdLoad
    filteredTodos, //todos
  );

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map((todo: Todo) => {
        return (
          <div
            key={todo.id}
            data-cy="Todo"
            className={cn('todo', { completed: todo.completed })}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => handleCheckTodo(todo.id)}
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>

            {/* Remove button appears only on hover */}
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDeleteTodos(todo.id)}
            >
              ×
            </button>

            {/* overlay will cover the todo while it is being deleted or updated */}
            <div
              data-cy="TodoLoader"
              className={cn('modal overlay', {
                'is-active': idTodoLoading.includes(todo.id),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
    </section>
  );
};
