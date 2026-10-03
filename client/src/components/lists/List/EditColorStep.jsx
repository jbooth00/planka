/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { Popup } from '../../../lib/custom-ui';

import entryActions from '../../../entry-actions';
import selectors from '../../../selectors';
import LIST_COLORS from '../../../constants/ListColors';

import styles from './EditColorStep.module.scss';
import globalStyles from '../../../styles.module.scss';

const EditColorStep = React.memo(({ listId, onBack, onClose }) => {
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const list = useSelector((state) => selectors.selectListById(state, listId));
  const defaultValue = list ? list.color : null;

  const handleSelect = useCallback(
    (color) => {
      dispatch(entryActions.updateList(listId, { color }));
      onClose();
    },
    [dispatch, listId, onClose],
  );

  const handleClearClick = useCallback(() => {
    dispatch(entryActions.updateList(listId, { color: null }));
    onClose();
  }, [dispatch, listId, onClose]);

  return (
    <>
      <Popup.Header onBack={onBack}>
        {t('common.editColor', { context: 'title' })}
      </Popup.Header>
      <Popup.Content>
        <div className={styles.colorButtons}>
          {LIST_COLORS.map((color) => (
            <Button
              key={color}
              type="button"
              className={classNames(
                styles.colorButton,
                color === defaultValue && styles.colorButtonActive,
                globalStyles[`background${upperFirst(camelCase(color))}`],
              )}
              onClick={() => handleSelect(color)}
            />
          ))}
          <input
            type="color"
            name="color"
            value={defaultValue || '#000000'}
            onChange={(e) => handleSelect(e.target.value)}
            style={{
              width: '32px',
              height: '32px',
              padding: 0,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              background: 'none',
            }}
          />
        </div>
        {defaultValue && (
          <Button
            fluid
            content={t('action.removeColor')}
            className={styles.clearButton}
            onClick={handleClearClick}
          />
        )}
      </Popup.Content>
    </>
  );
});

EditColorStep.propTypes = {
  listId: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditColorStep;
