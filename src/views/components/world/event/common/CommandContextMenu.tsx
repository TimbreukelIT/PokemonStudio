import React from 'react';
import { useTranslation } from 'react-i18next';
import CopyIcon from '@assets/icons/global/copy.svg';
import DeleteIcon from '@assets/icons/global/delete-icon.svg';

type CommandContextMenuProps = {
  onDuplicate: () => void;
  onDelete: () => void;
};

export const CommandContextMenu = ({ onDuplicate, onDelete }: CommandContextMenuProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div onClick={onDuplicate}>
        <span className="icon">
          <CopyIcon />
        </span>
        {t('duplicate')}
      </div>
      <div className="delete" onClick={onDelete}>
        <span className="icon">
          <DeleteIcon />
        </span>
        {t('delete')}
      </div>
    </>
  );
};
