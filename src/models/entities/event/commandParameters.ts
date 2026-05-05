import { z } from 'zod';
import type { StudioEventCommandType } from './command';
import type { StudioEventCommandCategory } from './category';

export type ParameterType = 'string' | 'number' | 'boolean' | 'select' | 'multiselect' | 'array' | 'object';

export interface ParameterOption {
  label: string;
  value: string | number | boolean;
}

export interface CommandParameterDefinition {
  name: string;
  type: ParameterType;
  displayName: string;
  description?: string;
  required: boolean;
  defaultValue?: any;
  options?: ParameterOption[];
  min?: number;
  max?: number;
  pattern?: RegExp;
  validator?: z.ZodSchema;
}

export interface CommandMetadata {
  type: StudioEventCommandType;
  displayName: string;
  description: string;
  category: StudioEventCommandCategory;
  icon: string;
  color: string;
  parameters: CommandParameterDefinition[];
}

export const COMMAND_PARAMETER_REGISTRY: Record<StudioEventCommandType, CommandMetadata> = {
  // Messages
  show_message: {
    type: 'show_message',
    displayName: 'Show Message',
    description: 'Display a message dialog to the player',
    category: 'messages',
    icon: 'comment-icon',
    color: '#4CAF50',
    parameters: [
      {
        name: 'text',
        type: 'string',
        displayName: 'Message Text',
        description: 'The text to display in the message box',
        required: true,
      },
      {
        name: 'speaker',
        type: 'string',
        displayName: 'Speaker Name',
        description: 'Optional name of who is speaking (appears above message)',
        required: false,
      },
      {
        name: 'position',
        type: 'select',
        displayName: 'Position',
        description: 'Where to display the message box on screen',
        required: false,
        defaultValue: 'center',
        options: [
          { label: 'Top', value: 'top' },
          { label: 'Center', value: 'center' },
          { label: 'Bottom', value: 'bottom' },
        ],
      },
    ],
  },

  narrator_settings: {
    type: 'narrator_settings',
    displayName: 'Narrator Settings',
    description: 'Configure narrator/speaker settings',
    category: 'messages',
    icon: 'settings-icon',
    color: '#4CAF50',
    parameters: [
      {
        name: 'narratorName',
        type: 'string',
        displayName: 'Default Narrator Name',
        required: false,
      },
      {
        name: 'fontSize',
        type: 'number',
        displayName: 'Font Size',
        required: false,
        min: 8,
        max: 48,
      },
    ],
  },

  manage_message_box: {
    type: 'manage_message_box',
    displayName: 'Manage Message Box',
    description: 'Configure message box appearance and behavior',
    category: 'messages',
    icon: 'box-icon',
    color: '#4CAF50',
    parameters: [
      {
        name: 'backgroundColor',
        type: 'string',
        displayName: 'Background Color',
        required: false,
        pattern: /^#[0-9A-Fa-f]{6}$/,
      },
      {
        name: 'opacity',
        type: 'number',
        displayName: 'Opacity',
        required: false,
        min: 0,
        max: 100,
      },
    ],
  },

  show_choice: {
    type: 'show_choice',
    displayName: 'Show Choices',
    description: 'Display multiple choice options to the player',
    category: 'messages',
    icon: 'choice-icon',
    color: '#4CAF50',
    parameters: [
      {
        name: 'prompt',
        type: 'string',
        displayName: 'Choice Prompt',
        description: 'Text to display above the choices',
        required: true,
      },
      {
        name: 'choices',
        type: 'array',
        displayName: 'Choice Options',
        description: 'Array of choice text strings',
        required: true,
      },
      {
        name: 'cancelable',
        type: 'boolean',
        displayName: 'Can Cancel',
        description: 'Allow player to cancel the choice dialog',
        required: false,
        defaultValue: false,
      },
    ],
  },

  // Flow Control
  create_loop: {
    type: 'create_loop',
    displayName: 'Create Loop',
    description: 'Start a repeating loop block',
    category: 'flow_control',
    icon: 'loop-icon',
    color: '#2196F3',
    parameters: [
      {
        name: 'iterations',
        type: 'number',
        displayName: 'Number of Iterations',
        description: 'How many times to repeat (leave empty for infinite)',
        required: false,
        min: 1,
      },
    ],
  },

  exit_loop: {
    type: 'exit_loop',
    displayName: 'Exit Loop',
    description: 'Exit/break out of the current loop',
    category: 'flow_control',
    icon: 'break-icon',
    color: '#2196F3',
    parameters: [],
  },

  manage_conditions: {
    type: 'manage_conditions',
    displayName: 'Conditional Branch',
    description: 'Execute commands conditionally based on a condition',
    category: 'flow_control',
    icon: 'branch-icon',
    color: '#2196F3',
    parameters: [
      {
        name: 'conditionType',
        type: 'select',
        displayName: 'Condition Type',
        required: true,
        options: [
          { label: 'Variable', value: 'variable' },
          { label: 'Switch', value: 'switch' },
          { label: 'Script', value: 'script' },
        ],
      },
      {
        name: 'variableName',
        type: 'string',
        displayName: 'Variable Name',
        required: false,
      },
      {
        name: 'comparison',
        type: 'select',
        displayName: 'Comparison',
        required: false,
        options: [
          { label: 'Equal', value: '==' },
          { label: 'Not Equal', value: '!=' },
          { label: 'Greater Than', value: '>' },
          { label: 'Less Than', value: '<' },
        ],
      },
      {
        name: 'value',
        type: 'string',
        displayName: 'Compare Value',
        required: false,
      },
    ],
  },

  go_to: {
    type: 'go_to',
    displayName: 'Go To (Jump)',
    description: 'Jump to a specific command',
    category: 'flow_control',
    icon: 'jump-icon',
    color: '#2196F3',
    parameters: [
      {
        name: 'targetCommandId',
        type: 'string',
        displayName: 'Target Command ID',
        description: 'ID of the command to jump to',
        required: true,
      },
    ],
  },

  wait_for_set_time: {
    type: 'wait_for_set_time',
    displayName: 'Wait',
    description: 'Pause execution for a specified time',
    category: 'flow_control',
    icon: 'wait-icon',
    color: '#2196F3',
    parameters: [
      {
        name: 'duration',
        type: 'number',
        displayName: 'Wait Duration (ms)',
        description: 'How long to wait in milliseconds',
        required: true,
        min: 0,
      },
    ],
  },

  stop_event_execution: {
    type: 'stop_event_execution',
    displayName: 'Stop Event',
    description: 'Terminate the current event',
    category: 'flow_control',
    icon: 'stop-icon',
    color: '#2196F3',
    parameters: [],
  },

  call_event: {
    type: 'call_event',
    displayName: 'Call Event',
    description: 'Call another event from this event',
    category: 'flow_control',
    icon: 'call-icon',
    color: '#2196F3',
    parameters: [
      {
        name: 'eventId',
        type: 'string',
        displayName: 'Event ID',
        description: 'ID of the event to call',
        required: true,
      },
    ],
  },

  trigger_event: {
    type: 'trigger_event',
    displayName: 'Trigger Event',
    description: 'Trigger another event',
    category: 'flow_control',
    icon: 'trigger-icon',
    color: '#2196F3',
    parameters: [
      {
        name: 'eventId',
        type: 'string',
        displayName: 'Event ID',
        required: true,
      },
      {
        name: 'triggerType',
        type: 'select',
        displayName: 'Trigger Type',
        required: false,
        options: [
          { label: 'Call', value: 'call' },
          { label: 'Parallel', value: 'parallel' },
        ],
      },
    ],
  },

  // Game Data
  manage_variables: {
    type: 'manage_variables',
    displayName: 'Manage Variables',
    description: 'Create, read, or modify game variables',
    category: 'game_data',
    icon: 'variable-icon',
    color: '#FF9800',
    parameters: [
      {
        name: 'operation',
        type: 'select',
        displayName: 'Operation',
        required: true,
        options: [
          { label: 'Set', value: 'set' },
          { label: 'Add', value: 'add' },
          { label: 'Subtract', value: 'subtract' },
          { label: 'Multiply', value: 'multiply' },
          { label: 'Divide', value: 'divide' },
        ],
      },
      {
        name: 'variableName',
        type: 'string',
        displayName: 'Variable Name',
        required: true,
      },
      {
        name: 'value',
        type: 'string',
        displayName: 'Value',
        required: true,
      },
    ],
  },

  manage_event_variables: {
    type: 'manage_event_variables',
    displayName: 'Local Variables',
    description: 'Manage event-local variables',
    category: 'game_data',
    icon: 'local-icon',
    color: '#FF9800',
    parameters: [
      {
        name: 'variableName',
        type: 'string',
        displayName: 'Variable Name',
        required: true,
      },
      {
        name: 'value',
        type: 'string',
        displayName: 'Value',
        required: true,
      },
    ],
  },

  manage_timer: {
    type: 'manage_timer',
    displayName: 'Timer Control',
    description: 'Control a game timer',
    category: 'game_data',
    icon: 'timer-icon',
    color: '#FF9800',
    parameters: [
      {
        name: 'operation',
        type: 'select',
        displayName: 'Operation',
        required: true,
        options: [
          { label: 'Start', value: 'start' },
          { label: 'Stop', value: 'stop' },
          { label: 'Reset', value: 'reset' },
        ],
      },
      {
        name: 'duration',
        type: 'number',
        displayName: 'Duration (seconds)',
        required: false,
        min: 0,
      },
    ],
  },

  change_character_name: {
    type: 'change_character_name',
    displayName: 'Change Character Name',
    description: 'Change the name of a character',
    category: 'game_data',
    icon: 'name-icon',
    color: '#FF9800',
    parameters: [
      {
        name: 'characterId',
        type: 'string',
        displayName: 'Character ID',
        required: true,
      },
      {
        name: 'newName',
        type: 'string',
        displayName: 'New Name',
        required: true,
      },
    ],
  },

  // Scripting (placeholder for others)
  insert_script: {
    type: 'insert_script',
    displayName: 'Insert Script',
    description: 'Execute custom Ruby script code',
    category: 'scripting',
    icon: 'code-icon',
    color: '#9C27B0',
    parameters: [
      {
        name: 'script',
        type: 'string',
        displayName: 'Script Code',
        description: 'Ruby code to execute',
        required: true,
      },
    ],
  },

  // Placeholder entries for all other command types (can be expanded later)
  change_event_parameters: {
    type: 'change_event_parameters',
    displayName: 'Change Event Parameters',
    description: 'Modify event properties',
    category: 'movement',
    icon: 'settings-icon',
    color: '#00BCD4',
    parameters: [],
  },

  move_event: {
    type: 'move_event',
    displayName: 'Move Event',
    description: 'Move an event on the map',
    category: 'movement',
    icon: 'move-icon',
    color: '#00BCD4',
    parameters: [],
  },

  teleport_event: {
    type: 'teleport_event',
    displayName: 'Teleport Event',
    description: 'Teleport an event to a location',
    category: 'movement',
    icon: 'teleport-icon',
    color: '#00BCD4',
    parameters: [],
  },

  teleport_player: {
    type: 'teleport_player',
    displayName: 'Teleport Player',
    description: 'Teleport the player to a location',
    category: 'movement',
    icon: 'teleport-icon',
    color: '#00BCD4',
    parameters: [],
  },

  wait_move_completion: {
    type: 'wait_move_completion',
    displayName: 'Wait for Movement',
    description: 'Wait for an event to finish moving',
    category: 'movement',
    icon: 'wait-icon',
    color: '#00BCD4',
    parameters: [],
  },

  manage_event_reappearance: {
    type: 'manage_event_reappearance',
    displayName: 'Event Reappearance',
    description: 'Configure event reappearance',
    category: 'movement',
    icon: 'reappear-icon',
    color: '#00BCD4',
    parameters: [],
  },

  manage_path_finding: {
    type: 'manage_path_finding',
    displayName: 'Path Finding',
    description: 'Configure pathfinding for events',
    category: 'movement',
    icon: 'path-icon',
    color: '#00BCD4',
    parameters: [],
  },

  manage_follow_me: {
    type: 'manage_follow_me',
    displayName: 'Follow Me',
    description: 'Make an event follow another',
    category: 'movement',
    icon: 'follow-icon',
    color: '#00BCD4',
    parameters: [],
  },

  wait_key_press: {
    type: 'wait_key_press',
    displayName: 'Wait for Key Press',
    description: 'Wait for player to press a key',
    category: 'player_interactions',
    icon: 'key-icon',
    color: '#E91E63',
    parameters: [],
  },

  record_key_press: {
    type: 'record_key_press',
    displayName: 'Record Key Press',
    description: 'Record which key the player pressed',
    category: 'player_interactions',
    icon: 'record-icon',
    color: '#E91E63',
    parameters: [],
  },

  input_creature_name: {
    type: 'input_creature_name',
    displayName: 'Input Creature Name',
    description: 'Let player name a creature',
    category: 'player_interactions',
    icon: 'input-icon',
    color: '#E91E63',
    parameters: [],
  },

  input_character_name: {
    type: 'input_character_name',
    displayName: 'Input Character Name',
    description: 'Let player name a character',
    category: 'player_interactions',
    icon: 'input-icon',
    color: '#E91E63',
    parameters: [],
  },

  ask_player_for_number: {
    type: 'ask_player_for_number',
    displayName: 'Input Number',
    description: 'Ask player to input a number',
    category: 'player_interactions',
    icon: 'input-icon',
    color: '#E91E63',
    parameters: [],
  },

  start_trainer_battle: {
    type: 'start_trainer_battle',
    displayName: 'Trainer Battle',
    description: 'Start a battle against a trainer',
    category: 'battles',
    icon: 'battle-icon',
    color: '#F44336',
    parameters: [],
  },

  start_wild_encounter: {
    type: 'start_wild_encounter',
    displayName: 'Wild Encounter',
    description: 'Start a wild Pokémon encounter',
    category: 'battles',
    icon: 'wild-icon',
    color: '#F44336',
    parameters: [],
  },

  start_scripted_battle: {
    type: 'start_scripted_battle',
    displayName: 'Scripted Battle',
    description: 'Start a custom scripted battle',
    category: 'battles',
    icon: 'script-icon',
    color: '#F44336',
    parameters: [],
  },

  manage_random_encounters: {
    type: 'manage_random_encounters',
    displayName: 'Random Encounters',
    description: 'Configure random encounters',
    category: 'battles',
    icon: 'random-icon',
    color: '#F44336',
    parameters: [],
  },

  manage_player_items: {
    type: 'manage_player_items',
    displayName: 'Manage Items',
    description: 'Add or remove items from inventory',
    category: 'inventory',
    icon: 'item-icon',
    color: '#8BC34A',
    parameters: [],
  },

  manage_player_money: {
    type: 'manage_player_money',
    displayName: 'Manage Money',
    description: 'Add or remove money',
    category: 'inventory',
    icon: 'money-icon',
    color: '#8BC34A',
    parameters: [],
  },

  manage_dex: {
    type: 'manage_dex',
    displayName: 'Manage Dex',
    description: 'Manage Pokédex entries',
    category: 'inventory',
    icon: 'dex-icon',
    color: '#8BC34A',
    parameters: [],
  },

  set_active_dex: {
    type: 'set_active_dex',
    displayName: 'Set Active Dex',
    description: 'Set the active Pokédex',
    category: 'inventory',
    icon: 'dex-icon',
    color: '#8BC34A',
    parameters: [],
  },

  give_badge: {
    type: 'give_badge',
    displayName: 'Give Badge',
    description: 'Award a gym badge to the player',
    category: 'inventory',
    icon: 'badge-icon',
    color: '#8BC34A',
    parameters: [],
  },

  manage_access_save_menu: {
    type: 'manage_access_save_menu',
    displayName: 'Manage Save Access',
    description: 'Enable or disable saving',
    category: 'save',
    icon: 'save-icon',
    color: '#673AB7',
    parameters: [],
  },

  open_save_menu: {
    type: 'open_save_menu',
    displayName: 'Open Save Menu',
    description: 'Open the save/load menu',
    category: 'save',
    icon: 'save-icon',
    color: '#673AB7',
    parameters: [],
  },

  manage_autosave: {
    type: 'manage_autosave',
    displayName: 'Manage Autosave',
    description: 'Configure autosave behavior',
    category: 'save',
    icon: 'save-icon',
    color: '#673AB7',
    parameters: [],
  },

  force_autosave: {
    type: 'force_autosave',
    displayName: 'Force Autosave',
    description: 'Trigger an autosave immediately',
    category: 'save',
    icon: 'save-icon',
    color: '#673AB7',
    parameters: [],
  },

  force_save: {
    type: 'force_save',
    displayName: 'Force Save',
    description: 'Force an immediate save',
    category: 'save',
    icon: 'save-icon',
    color: '#673AB7',
    parameters: [],
  },

  open_scene: {
    type: 'open_scene',
    displayName: 'Open Scene',
    description: 'Open a game scene or screen',
    category: 'game_interfaces',
    icon: 'scene-icon',
    color: '#3F51B5',
    parameters: [],
  },

  open_shop: {
    type: 'open_shop',
    displayName: 'Open Shop',
    description: 'Open a shop interface',
    category: 'game_interfaces',
    icon: 'shop-icon',
    color: '#3F51B5',
    parameters: [],
  },

  open_custom_scene: {
    type: 'open_custom_scene',
    displayName: 'Open Custom Scene',
    description: 'Open a custom scene',
    category: 'game_interfaces',
    icon: 'scene-icon',
    color: '#3F51B5',
    parameters: [],
  },

  manage_access_main_menu: {
    type: 'manage_access_main_menu',
    displayName: 'Manage Main Menu Access',
    description: 'Enable or disable main menu access',
    category: 'game_interfaces',
    icon: 'menu-icon',
    color: '#3F51B5',
    parameters: [],
  },

  trigger_game_over: {
    type: 'trigger_game_over',
    displayName: 'Game Over',
    description: 'Trigger game over',
    category: 'game_interfaces',
    icon: 'gameover-icon',
    color: '#3F51B5',
    parameters: [],
  },

  return_to_title_screen: {
    type: 'return_to_title_screen',
    displayName: 'Return to Title',
    description: 'Return to title screen',
    category: 'game_interfaces',
    icon: 'title-icon',
    color: '#3F51B5',
    parameters: [],
  },

  open_creature_shop: {
    type: 'open_creature_shop',
    displayName: 'Creature Shop',
    description: 'Open creature trading shop',
    category: 'game_interfaces',
    icon: 'shop-icon',
    color: '#3F51B5',
    parameters: [],
  },

  play_sound: {
    type: 'play_sound',
    displayName: 'Play Sound',
    description: 'Play a sound effect',
    category: 'audio',
    icon: 'sound-icon',
    color: '#009688',
    parameters: [],
  },

  stop_current_sound: {
    type: 'stop_current_sound',
    displayName: 'Stop Sound',
    description: 'Stop the current sound',
    category: 'audio',
    icon: 'sound-icon',
    color: '#009688',
    parameters: [],
  },

  change_default_sound: {
    type: 'change_default_sound',
    displayName: 'Default Sound',
    description: 'Change default sound settings',
    category: 'audio',
    icon: 'sound-icon',
    color: '#009688',
    parameters: [],
  },

  memorize_background_sounds: {
    type: 'memorize_background_sounds',
    displayName: 'Memorize BGM',
    description: 'Memorize current background music',
    category: 'audio',
    icon: 'sound-icon',
    color: '#009688',
    parameters: [],
  },

  restore_background_sounds: {
    type: 'restore_background_sounds',
    displayName: 'Restore BGM',
    description: 'Restore previously memorized BGM',
    category: 'audio',
    icon: 'sound-icon',
    color: '#009688',
    parameters: [],
  },

  play_creature_cry: {
    type: 'play_creature_cry',
    displayName: 'Creature Cry',
    description: 'Play a creature cry sound',
    category: 'audio',
    icon: 'sound-icon',
    color: '#009688',
    parameters: [],
  },

  change_screen_tone: {
    type: 'change_screen_tone',
    displayName: 'Screen Tone',
    description: 'Change the screen tone/color',
    category: 'visual_effects',
    icon: 'tone-icon',
    color: '#FF5722',
    parameters: [],
  },

  display_animation: {
    type: 'display_animation',
    displayName: 'Animation',
    description: 'Display an animation',
    category: 'visual_effects',
    icon: 'animation-icon',
    color: '#FF5722',
    parameters: [],
  },

  display_screen_animation: {
    type: 'display_screen_animation',
    displayName: 'Screen Animation',
    description: 'Display a full-screen animation',
    category: 'visual_effects',
    icon: 'animation-icon',
    color: '#FF5722',
    parameters: [],
  },

  display_emotion: {
    type: 'display_emotion',
    displayName: 'Display Emotion',
    description: 'Display an emotion popup',
    category: 'visual_effects',
    icon: 'emotion-icon',
    color: '#FF5722',
    parameters: [],
  },

  manage_image: {
    type: 'manage_image',
    displayName: 'Manage Image',
    description: 'Manage on-screen images/pictures',
    category: 'visual_effects',
    icon: 'image-icon',
    color: '#FF5722',
    parameters: [],
  },

  manage_camera: {
    type: 'manage_camera',
    displayName: 'Camera',
    description: 'Control the camera',
    category: 'visual_effects',
    icon: 'camera-icon',
    color: '#FF5722',
    parameters: [],
  },

  manage_dynamic_light: {
    type: 'manage_dynamic_light',
    displayName: 'Dynamic Light',
    description: 'Manage dynamic lighting',
    category: 'visual_effects',
    icon: 'light-icon',
    color: '#FF5722',
    parameters: [],
  },

  change_weather: {
    type: 'change_weather',
    displayName: 'Change Weather',
    description: 'Change map weather effects',
    category: 'visual_environment',
    icon: 'weather-icon',
    color: '#FFEB3B',
    parameters: [],
  },

  manage_map_fog: {
    type: 'manage_map_fog',
    displayName: 'Fog',
    description: 'Manage map fog effects',
    category: 'visual_environment',
    icon: 'fog-icon',
    color: '#FFEB3B',
    parameters: [],
  },

  manage_map_panorama: {
    type: 'manage_map_panorama',
    displayName: 'Panorama',
    description: 'Manage map panorama/background',
    category: 'visual_environment',
    icon: 'panorama-icon',
    color: '#FFEB3B',
    parameters: [],
  },

  change_battle_background: {
    type: 'change_battle_background',
    displayName: 'Battle Background',
    description: 'Change battle background',
    category: 'visual_environment',
    icon: 'background-icon',
    color: '#FFEB3B',
    parameters: [],
  },

  start_quest: {
    type: 'start_quest',
    displayName: 'Start Quest',
    description: 'Start a quest',
    category: 'quests',
    icon: 'quest-icon',
    color: '#607D8B',
    parameters: [],
  },

  display_hidden_objective: {
    type: 'display_hidden_objective',
    displayName: 'Hidden Objective',
    description: 'Display a hidden quest objective',
    category: 'quests',
    icon: 'quest-icon',
    color: '#607D8B',
    parameters: [],
  },

  validate_quest_objectives: {
    type: 'validate_quest_objectives',
    displayName: 'Validate Objectives',
    description: 'Check quest objective completion',
    category: 'quests',
    icon: 'quest-icon',
    color: '#607D8B',
    parameters: [],
  },

  display_quest_progress: {
    type: 'display_quest_progress',
    displayName: 'Quest Progress',
    description: 'Display quest progress',
    category: 'quests',
    icon: 'quest-icon',
    color: '#607D8B',
    parameters: [],
  },

  complete_quest: {
    type: 'complete_quest',
    displayName: 'Complete Quest',
    description: 'Complete a quest',
    category: 'quests',
    icon: 'quest-icon',
    color: '#607D8B',
    parameters: [],
  },
};

export function getCommandMetadata(commandType: StudioEventCommandType): CommandMetadata | undefined {
  return COMMAND_PARAMETER_REGISTRY[commandType];
}

export function getCommandParameters(commandType: StudioEventCommandType): CommandParameterDefinition[] {
  const metadata = getCommandMetadata(commandType);
  return metadata?.parameters ?? [];
}

export function validateCommandParameters(
  commandType: StudioEventCommandType,
  parameters: Record<string, any>
): { valid: boolean; errors: string[] } {
  const commandParams = getCommandParameters(commandType);
  const errors: string[] = [];

  commandParams.forEach((param) => {
    if (param.required && (parameters[param.name] === undefined || parameters[param.name] === null || parameters[param.name] === '')) {
      errors.push(`${param.displayName} is required`);
    }

    if (parameters[param.name] !== undefined) {
      const value = parameters[param.name];

      // Type validation
      switch (param.type) {
        case 'number':
          if (typeof value !== 'number') {
            errors.push(`${param.displayName} must be a number`);
          }
          if (param.min !== undefined && value < param.min) {
            errors.push(`${param.displayName} must be at least ${param.min}`);
          }
          if (param.max !== undefined && value > param.max) {
            errors.push(`${param.displayName} must be at most ${param.max}`);
          }
          break;

        case 'boolean':
          if (typeof value !== 'boolean') {
            errors.push(`${param.displayName} must be boolean`);
          }
          break;

        case 'string':
          if (typeof value !== 'string') {
            errors.push(`${param.displayName} must be a string`);
          }
          if (param.pattern && !param.pattern.test(value)) {
            errors.push(`${param.displayName} has invalid format`);
          }
          break;

        case 'select':
        case 'multiselect':
          if (param.options) {
            const validValues = param.options.map((o) => o.value);
            if (!validValues.includes(value)) {
              errors.push(`${param.displayName} has invalid option`);
            }
          }
          break;
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
