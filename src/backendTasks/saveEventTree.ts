import log from 'electron-log';
import path from 'path';
import fs from 'fs';
import { defineBackendServiceFunction } from './defineBackendServiceFunction';

export interface SaveEventTreeInput {
  projectPath: string;
  eventTree: string;
  createBackup?: boolean;
  version?: string;
}

export interface SaveEventTreeResponse {
  success: boolean;
  filePath: string;
  timestamp: number;
  error?: string;
  backupPath?: string;
}

const EVENT_TREE_DIR = 'Data/Studio';
const EVENT_TREE_FILE = 'event_tree.json';

/**
 * Validate event tree JSON before saving
 */
function validateEventTree(eventTreeJson: string): { valid: boolean; error?: string } {
  try {
    const parsed = JSON.parse(eventTreeJson);

    // Basic structure validation
    if (typeof parsed !== 'object' || parsed === null) {
      return { valid: false, error: 'Event tree must be a JSON object' };
    }

    if (!parsed.commands || typeof parsed.commands !== 'object') {
      return { valid: false, error: 'Event tree must have a "commands" object' };
    }

    if (!Array.isArray(parsed.triggers)) {
      return { valid: false, error: 'Event tree must have a "triggers" array' };
    }

    return { valid: true };
  } catch (err) {
    return { valid: false, error: `Invalid JSON: ${err instanceof Error ? err.message : String(err)}` };
  }
}

/**
 * Save event tree to disk with atomic writes and backup support
 */
const saveEventTree = async (payload: SaveEventTreeInput): Promise<SaveEventTreeResponse> => {
  log.info('save-event-tree', { projectPath: payload.projectPath });

  try {
    // Validate input
    if (!payload.projectPath) {
      throw new Error('projectPath is required');
    }

    if (!payload.eventTree) {
      throw new Error('eventTree is required');
    }

    // Validate event tree structure
    const validation = validateEventTree(payload.eventTree);
    if (!validation.valid) {
      throw new Error(`Invalid event tree: ${validation.error}`);
    }

    // Ensure directory exists
    const eventTreeDir = path.join(payload.projectPath, EVENT_TREE_DIR);
    if (!fs.existsSync(eventTreeDir)) {
      fs.mkdirSync(eventTreeDir, { recursive: true });
      log.info('Created event tree directory', { path: eventTreeDir });
    }

    const filePath = path.join(eventTreeDir, EVENT_TREE_FILE);

    // Create backup if requested and file exists
    let backupPath: string | undefined;
    if (payload.createBackup && fs.existsSync(filePath)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupDir = path.join(eventTreeDir, 'backups');

      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      backupPath = path.join(backupDir, `event_tree-${timestamp}.json`);
      fs.copyFileSync(filePath, backupPath);
      log.info('Created event tree backup', { path: backupPath });
    }

    // Atomic write: write to temp file first, then rename
    const tempPath = filePath + '.tmp';
    fs.writeFileSync(tempPath, payload.eventTree, 'utf8');
    fs.renameSync(tempPath, filePath);

    log.info('save-event-tree/success', { filePath, bytes: payload.eventTree.length });

    return {
      success: true,
      filePath,
      timestamp: Date.now(),
      backupPath,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log.error('save-event-tree/error', { error: errorMessage });

    return {
      success: false,
      filePath: path.join(payload.projectPath, EVENT_TREE_DIR, EVENT_TREE_FILE),
      timestamp: Date.now(),
      error: errorMessage,
    };
  }
};

/**
 * Load event tree from disk
 */
export const loadEventTree = async (projectPath: string): Promise<{ success: boolean; data?: any; error?: string }> => {
  log.info('load-event-tree', { projectPath });

  try {
    if (!projectPath) {
      throw new Error('projectPath is required');
    }

    const filePath = path.join(projectPath, EVENT_TREE_DIR, EVENT_TREE_FILE);

    if (!fs.existsSync(filePath)) {
      log.warn('Event tree file not found', { path: filePath });
      return {
        success: false,
        error: `Event tree file not found: ${filePath}`,
      };
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);

    log.info('load-event-tree/success', { filePath });

    return {
      success: true,
      data,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log.error('load-event-tree/error', { error: errorMessage });

    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Get list of available backups for an event tree
 */
export const listEventTreeBackups = async (projectPath: string): Promise<{ success: boolean; backups?: string[]; error?: string }> => {
  log.info('list-event-tree-backups', { projectPath });

  try {
    const backupDir = path.join(projectPath, EVENT_TREE_DIR, 'backups');

    if (!fs.existsSync(backupDir)) {
      return {
        success: true,
        backups: [],
      };
    }

    const files = fs.readdirSync(backupDir);
    const backups = files
      .filter((f) => f.startsWith('event_tree-') && f.endsWith('.json'))
      .sort()
      .reverse();

    log.info('list-event-tree-backups/success', { count: backups.length });

    return {
      success: true,
      backups,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log.error('list-event-tree-backups/error', { error: errorMessage });

    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Restore an event tree from a backup
 */
export const restoreEventTreeBackup = async (projectPath: string, backupFileName: string): Promise<SaveEventTreeResponse> => {
  log.info('restore-event-tree-backup', { projectPath, backupFileName });

  try {
    const backupPath = path.join(projectPath, EVENT_TREE_DIR, 'backups', backupFileName);
    const currentFilePath = path.join(projectPath, EVENT_TREE_DIR, EVENT_TREE_FILE);

    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup file not found: ${backupPath}`);
    }

    // Read backup
    const backupContent = fs.readFileSync(backupPath, 'utf8');

    // Validate it before restoring
    const validation = validateEventTree(backupContent);
    if (!validation.valid) {
      throw new Error(`Invalid backup file: ${validation.error}`);
    }

    // Create backup of current file before restoring
    if (fs.existsSync(currentFilePath)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const preRestoreBackup = path.join(
        projectPath,
        EVENT_TREE_DIR,
        'backups',
        `event_tree-pre-restore-${timestamp}.json`
      );
      fs.copyFileSync(currentFilePath, preRestoreBackup);
      log.info('Created pre-restore backup', { path: preRestoreBackup });
    }

    // Restore by copying backup to current location
    fs.copyFileSync(backupPath, currentFilePath);
    log.info('restore-event-tree-backup/success', { backupPath, currentFilePath });

    return {
      success: true,
      filePath: currentFilePath,
      timestamp: Date.now(),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log.error('restore-event-tree-backup/error', { error: errorMessage });

    return {
      success: false,
      filePath: path.join(projectPath, EVENT_TREE_DIR, EVENT_TREE_FILE),
      timestamp: Date.now(),
      error: errorMessage,
    };
  }
};

export const registerSaveEventTree = defineBackendServiceFunction('save-event-tree', saveEventTree);
