# mcp-store-scraper

MCP server that exposes Google Play and Apple App Store scraping as tools.

## Usage

Add to your MCP client config (e.g. `~/.kiro/settings/mcp.json`):

```json
{
  "mcpServers": {
    "store-scraper": {
      "command": "npx",
      "args": ["-y", "mcp-store-scraper"],
      "disabled": false,
      "autoApprove": [
        "gplay_app", "gplay_search", "gplay_reviews", "gplay_similar",
        "appstore_app", "appstore_search", "appstore_reviews", "appstore_similar"
      ]
    }
  }
}
```

## Tools

### Google Play

| Tool | Description |
|---|---|
| `gplay_app` | Get app details by package name |
| `gplay_search` | Search apps |
| `gplay_reviews` | Get app reviews |
| `gplay_similar` | Get similar apps |

### App Store

| Tool | Description |
|---|---|
| `appstore_app` | Get app details by bundle ID or numeric ID |
| `appstore_search` | Search apps |
| `appstore_reviews` | Get app reviews |
| `appstore_similar` | Get similar apps |
