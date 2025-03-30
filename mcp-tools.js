/**
 * MCP Tools for Concept Activation Network
 * 
 * Implements the Model Context Protocol interface for the CAN system,
 * defining resources and tools that enable AI systems to interact with
 * the concept network.
 */

import { z } from 'zod';

/**
 * Register all MCP resources and tools for the CAN server
 * @param {Object} server MCP server instance
 * @param {SessionManager} sessionManager Session manager instance
 */
export function registerMCPTools(server, sessionManager) {
  // Register session management tools
  registerSessionTools(server, sessionManager);
  
  // Register concept management tools
  registerConceptTools(server, sessionManager);
  
  // Register activation tools
  registerActivationTools(server, sessionManager);
  
  // Register analysis tools
  registerAnalysisTools(server, sessionManager);
}

/**
 * Register session management tools
 * @param {Object} server MCP server instance
 * @param {SessionManager} sessionManager Session manager instance
 */
function registerSessionTools(server, sessionManager) {
  // Create session tool
  server.tool('create_session', {
    name: z.string().optional(),
    defaultConcepts: z.record(z.any()).optional()
  }, 
  async ({ name, defaultConcepts }) => {
    const result = sessionManager.createSession({ name, defaultConcepts });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result)
        }
      ]
    };
  });
  
  // Get all sessions tool
  server.tool('get_all_sessions', {}, 
  async () => {
    const result = sessionManager.getAllSessions();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result)
        }
      ]
    };
  });
  
  // Delete session tool
  server.tool('delete_session', {
    sessionId: z.string()
  }, 
  async ({ sessionId }) => {
    const deleted = sessionManager.deleteSession(sessionId);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: deleted,
            message: deleted ? 'Session deleted' : 'Session not found'
          })
        }
      ]
    };
  });
}

/**
 * Register concept management tools
 * @param {Object} server MCP server instance
 * @param {SessionManager} sessionManager Session manager instance
 */
function registerConceptTools(server, sessionManager) {
  // Add concept tool
  server.tool('add_concept', {
    sessionId: z.string(),
    label: z.string(),
    category: z.string().optional(),
    id: z.string().optional()
  }, 
  async ({ sessionId, label, category, id }) => {
    const network = sessionManager.getNetwork(sessionId);
    const conceptId = network.addConcept(label, category, id);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(network.getConcept(conceptId).toJSON())
        }
      ]
    };
  });
  
  // Remove concept tool
  server.tool('remove_concept', {
    sessionId: z.string(),
    conceptId: z.string()
  }, 
  async ({ sessionId, conceptId }) => {
    const network = sessionManager.getNetwork(sessionId);
    const removed = network.removeConcept(conceptId);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: removed,
            message: removed ? 'Concept removed' : 'Concept not found'
          })
        }
      ]
    };
  });
  
  // Add connection tool
  server.tool('add_connection', {
    sessionId: z.string(),
    sourceId: z.string(),
    targetId: z.string(),
    weight: z.number().default(0.5),
    bidirectional: z.boolean().default(true)
  }, 
  async ({ sessionId, sourceId, targetId, weight, bidirectional }) => {
    const network = sessionManager.getNetwork(sessionId);
    network.addConnection(sourceId, targetId, weight, bidirectional);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            sourceId,
            targetId,
            weight,
            bidirectional
          })
        }
      ]
    };
  });
  
  // Remove connection tool
  server.tool('remove_connection', {
    sessionId: z.string(),
    sourceId: z.string(),
    targetId: z.string(),
    bidirectional: z.boolean().default(true)
  }, 
  async ({ sessionId, sourceId, targetId, bidirectional }) => {
    const network = sessionManager.getNetwork(sessionId);
    const removed = network.removeConnection(sourceId, targetId, bidirectional);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: removed,
            message: removed ? 'Connection removed' : 'Connection not found'
          })
        }
      ]
    };
  });
}

/**
 * Register activation tools
 * @param {Object} server MCP server instance
 * @param {SessionManager} sessionManager Session manager instance
 */
function registerActivationTools(server, sessionManager) {
  // Set parameters tool
  server.tool('set_parameters', {
    sessionId: z.string(),
    activationThreshold: z.number().default(0.7),
    decayRate: z.number().default(0.1),
    maxIterations: z.number().default(5),
    convergenceThreshold: z.number().default(0.01)
  }, 
  async ({ sessionId, activationThreshold, decayRate, maxIterations, convergenceThreshold }) => {
    const network = sessionManager.getNetwork(sessionId);
    const params = {};
    if (activationThreshold !== undefined) params.activationThreshold = activationThreshold;
    if (decayRate !== undefined) params.decayRate = decayRate;
    if (maxIterations !== undefined) params.maxIterations = maxIterations;
    if (convergenceThreshold !== undefined) params.convergenceThreshold = convergenceThreshold;
    
    network.setParameters(params);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            parameters: network.params
          })
        }
      ]
    };
  });
  
  // Set initial activation tool
  server.tool('set_initial_activation', {
    sessionId: z.string(),
    conceptIds: z.array(z.string()),
    activationValue: z.number().default(1.0)
  }, 
  async ({ sessionId, conceptIds, activationValue }) => {
    const network = sessionManager.getNetwork(sessionId);
    network.setInitialActivation(conceptIds, activationValue);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            activatedCount: conceptIds.length
          })
        }
      ]
    };
  });
  
  // Run activation iteration tool
  server.tool('run_activation_iteration', {
    sessionId: z.string(),
    decayRate: z.number().optional()
  }, 
  async ({ sessionId, decayRate }) => {
    const network = sessionManager.getNetwork(sessionId);
    const result = network.spreadActivation(decayRate);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            ...result,
            topActivatedConcepts: network.getTopActivatedConcepts(5)
          })
        }
      ]
    };
  });
  
  // Run until convergence tool
  server.tool('run_until_convergence', {
    sessionId: z.string(),
    maxIterations: z.number().optional(),
    convergenceThreshold: z.number().optional(),
    decayRate: z.number().optional()
  }, 
  async ({ sessionId, maxIterations, convergenceThreshold, decayRate }) => {
    const network = sessionManager.getNetwork(sessionId);
    
    const options = {};
    if (maxIterations !== undefined) options.maxIterations = maxIterations;
    if (convergenceThreshold !== undefined) options.convergenceThreshold = convergenceThreshold;
    if (decayRate !== undefined) options.decayRate = decayRate;
    
    const result = network.runUntilConvergence(options);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            ...result,
            topActivatedConcepts: network.getTopActivatedConcepts(5)
          })
        }
      ]
    };
  });
}

/**
 * Register analysis tools
 * @param {Object} server MCP server instance
 * @param {SessionManager} sessionManager Session manager instance
 */
function registerAnalysisTools(server, sessionManager) {
  // Get top activated concepts tool
  server.tool('get_top_activated_concepts', {
    sessionId: z.string(),
    limit: z.number().default(10),
    threshold: z.number().optional()
  }, 
  async ({ sessionId, limit, threshold }) => {
    const network = sessionManager.getNetwork(sessionId);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(network.getTopActivatedConcepts(limit, threshold))
        }
      ]
    };
  });
  
  // Identify emergent patterns tool
  server.tool('identify_emergent_patterns', {
    sessionId: z.string(),
    threshold: z.number().optional()
  }, 
  async ({ sessionId, threshold }) => {
    const network = sessionManager.getNetwork(sessionId);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(network.identifyEmergentPatterns(threshold))
        }
      ]
    };
  });
  
  // Generate summary tool
  server.tool('generate_summary', {
    sessionId: z.string()
  }, 
  async ({ sessionId }) => {
    const network = sessionManager.getNetwork(sessionId);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(network.generateSummary())
        }
      ]
    };
  });
  
  // Get activation history tool
  server.tool('get_activation_history', {
    sessionId: z.string(),
    startIteration: z.number().default(0),
    limit: z.number().default(10)
  }, 
  async ({ sessionId, startIteration, limit }) => {
    const network = sessionManager.getNetwork(sessionId);
    const history = network.activationHistory;
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(history.slice(startIteration, startIteration + limit))
        }
      ]
    };
  });
}
