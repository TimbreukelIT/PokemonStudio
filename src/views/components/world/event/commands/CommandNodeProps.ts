import type { StudioEventCommand, StudioEventCommandData } from '@modelEntities/event/command';
import type { CommandDialogsRef } from './editors/CommandEditorOverlay';

export type CommandNodeProps = {
  id: string;
  data: {
    dialogsRef?: CommandDialogsRef;
    command: StudioEventCommandData<StudioEventCommand>;
    comments: string[];
    onDuplicateNode?: (nodeId: string) => void;
    onDeleteNode?: (nodeId: string) => void;
    csvFileId: number;
  };
  selected?: boolean;
};
