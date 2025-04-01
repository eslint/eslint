---
title: MCP Server Setup
eleventyNavigation:
    key: mcp server
    parent: use eslint
    title: MCP Server Setup
    order: 5
---

Model Context Protocol (MCP) is an open standard that enables AI models to interact with external tools and services through a unified interface. When using GitHub Copilot in VS Code, you can connect ESLint as an MCP server to enhance your coding workflow with ESLint-specific capabilities.

## Setting Up ESLint MCP Server in VS Code

To add the ESLint MCP server to your VS Code workspace, follow these steps:

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
3. Choose `Workspace Settings` to create or modify the `.vscode/mcp.json` file
4. Enter the server information as shown above

### 2. Enable MCP Server in User Settings (Optional)

If you want to use the ESLint MCP server across all workspaces:

1. Open the Command Palette and run `MCP: Add Server`
2. Choose `User Settings` instead of `Workspace Settings`
3. Enter the same server configuration as above

## Using the ESLint MCP Server with GitHub Copilot

Once your MCP server is configured, you can use it with GitHub Copilot's agent mode:

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

## Example Interaction

Here's an example of how you might interact with the ESLint MCP server through Copilot:

```text
You: Lint the current file and explain any issues found
Copilot: I'll run ESLint on the current file...

[Copilot shows ESLint results with explanations of each issue]
```

## Additional Resources

- [Model Context Protocol Documentation](https://github.com/microsoft/mcp)
- [VS Code MCP Servers Documentation](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)
- [GitHub Copilot in VS Code Documentation](https://code.visualstudio.com/docs/copilot/copilot-chat)
