import classNames from 'classnames';
import * as React from 'react';

type Props = {
  currentError: string | null;
  handleHideError: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  currentError,
  handleHideError,
}) => {
  setTimeout(() => {
    handleHideError();
  }, 3000);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !currentError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleHideError}
      />
      {currentError}
    </div>
  );
};
