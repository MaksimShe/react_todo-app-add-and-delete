/* eslint-disable jsx-a11y/label-has-associated-control */

import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodos, getTodos } from './api/todos';
import { FilterStatus, ErrorMessages } from './types';
import { Todo, USER_ID } from './types';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { TodoList } from './components/TodoList';
import { filterTodos } from './utils/fiterTodos';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(null);
  const [idTodoLoading, setIdTodoLoading] = useState<number[]>([]);
  const [preparedTodos, setPreparedTodos] = useState<Todo[]>([]);
  const [activeFilterStatus, setActiveFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );
  const [currentError, setCurrentError] = useState<ErrorMessages | ''>('');
  const inputRef = useRef<HTMLInputElement>();

  const handleHideError = (): void => {
    setCurrentError('');
  };

  useEffect(() => {
    const loadTodos = async () => {
      try {
        setIsLoading(true);
        const data: Todo[] = await getTodos();

        setPreparedTodos(data);
      } catch (error) {
        setCurrentError(ErrorMessages.Load);
        setTimeout(() => {
          handleHideError();
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, [currentError]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const activateTempTodo = tempTodo => {
    setPreparedTodos(prev => [...prev, { ...tempTodo, id: 0 }]);
  };

  const deleteTempTodo = () => {
    setPreparedTodos(prev => prev.filter(todo => todo.id !== 0));
  };

  const addTodoOnScreen = (todo: Todo) => {
    setPreparedTodos(prev => [...prev, { ...todo }]);
  };

  const deleteTodoOnScreen = (id: number) => {
    setPreparedTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const filteredTodos = filterTodos(preparedTodos, activeFilterStatus);

  const handleChangeFilter = (type: FilterStatus) => {
    setActiveFilterStatus(type);
  };

  const handleCheckTodo = (id: number) => {
    setPreparedTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const quantityActiveTasks = (): number => {
    return preparedTodos.filter(todo => !todo.completed && todo.id !== 0)
      .length;
  };

  const deleteAllCompletedTodos = async () => {
    const completedTodos = preparedTodos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setIdTodoLoading(completedIds);

    try {
      const results = await Promise.allSettled(
        completedTodos.map(todo => deleteTodos(todo.id)),
      );

      const successfulIds = completedIds.filter(
        (_, index) => results[index].status === 'fulfilled',
      );

      setPreparedTodos(prev =>
        prev.filter(todo => !successfulIds.includes(todo.id)),
      );

      const hasError = results.some(r => r.status === 'rejected');

      if (hasError) {
        setCurrentError(ErrorMessages.Delete);
        setTimeout(() => setCurrentError(ErrorMessages.WithoutError), 3000);
      }
    } finally {
      setIdTodoLoading([]);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          quantityActiveTasks={quantityActiveTasks()}
          todos={preparedTodos}
          loadingTodos={[]}
          handleAddTodo={addTodoOnScreen}
          handleError={setCurrentError}
          isLoading={isLoading}
          handleIdTodoLoading={setIdTodoLoading}
          handleSetLoading={setIsLoading}
          hanleActivateTempTodo={activateTempTodo}
          hanleDeleteTempTodo={deleteTempTodo}
          inputRef={inputRef}
          handlePreparedTodos={setPreparedTodos}
        />

        <TodoList
          filteredTodos={filteredTodos}
          handleCheckTodo={handleCheckTodo}
          idTodoLoading={idTodoLoading}
          handleSetIdLoading={setIdTodoLoading}
          handleError={setCurrentError}
          handlePreparedTodos={setPreparedTodos}
        />

        {preparedTodos.length > 0 && (
          <TodoFooter
            todos={preparedTodos}
            quantityActiveTasks={quantityActiveTasks()}
            activeFilterStatus={activeFilterStatus}
            handleChangeFilter={handleChangeFilter}
            handleDeleteAllTodos={() => deleteAllCompletedTodos()}
          />
        )}
      </div>

      <ErrorNotification
        currentError={currentError}
        handleHideError={handleHideError}
      />
    </div>
  );
};
