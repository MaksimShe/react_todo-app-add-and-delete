import classNames from 'classnames';
import { Todo } from '../../types';

type Props = {
  quantityActiveTasks: number;
  todos: Todo[];
  loadingTodos: number[];
};

export const TodoHeader: React.FC<Props> = ({ quantityActiveTasks, todos }) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: quantityActiveTasks === 0,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
