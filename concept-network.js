/**
 * Concept Network Implementation
 * 
 * Core implementation of the Concept Activation Network, handling:
 * - Concept nodes and connections
 * - Activation spreading algorithms
 * - Pattern detection and emergence
 * - Network dynamics and convergence
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Represents a single concept in the network
 */
class ConceptNode {
  /**
   * Create a new concept node
   * @param {string} id Unique identifier for the concept
   * @param {string} label Human-readable label
   * @param {string} category Optional category for grouping
   */
  constructor(id, label, category = null) {
    this.id = id;
    this.label = label;
    this.category = category;
    this.connections = new Map(); // Map of target node IDs to edge weights
    this.activation = 0.0;
    this.prevActivation = 0.0;
    this.metadata = {};
  }

  /**
   * Add a connection to another concept
   * @param {string} targetId Target concept ID
   * @param {number} weight Connection weight (0.0 to 1.0)
   */
  addConnection(targetId, weight) {
    this.connections.set(targetId, weight);
  }

  /**
   * Remove a connection to another concept
   * @param {string} targetId Target concept ID
   * @returns {boolean} True if connection was removed
   */
  removeConnection(targetId) {
    return this.connections.delete(targetId);
  }

  /**
   * Update the activation value of this concept
   * @param {number} newValue New activation value
   */
  updateActivation(newValue) {
    this.prevActivation = this.activation;
    this.activation = newValue;
  }

  /**
   * Get the activation change from the previous value
   * @returns {number} Absolute change in activation
   */
  getActivationDelta() {
    return Math.abs(this.activation - this.prevActivation);
  }

  /**
   * Get serializable representation
   * @returns {Object} JSON representation
   */
  toJSON() {
    return {
      id: this.id,
      label: this.label,
      category: this.category,
      activation: this.activation,
      connectionCount: this.connections.size,
      metadata: this.metadata
    };
  }
}

/**
 * Main Concept Activation Network implementation
 */
export class ConceptNetwork {
  constructor() {
    this.nodes = new Map(); // Map of concept ID to ConceptNode
    this.activationHistory = []; // History of activation states
    this.iterationCount = 0;
    
    // Default parameters
    this.params = {
      activationThreshold: 0.7,
      decayRate: 0.1,
      maxIterations: 5,
      convergenceThreshold: 0.01
    };
  }

  /**
   * Add a new concept to the network
   * @param {string} label Human-readable label for the concept
   * @param {string} category Optional category for grouping
   * @param {string} id Optional ID (generated if not provided)
   * @returns {string} Concept ID
   */
  addConcept(label, category = null, id = null) {
    const conceptId = id || uuidv4();
    
    // Check for existing concept with same ID
    if (this.nodes.has(conceptId)) {
      throw new Error(`Concept with ID ${conceptId} already exists`);
    }
    
    const node = new ConceptNode(conceptId, label, category);
    this.nodes.set(conceptId, node);
    
    return conceptId;
  }

  /**
   * Remove a concept from the network
   * @param {string} conceptId Concept ID to remove
   * @returns {boolean} True if concept was removed
   */
  removeConcept(conceptId) {
    if (!this.nodes.has(conceptId)) {
      return false;
    }
    
    // Remove all connections to this concept
    for (const node of this.nodes.values()) {
      node.removeConnection(conceptId);
    }
    
    // Remove the concept
    return this.nodes.delete(conceptId);
  }

  /**
   * Get a concept by ID
   * @param {string} conceptId Concept ID
   * @returns {ConceptNode} The concept node
   */
  getConcept(conceptId) {
    const node = this.nodes.get(conceptId);
    if (!node) {
      throw new Error(`Concept ${conceptId} not found`);
    }
    return node;
  }

  /**
   * Add a connection between two concepts
   * @param {string} sourceId Source concept ID
   * @param {string} targetId Target concept ID
   * @param {number} weight Connection weight (0.0 to 1.0)
   * @param {boolean} bidirectional Whether to create connections in both directions
   */
  addConnection(sourceId, targetId, weight = 0.5, bidirectional = true) {
    // Validate weight
    const safeWeight = Math.max(0, Math.min(1, weight));
    
    // Get source and target nodes
    const sourceNode = this.getConcept(sourceId);
    const targetNode = this.getConcept(targetId);
    
    // Add connection
    sourceNode.addConnection(targetId, safeWeight);
    
    // Add bidirectional connection if requested
    if (bidirectional) {
      targetNode.addConnection(sourceId, safeWeight);
    }
  }

  /**
   * Remove a connection between concepts
   * @param {string} sourceId Source concept ID
   * @param {string} targetId Target concept ID
   * @param {boolean} bidirectional Whether to remove connections in both directions
   * @returns {boolean} True if connection was removed
   */
  removeConnection(sourceId, targetId, bidirectional = true) {
    let success = false;
    
    // Get source node
    if (this.nodes.has(sourceId)) {
      success = this.nodes.get(sourceId).removeConnection(targetId);
    }
    
    // Remove bidirectional connection if requested
    if (bidirectional && this.nodes.has(targetId)) {
      this.nodes.get(targetId).removeConnection(sourceId);
    }
    
    return success;
  }

  /**
   * Get network size information
   * @returns {Object} Size information
   */
  getNetworkSize() {
    return {
      conceptCount: this.nodes.size,
      connectionCount: Array.from(this.nodes.values())
        .reduce((sum, node) => sum + node.connections.size, 0)
    };
  }

  /**
   * Set parameters for the activation algorithm
   * @param {Object} params Parameter values
   */
  setParameters(params = {}) {
    this.params = {
      ...this.params,
      ...params
    };
  }

  /**
   * Set initial activation for specific concepts
   * @param {Array<string>|Object} concepts Concept IDs to activate or map of IDs to activation values
   * @param {number} activationValue Activation value (0.0 to 1.0) if using array input
   */
  setInitialActivation(concepts, activationValue = 1.0) {
    // Reset all activations
    for (const node of this.nodes.values()) {
      node.updateActivation(0.0);
    }
    
    // Handle different input formats
    if (Array.isArray(concepts)) {
      // Array of concept IDs with uniform activation
      for (const id of concepts) {
        if (this.nodes.has(id)) {
          this.nodes.get(id).updateActivation(activationValue);
        }
      }
    } else if (typeof concepts === 'object') {
      // Map of concept IDs to activation values
      for (const [id, activation] of Object.entries(concepts)) {
        if (this.nodes.has(id)) {
          this.nodes.get(id).updateActivation(activation);
        }
      }
    }
    
    // Reset history and record initial state
    this.activationHistory = [];
    this.iterationCount = 0;
    this.recordActivationState();
  }

  /**
   * Record the current activation state
   * @private
   */
  recordActivationState() {
    // Create a snapshot of current activation values
    const snapshot = Array.from(this.nodes.entries()).map(([id, node]) => ({
      id,
      label: node.label,
      activation: node.activation,
      category: node.category
    }));
    
    this.activationHistory.push({
      iteration: this.iterationCount,
      timestamp: new Date(),
      activations: snapshot
    });
    
    this.iterationCount++;
  }

  /**
   * Run a single iteration of parallel activation spreading
   * @param {number} decayRate Rate at which activation decays (0.0 to 1.0)
   * @returns {Object} Information about the iteration
   */
  spreadActivation(decayRate = null) {
    // Use parameter from config if not specified
    const actualDecayRate = decayRate !== null ? decayRate : this.params.decayRate;
    
    // Calculate new activation values for all nodes simultaneously
    const newActivations = new Map();
    
    for (const [nodeId, node] of this.nodes.entries()) {
      let incomingActivation = 0;
      
      // Sum activation from connected nodes
      for (const [connectedId, weight] of node.connections.entries()) {
        if (this.nodes.has(connectedId)) {
          const connectedNode = this.nodes.get(connectedId);
          incomingActivation += connectedNode.activation * weight;
        }
      }
      
      // Apply decay to current activation
      const decayedActivation = node.activation * (1 - actualDecayRate);
      
      // Calculate new activation (sigmoid function to keep in range [0,1])
      const newActivation = this.sigmoid(decayedActivation + incomingActivation);
      newActivations.set(nodeId, newActivation);
    }
    
    // Update all node activations
    for (const [nodeId, newActivation] of newActivations.entries()) {
      this.nodes.get(nodeId).updateActivation(newActivation);
    }
    
    // Calculate total activation change
    const totalDelta = Array.from(this.nodes.values())
      .reduce((sum, node) => sum + node.getActivationDelta(), 0);
    
    // Record this activation state
    this.recordActivationState();
    
    return {
      iteration: this.iterationCount - 1,
      totalDelta
    };
  }

  /**
   * Run multiple iterations until convergence or max iterations
   * @param {Object} options Configuration options
   * @returns {Object} Result information
   */
  runUntilConvergence(options = {}) {
    // Merge options with default parameters
    const config = {
      maxIterations: options.maxIterations || this.params.maxIterations,
      convergenceThreshold: options.convergenceThreshold || this.params.convergenceThreshold,
      decayRate: options.decayRate || this.params.decayRate
    };
    
    let iteration = 0;
    let totalDelta = Infinity;
    
    // Run iterations until convergence or max iterations
    while (iteration < config.maxIterations && totalDelta > config.convergenceThreshold) {
      const result = this.spreadActivation(config.decayRate);
      totalDelta = result.totalDelta;
      iteration++;
    }
    
    return {
      converged: totalDelta <= config.convergenceThreshold,
      iterations: iteration,
      finalDelta: totalDelta
    };
  }

  /**
   * Get the most activated concepts
   * @param {number} limit Maximum number of concepts to return
   * @param {number} threshold Minimum activation threshold
   * @returns {Array<Object>} Activated concepts with metadata
   */
  getTopActivatedConcepts(limit = 10, threshold = null) {
    // Use parameter from config if not specified
    const actualThreshold = threshold !== null ? threshold : this.params.activationThreshold;
    
    return Array.from(this.nodes.values())
      .filter(node => node.activation >= actualThreshold)
      .sort((a, b) => b.activation - a.activation)
      .slice(0, limit)
      .map(node => ({
        id: node.id,
        label: node.label,
        activation: node.activation,
        category: node.category
      }));
  }

  /**
   * Identify emergent patterns - clusters of highly activated related concepts
   * @param {number} threshold Activation threshold for including concepts
   * @returns {Array<Object>} Emergent patterns
   */
  identifyEmergentPatterns(threshold = null) {
    // Use parameter from config if not specified
    const actualThreshold = threshold !== null ? threshold : this.params.activationThreshold;
    
    // Get active nodes
    const activeNodes = Array.from(this.nodes.values())
      .filter(node => node.activation >= actualThreshold);
    
    // Simple clustering based on connections between active nodes
    const patterns = [];
    const visited = new Set();
    
    for (const node of activeNodes) {
      if (visited.has(node.id)) continue;
      
      const pattern = [];
      const queue = [node.id];
      
      // Breadth-first search to find connected components
      while (queue.length > 0) {
        const currentId = queue.shift();
        if (visited.has(currentId)) continue;
        
        visited.add(currentId);
        const currentNode = this.nodes.get(currentId);
        
        if (currentNode.activation >= actualThreshold) {
          pattern.push({
            id: currentId,
            label: currentNode.label,
            activation: currentNode.activation,
            category: currentNode.category
          });
          
          // Add connected active nodes to queue
          for (const [connectedId, weight] of currentNode.connections.entries()) {
            if (!visited.has(connectedId) && this.nodes.has(connectedId)) {
              const connectedNode = this.nodes.get(connectedId);
              if (connectedNode.activation >= actualThreshold) {
                queue.push(connectedId);
              }
            }
          }
        }
      }
      
      if (pattern.length > 0) {
        patterns.push({
          patternId: uuidv4(),
          concepts: pattern,
          averageActivation: pattern.reduce((sum, n) => sum + n.activation, 0) / pattern.length
        });
      }
    }
    
    // Sort patterns by average activation
    return patterns.sort((a, b) => b.averageActivation - a.averageActivation);
  }
  
  /**
   * Generate a summary of the activation process
   * @returns {Object} Summary information
   */
  generateSummary() {
    const topConcepts = this.getTopActivatedConcepts(5);
    const patterns = this.identifyEmergentPatterns();
    
    return {
      iterationCount: this.iterationCount,
      topActivatedConcepts: topConcepts,
      emergentPatterns: patterns,
      networkSize: this.getNetworkSize()
    };
  }
  
  /**
   * Sigmoid activation function
   * @param {number} x Input value
   * @returns {number} Output in range [0,1]
   * @private
   */
  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }
}
