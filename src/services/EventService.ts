import type { StudioEventCommand, CommandId, StudioEventCommandType, StudioEventCommandConnection } from '@modelEntities/event/command';
import { validateCommandParameters, getCommandMetadata } from '@modelEntities/event/commandParameters';
import type { StudioEvent } from '@modelEntities/event/event';

export interface ValidationError {
  nodeId: CommandId;
  commandType: StudioEventCommandType;
  message: string;
}

export interface TreeValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: string[];
}

export class EventService {
  /**
   * Create a new event command node with validation
   */
  createNode(commandType: StudioEventCommandType, parameters: Record<string, any> = {}): StudioEventCommand {
    // Validate parameters
    const validation = validateCommandParameters(commandType, parameters);
    if (!validation.valid) {
      throw new Error(`Invalid parameters for ${commandType}: ${validation.errors.join(', ')}`);
    }

    // Get metadata for default styling
    const metadata = getCommandMetadata(commandType);
    if (!metadata) {
      throw new Error(`Unknown command type: ${commandType}`);
    }

    const nodeId = this.generateCommandId();

    return {
      type: commandType,
      connections: {},
      studioData: {
        x: 0,
        y: 0,
        comments: [],
      },
    };
  }

  /**
   * Update an existing command node
   */
  updateNode(node: StudioEventCommand, updates: Partial<StudioEventCommand>): StudioEventCommand {
    // If updating command type, validate new parameters
    if (updates.type && updates.type !== node.type) {
      const validation = validateCommandParameters(updates.type, {});
      if (!validation.valid) {
        throw new Error(`Invalid command type: ${updates.type}`);
      }
    }

    return {
      ...node,
      ...updates,
      studioData: {
        ...node.studioData,
        ...(updates.studioData ?? {}),
      },
    };
  }

  /**
   * Delete a command node from the event tree
   */
  deleteNode(event: StudioEvent, nodeId: CommandId): StudioEvent {
    const newCommands = { ...event.commands };
    delete newCommands[nodeId];

    // Also remove connections pointing to this node
    Object.values(newCommands).forEach((cmd) => {
      Object.entries(cmd.connections).forEach(([key, conn]) => {
        if (conn.target === nodeId) {
          cmd.connections = {
            ...cmd.connections,
          };
          delete cmd.connections[key as any];
        }
      });
    });

    return {
      ...event,
      commands: newCommands,
    };
  }

  /**
   * Find a node by ID in the event tree
   */
  findNodeById(event: StudioEvent, nodeId: CommandId): StudioEventCommand | undefined {
    return event.commands[nodeId];
  }

  /**
   * Get all nodes connected to a specific node
   */
  getConnectedNodes(event: StudioEvent, nodeId: CommandId): StudioEventCommand[] {
    const node = this.findNodeById(event, nodeId);
    if (!node) return [];

    const connectedIds = Object.values(node.connections).map((conn) => conn.target);
    return connectedIds.map((id) => this.findNodeById(event, id)).filter((n) => n !== undefined) as StudioEventCommand[];
  }

  /**
   * Get all nodes that connect TO a specific node
   */
  getIncomingConnections(event: StudioEvent, nodeId: CommandId): StudioEventCommand[] {
    return Object.values(event.commands).filter((cmd) => {
      return Object.values(cmd.connections).some((conn) => conn.target === nodeId);
    });
  }

  /**
   * Duplicate a node and optionally its connections
   */
  duplicateNode(event: StudioEvent, nodeId: CommandId, includeConnections = true): { event: StudioEvent; newNodeId: CommandId } {
    const sourceNode = this.findNodeById(event, nodeId);
    if (!sourceNode) {
      throw new Error(`Node not found: ${nodeId}`);
    }

    const newNodeId = this.generateCommandId();
    const newNode: StudioEventCommand = {
      ...sourceNode,
      connections: includeConnections
        ? { ...sourceNode.connections }
        : {},
      studioData: {
        ...sourceNode.studioData,
        comments: [...sourceNode.studioData.comments],
        x: sourceNode.studioData.x + 50,
        y: sourceNode.studioData.y + 50,
      },
    };

    return {
      event: {
        ...event,
        commands: {
          ...event.commands,
          [newNodeId]: newNode,
        },
      },
      newNodeId: newNodeId as CommandId,
    };
  }

  /**
   * Move a node to a new position (update studioData)
   */
  moveNode(event: StudioEvent, nodeId: CommandId, x: number, y: number): StudioEvent {
    const node = this.findNodeById(event, nodeId);
    if (!node) {
      throw new Error(`Node not found: ${nodeId}`);
    }

    const updatedNode = {
      ...node,
      studioData: {
        ...node.studioData,
        x,
        y,
      },
    };

    return {
      ...event,
      commands: {
        ...event.commands,
        [nodeId]: updatedNode,
      },
    };
  }

  /**
   * Add a comment to a node
   */
  addComment(event: StudioEvent, nodeId: CommandId, comment: string): StudioEvent {
    const node = this.findNodeById(event, nodeId);
    if (!node) {
      throw new Error(`Node not found: ${nodeId}`);
    }

    const updatedNode = {
      ...node,
      studioData: {
        ...node.studioData,
        comments: [...node.studioData.comments, comment],
      },
    };

    return {
      ...event,
      commands: {
        ...event.commands,
        [nodeId]: updatedNode,
      },
    };
  }

  /**
   * Remove a comment from a node
   */
  removeComment(event: StudioEvent, nodeId: CommandId, commentIndex: number): StudioEvent {
    const node = this.findNodeById(event, nodeId);
    if (!node) {
      throw new Error(`Node not found: ${nodeId}`);
    }

    const updatedNode = {
      ...node,
      studioData: {
        ...node.studioData,
        comments: node.studioData.comments.filter((_, i) => i !== commentIndex),
      },
    };

    return {
      ...event,
      commands: {
        ...event.commands,
        [nodeId]: updatedNode,
      },
    };
  }

  /**
   * Create a connection between two nodes
   */
  createConnection(
    event: StudioEvent,
    sourceId: CommandId,
    targetId: CommandId,
    sourceHandle: string,
    targetHandle: string
  ): StudioEvent {
    const sourceNode = this.findNodeById(event, sourceId);
    const targetNode = this.findNodeById(event, targetId);

    if (!sourceNode || !targetNode) {
      throw new Error('Source or target node not found');
    }

    const connectionId = this.generateConnectionId();
    const updatedNode = {
      ...sourceNode,
      connections: {
        ...sourceNode.connections,
        [connectionId]: {
          sourceHandle,
          target: targetId,
          targetHandle,
        },
      },
    };

    return {
      ...event,
      commands: {
        ...event.commands,
        [sourceId]: updatedNode,
      },
    };
  }

  /**
   * Remove a connection between nodes
   */
  removeConnection(event: StudioEvent, sourceId: CommandId, connectionId: string): StudioEvent {
    const sourceNode = this.findNodeById(event, sourceId);
    if (!sourceNode) {
      throw new Error(`Node not found: ${sourceId}`);
    }

    const { [connectionId]: _removed, ...newConnections } = sourceNode.connections;
    const updatedNode = {
      ...sourceNode,
      connections: newConnections,
    };

    return {
      ...event,
      commands: {
        ...event.commands,
        [sourceId]: updatedNode,
      },
    };
  }

  /**
   * Validate the entire event tree for issues
   */
  validateTree(event: StudioEvent): TreeValidationResult {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    // Check each command
    Object.entries(event.commands).forEach(([nodeId, command]) => {
      const commandId = nodeId as CommandId;

      // Validate command type
      const metadata = getCommandMetadata(command.type);
      if (!metadata) {
        errors.push({
          nodeId: commandId,
          commandType: command.type,
          message: `Unknown command type: ${command.type}`,
        });
        return;
      }

      // Validate connections
      Object.entries(command.connections).forEach(([connId, conn]) => {
        if (!event.commands[conn.target]) {
          errors.push({
            nodeId: commandId,
            commandType: command.type,
            message: `Connection target node not found: ${conn.target}`,
          });
        }
      });

      // Warn about unconnected nodes
      if (Object.keys(command.connections).length === 0 && nodeId !== event.triggers[0]?.commandId) {
        warnings.push(`Node ${nodeId} (${command.type}) is not connected to any other node`);
      }
    });

    // Check triggers
    event.triggers.forEach((trigger, index) => {
      if (!event.commands[trigger.commandId]) {
        errors.push({
          nodeId: trigger.commandId,
          commandType: 'unknown',
          message: `Trigger ${index} references non-existent node: ${trigger.commandId}`,
        });
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Get statistics about the event tree
   */
  getTreeStats(event: StudioEvent): {
    totalNodes: number;
    nodesByType: Record<string, number>;
    totalConnections: number;
    maxDepth: number;
  } {
    const nodesByType: Record<string, number> = {};
    let totalConnections = 0;

    Object.values(event.commands).forEach((cmd) => {
      nodesByType[cmd.type] = (nodesByType[cmd.type] ?? 0) + 1;
      totalConnections += Object.keys(cmd.connections).length;
    });

    // Calculate max depth (simple BFS from each trigger)
    let maxDepth = 0;
    event.triggers.forEach((trigger) => {
      const depth = this.calculateDepth(event, trigger.commandId);
      if (depth > maxDepth) maxDepth = depth;
    });

    return {
      totalNodes: Object.keys(event.commands).length,
      nodesByType,
      totalConnections,
      maxDepth,
    };
  }

  private calculateDepth(event: StudioEvent, nodeId: CommandId, visited = new Set<string>()): number {
    if (visited.has(nodeId)) return 0; // Avoid cycles
    visited.add(nodeId);

    const node = event.commands[nodeId];
    if (!node || Object.keys(node.connections).length === 0) return 1;

    const connectedDepths = Object.values(node.connections).map((conn) =>
      this.calculateDepth(event, conn.target, new Set(visited))
    );

    return 1 + Math.max(...connectedDepths, 0);
  }

  private generateCommandId(): CommandId {
    // Using crypto.randomUUID() available in Electron/Chromium environments
    return crypto.randomUUID() as unknown as CommandId;
  }

  private generateConnectionId(): string {
    return crypto.randomUUID();
  }
}
