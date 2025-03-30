/**
 * Concept Activation Network MCP Server - Main Entry Point
 * 
 * This implements a parallel, associative thinking approach using the Model Context Protocol (MCP).
 * Unlike sequential thinking approaches, CAN operates on a network of interconnected concepts with
 * activation spreading in parallel through the network until a coherent pattern or solution emerges.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';

import { SessionManager } from './session-manager.js';
import { registerMCPTools } from './mcp-tools.js';

// Initialize the MCP server
const server = new McpServer({
  name: "Concept Activation Network",
  version: "1.0.0"
});

// Initialize session manager
const sessionManager = new SessionManager();

// Register all MCP tools
registerMCPTools(server, sessionManager);

// Create an Express app for HTTP endpoints
const app = express();
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    version: '1.0.0',
    protocol: 'Concept Activation Network'
  });
});

// Start the Express server
const PORT = process.env.PORT || 3900;
app.listen(PORT, () => {
  console.log(`CAN MCP Server running on port ${PORT}`);
});

// Start processing MCP requests via stdio
const transport = new StdioServerTransport();
server.connect(transport).catch(error => {
  console.error('Error connecting to transport:', error);
  process.exit(1);
});

// Export for testing
export { server, sessionManager };
