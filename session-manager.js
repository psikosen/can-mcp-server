/**
 * Concept Activation Network Session Manager
 * 
 * Manages active CAN sessions and their associated concept networks.
 * Handles session creation, retrieval, and cleanup.
 */

import { v4 as uuidv4 } from 'uuid';
import { ConceptNetwork } from './concept-network.js';

export class SessionManager {
  constructor() {
    this.sessions = new Map();
    
    // Session cleanup interval (check for expired sessions every hour)
    setInterval(() => this.cleanupSessions(), 60 * 60 * 1000);
  }

  /**
   * Create a new CAN session
   * @param {Object} config Configuration options for the session
   * @param {string} config.name Optional name for the session
   * @param {Object} config.defaultConcepts Optional default concepts to include
   * @returns {Object} Session information including ID
   */
  createSession({ name = null, defaultConcepts = null }) {
    const sessionId = uuidv4();
    const sessionName = name || `can-session-${sessionId.substring(0, 8)}`;
    
    // Create new concept network
    const network = new ConceptNetwork();
    
    // Optionally initialize with default concepts
    if (defaultConcepts) {
      for (const [conceptId, conceptData] of Object.entries(defaultConcepts)) {
        network.addConcept(conceptData.label, conceptData.category, conceptId);
        
        // Add connections if specified
        if (conceptData.connections) {
          for (const connection of conceptData.connections) {
            network.addConnection(
              conceptId, 
              connection.targetId, 
              connection.weight
            );
          }
        }
      }
    }
    
    const session = {
      id: sessionId,
      name: sessionName,
      network,
      createdAt: new Date(),
      lastAccessed: new Date()
    };
    
    this.sessions.set(sessionId, session);
    
    return {
      sessionId,
      name: sessionName,
      networkSize: network.getNetworkSize(),
      createdAt: session.createdAt
    };
  }

  /**
   * Get a session by its ID
   * @param {string} sessionId The session identifier
   * @returns {Object} The session object
   * @throws {Error} If session not found
   */
  getSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }
    
    // Update last accessed timestamp
    session.lastAccessed = new Date();
    
    return session;
  }

  /**
   * Get the concept network for a session
   * @param {string} sessionId The session identifier
   * @returns {ConceptNetwork} The concept network
   * @throws {Error} If session not found
   */
  getNetwork(sessionId) {
    const session = this.getSession(sessionId);
    return session.network;
  }

  /**
   * Delete a session
   * @param {string} sessionId The session identifier
   * @returns {boolean} True if session was deleted, false if it wasn't found
   */
  deleteSession(sessionId) {
    return this.sessions.delete(sessionId);
  }

  /**
   * Get all active sessions
   * @returns {Array} Array of session info objects
   */
  getAllSessions() {
    return Array.from(this.sessions.entries()).map(([id, session]) => ({
      sessionId: id,
      name: session.name,
      createdAt: session.createdAt,
      lastAccessed: session.lastAccessed,
      networkSize: session.network.getNetworkSize()
    }));
  }

  /**
   * Clean up old sessions that haven't been accessed in a while
   * @param {number} maxAgeMs Maximum session age in milliseconds
   * @returns {number} Number of sessions cleaned up
   */
  cleanupSessions(maxAgeMs = 24 * 60 * 60 * 1000) { // Default: 24 hours
    const now = new Date();
    let cleanedCount = 0;
    
    for (const [id, session] of this.sessions.entries()) {
      const age = now - session.lastAccessed;
      if (age > maxAgeMs) {
        this.sessions.delete(id);
        cleanedCount++;
      }
    }
    
    return cleanedCount;
  }
}
