---
title: MCP Server Setup
eleventyNavigation:
    key: mcp server
    parent: use eslint
    title: MCP Server Setup
    order: 5
---

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) is an open standard that enables AI models to interact with external tools and services through a unified interface. The ESLint CLI contains an MCP server that you can register with your code editor to allow LLMs to use ESLint directly.

## Setting Up ESLint MCP Server in VS Code

To use MCP servers in VS Code, you must have the [Copilot Chat](https://code.visualstudio.com/docs/copilot/copilot-chat) extension installed. After that, follow these steps so add the ESLint MCP server:

### 1. Create MCP Configuration File

Create a `.vscode/mcp.json` file in your project with the following configuration:

```json
{
	"servers": {
		"ESLint": {
			"type": "stdio",
			"command": "npx",
			"args": ["eslint", "--mcp"]
		}
	}
}
```

Alternatively, you can use the Command Palette:

1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)
2. Type and select `MCP: Add Server`
3. Select `Command (stdio)` from the dropdown
4. Enter `npx eslint --mcp` as the command
5. Type `ESLint` as the server ID
6. Choose `Workspace Settings` to create the configuration in `.vscode/mcp.json`

### 2. Enable MCP Server in User Settings (Optional)

If you want to use the ESLint MCP server across all workspaces, you can follow the previous steps and choose `User Settings` instead of `Workspace Settings` to add the MCP server to your `settings.json` file.

## Setting Up ESLint MCP Server in Cursor

To configure the ESLint MCP server in [Cursor](https://cursor.com), follow these steps:

### 1. Create MCP Configuration File

Create a `.cursor/mcp.json` file in your project directory with the following configuration:

```json
{
	"mcpServers": {
		"eslint": {
			"command": "npx",
			"args": ["eslint", "--mcp"],
			"env": {}
		}
	}
}
```

### 2. Global Configuration (Optional)

If you want to use the ESLint MCP server across all your Cursor workspaces, create a `~/.cursor/mcp.json` file in your home directory with the same configuration.

### 3. Verify Tool Availability

Once configured, the ESLint MCP server should appear in the "Available Tools" section on the MCP settings page in Cursor.

## Using the ESLint MCP Server with GitHub Copilot

Once your MCP server is configured, you can use it with [GitHub Copilot's agent mode](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode):

1. Open the Copilot Chat view in VS Code
2. Ensure agent mode is enabled (look for the agent icon in the chat input)
3. Toggle on the ESLint MCP server tools using the "Tools" button in the chat view
4. Ask Copilot to perform ESLint tasks, such as:
    - "Check this file for linting errors"
    - "Fix all ESLint issues in the current file"
    - "Show me what ESLint rules are being violated"

## Troubleshooting

If you encounter issues with the ESLint MCP server:

1. Check the MCP server status by running `MCP: List Servers` from the Command Palette
2. Select the ESLint server and choose `Show Output` to view server logs
3. Ensure that ESLint is installed in your project or globally
4. Verify that your MCP configuration is correct

## Example Prompts

Here are some prompts you can use to run ESLint with Copilot:

```text
Lint the current file and explain any issues found

Lint and fix #file:index.js
```

## Additional Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/introduction)
- [VS Code MCP Servers Documentation](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)
- [GitHub Copilot in VS Code Documentation](https://code.visualstudio.com/docs/copilot/copilot-chat)
- [Model Context Protocol in Cursor documentation](https://docs.cursor.com/context/model-context-protocol)
