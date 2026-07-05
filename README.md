# OpenCode + MCP for Jira and Confluence

This workspace is preconfigured to use the Atlassian MCP server through OpenCode.

## What is configured

The OpenCode config in [opencode.json](opencode.json) enables a remote MCP server named `atlassian` that points to:

- https://mcp.atlassian.com/v1/mcp

That server can be used from OpenCode to interact with Jira and Confluence resources.

## Prerequisites

1. Install OpenCode and ensure it can read the workspace config.
2. Sign in to Atlassian from the MCP server flow when prompted.
3. Make sure your environment can reach the remote MCP endpoint.

## Verify the setup

Run:

```bash
npm run verify
```

Expected output:

```text
OpenCode MCP config ok: https://mcp.atlassian.com/v1/mcp
```

## Next steps

- Open your OpenCode client in this workspace.
- Ask it to inspect Jira issues or Confluence pages through the configured MCP server.
- If you need a private/self-hosted MCP server instead of the remote Atlassian endpoint, replace the URL in [opencode.json](opencode.json) with your own server endpoint.
