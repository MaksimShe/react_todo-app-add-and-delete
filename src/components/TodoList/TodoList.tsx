/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { ErrorMessages, Todo } from '../../types';
import cn from 'classnames';
import * as React from 'react';
import { useDeleteTodos } from '../../hooks/useDeleteTodo';

type Props = {
  filteredTodos: Todo[];
  handleCheckTodo: (id: number) => void;
  todoIdLoading: number[];
  handleSetIdLoading: (id: number[]) => void;
  handleSetError(error: ErrorMessages);
  handlePreparedTodos: (todos: Todo[]) => void;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos, //use
  todoIdLoading, //jsx
  handleCheckTodo, //jsx
  handleSetIdLoading, //use
  handleSetError, //use
  handlePreparedTodos, //use
}) => {
  const { handleDeleteTodos } = useDeleteTodos(
    handlePreparedTodos, //setPreparedTodos
    handleSetError, // setCurrentError
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

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDeleteTodos(todo.id)}
            >
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={cn('modal overlay', {
                'is-active': todoIdLoading.includes(todo.id),
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
