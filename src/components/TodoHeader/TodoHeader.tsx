/* eslint-disable no-console */
import cn from 'classnames';
import { Todo, USER_ID } from '../../types';
import * as React from 'react';
import { useState } from 'react';
import { addTodos } from '../../api/todos';

type Props = {
  quantityActiveTasks: number;
  todos: Todo[];
  loadingTodos: number[];
};

export const TodoHeader: React.FC<Props> = ({ quantityActiveTasks, todos }) => {
  const [inputText, setInputText] = useState<string>('');

  const handleSubmit = async event => {
    event.preventDefault();

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: inputText,
      completed: false,
    };

    try {
      const savedTodo = await addTodos(newTodo);
    } catch (error) {
      console.error('Error adding todo:', error);
    }

    setInputText('');
  };

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
          data-cy="NewTodoField"
          type="text"
          value={inputText}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setInputText(event.target.value)}
        />
      </form>
    </header>
  );
};
