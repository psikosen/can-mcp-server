# Concept Activation Network (CAN) MCP Server

The Concept Activation Network (CAN) MCP Server implements a parallel, associative thinking approach using the Model Context Protocol (MCP). Unlike sequential thinking approaches, CAN operates on a network of interconnected concepts with activation spreading in parallel through the network until a coherent pattern or solution emerges.

## Key Concepts

### Parallel Concept Activation

Traditional AI reasoning often relies on sequential, step-by-step thinking processes. CAN takes a fundamentally different approach:

1. **Network Structure**: Knowledge is represented as a network of interconnected concepts
2. **Parallel Activation**: When prompted, activation energy spreads simultaneously through multiple pathways
3. **Emergent Patterns**: Solutions emerge as stable patterns of highly activated, related concepts
4. **Non-Linear Exploration**: Multiple conceptual paths are explored simultaneously

This approach is inspired by theories of human cognition suggesting that we often think by association rather than pure sequential logic.

### Core Components

The CAN system consists of:

1. **Concept Nodes**: Individual units representing concepts, ideas, or elements
2. **Weighted Connections**: Links between concepts with varying strengths
3. **Activation Dynamics**: Algorithms controlling how activation spreads through the network
4. **Pattern Detection**: Methods for identifying emergent structures of activated concepts

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/can-mcp-server.git
cd can-mcp-server

# Install dependencies
npm install

# Start the server
npm start
```

## Configuration in Claude Desktop

To use the CAN MCP Server with Claude Desktop, add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "can": {
      "command": "node",
      "args": ["/Users/raymondgonzalez/Documents/can-mcp-server/can-server.js"]
    }
  }
}
```

## MCP Tools

The CAN MCP Server provides the following tools:

### Session Management
- `create_session`: Create a new CAN session
- `get_all_sessions`: List all active sessions
- `delete_session`: Delete a session

### Concept Management
- `add_concept`: Add a concept to the network
- `remove_concept`: Remove a concept from the network
- `add_connection`: Create a connection between concepts
- `remove_connection`: Remove a connection between concepts

### Activation Process
- `set_parameters`: Configure activation parameters
- `set_initial_activation`: Set starting activation values for concepts
- `run_activation_iteration`: Run a single iteration of activation spreading
- `run_until_convergence`: Run multiple iterations until convergence

### Analysis
- `get_top_activated_concepts`: Retrieve the most activated concepts
- `identify_emergent_patterns`: Find clusters of related activated concepts
- `generate_summary`: Create a comprehensive summary of the process
- `get_activation_history`: Retrieve the history of activation states

## Usage Example

Here's a basic usage flow for CAN-based thinking:

1. **Create a Session**: Initialize a new concept network
2. **Add Concepts**: Define the key concepts relevant to the problem
3. **Create Connections**: Establish relationships between related concepts
4. **Configure Parameters**: Set activation threshold, decay rate, etc.
5. **Set Initial Activation**: Activate concepts corresponding to the query
6. **Run Activation Process**: Let activation spread until convergence
7. **Identify Patterns**: Find emergent patterns representing potential solutions
8. **Generate Response**: Synthesize a response based on the emergent patterns

## Using CAN with Claude

When using CAN with Claude, you can structure your prompts following this pattern:

```
SYSTEM: You are operating as a Concept Activation Network. Instead of thinking sequentially, 
you will simulate parallel concept activation bursts across your knowledge graph.

ACTIVATION PARAMETERS:
- Initial concepts: [key concepts from the query]
- Activation threshold: [0.7] 
- Max iterations: [5]
- Convergence criteria: [activation change < 0.1]

PROCESS:
1. PROJECT: Map the query to initial concept nodes
2. BURST: Simulate parallel activation spreading (5 most activated concepts per iteration)
3. CONVERGE: Identify emergent patterns and resonances
4. INTEGRATE: Synthesize the stable activation pattern into a coherent response

Begin by identifying the core concepts in the query, then simulate how activation would spread 
through your knowledge graph. Report the most strongly activated concept clusters after 
convergence before providing your final answer.
```

This instructs Claude to use the CAN MCP Server as its thinking methodology, resulting in responses that emerge from parallel concept activation rather than linear reasoning.

## When to Use CAN vs. Sequential Thinking

CAN is particularly effective for:

- **Creative Challenges**: When innovative connections are valuable
- **Associative Problems**: Tasks requiring linking disparate concepts
- **Multi-perspective Analysis**: When multiple viewpoints should be considered
- **Complex Pattern Recognition**: Identifying non-obvious relationships
- **Intuitive Reasoning**: Problems where structured logic is less effective

Sequential thinking may be better for:

- **Logical Deduction**: Step-by-step reasoning tasks
- **Procedural Problems**: Well-defined processes with clear steps
- **Mathematical Reasoning**: Formal proofs and calculations
- **Linear Narratives**: Creating sequential stories or explanations

## Contributing

Contributions to improve the CAN MCP Server are welcome! Please submit a pull request or open an issue to discuss potential improvements.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
