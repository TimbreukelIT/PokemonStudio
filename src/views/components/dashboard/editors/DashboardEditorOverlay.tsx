import React from 'react';
import { defineEditorOverlay } from '@components/editor/EditorOverlayV2';
import { assertUnreachable } from '@utils/assertUnreachable';
import { DialogRefData } from '@hooks/useDialogsRef';
import { CompilationDialog } from '@components/compilation/CompilationDialog';

export type DashboardEditorAndDeletionKeys = 'create_playable_game';
export type DashboardDialogsRef = React.RefObject<DialogRefData<DashboardEditorAndDeletionKeys>>;

/**
 * Editor overlay for the dashboard.
 * This component uses the generic editor overlay to show the components based on what's called from dialogsRef.
 */
export const DashboardEditorOverlay = defineEditorOverlay<DashboardEditorAndDeletionKeys>(
  'DashboardEditorOverlay',
  (dialogToShow, handleCloseRef, closeDialog) => {
    switch (dialogToShow) {
      case 'create_playable_game':
        return <CompilationDialog closeDialog={closeDialog} />;
      default:
        return assertUnreachable(dialogToShow);
    }
  }
);
