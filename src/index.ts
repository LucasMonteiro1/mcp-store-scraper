import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import gplay from "google-play-scraper";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const store = require("app-store-scraper") as any;

const server = new McpServer({
  name: "store-scraper",
  version: "1.0.0",
});

// ─── Google Play ─────────────────────────────────────────────────────────────

server.tool(
  "gplay_app",
  "Get details of an app from Google Play Store",
  {
    appId: z.string().describe("Package name, e.g. com.example.app"),
    lang: z.string().optional().default("en").describe("Language code"),
    country: z.string().optional().default("us").describe("Country code"),
  },
  async ({ appId, lang, country }) => {
    const result = await gplay.app({ appId, lang, country });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "gplay_search",
  "Search apps on Google Play Store",
  {
    term: z.string().describe("Search term"),
    num: z.number().optional().default(10).describe("Number of results (max 250)"),
    lang: z.string().optional().default("en"),
    country: z.string().optional().default("us"),
  },
  async ({ term, num, lang, country }) => {
    const results = await gplay.search({ term, num, lang, country });
    return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
  }
);

server.tool(
  "gplay_reviews",
  "Get reviews of an app from Google Play Store",
  {
    appId: z.string().describe("Package name"),
    num: z.number().optional().default(10).describe("Number of reviews"),
    lang: z.string().optional().default("en"),
    country: z.string().optional().default("us"),
    sort: z.enum(["helpfulness", "newest", "rating"]).optional().default("newest"),
  },
  async ({ appId, num, lang, country, sort }) => {
    const sortMap = {
      helpfulness: gplay.sort.HELPFULNESS,
      newest: gplay.sort.NEWEST,
      rating: gplay.sort.RATING,
    };
    const results = await gplay.reviews({ appId, num, lang, country, sort: sortMap[sort] });
    return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
  }
);

server.tool(
  "gplay_similar",
  "Get similar apps from Google Play Store",
  {
    appId: z.string().describe("Package name"),
    lang: z.string().optional().default("en"),
    country: z.string().optional().default("us"),
  },
  async ({ appId, lang, country }) => {
    const results = await gplay.similar({ appId, lang, country });
    return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
  }
);

// ─── App Store ────────────────────────────────────────────────────────────────

server.tool(
  "appstore_app",
  "Get details of an app from Apple App Store",
  {
    id: z.number().optional().describe("Numeric app ID"),
    appId: z.string().optional().describe("Bundle ID, e.g. com.example.app"),
    country: z.string().optional().default("us"),
    lang: z.string().optional().default("en-us"),
  },
  async ({ id, appId, country, lang }) => {
    const result = await store.app({ id, appId, country, lang });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "appstore_search",
  "Search apps on Apple App Store",
  {
    term: z.string().describe("Search term"),
    num: z.number().optional().default(10).describe("Number of results"),
    country: z.string().optional().default("us"),
    lang: z.string().optional().default("en-us"),
  },
  async ({ term, num, country, lang }) => {
    const results = await store.search({ term, num, country, lang });
    return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
  }
);

server.tool(
  "appstore_reviews",
  "Get reviews of an app from Apple App Store",
  {
    id: z.number().optional().describe("Numeric app ID"),
    appId: z.string().optional().describe("Bundle ID"),
    country: z.string().optional().default("us"),
    page: z.number().optional().default(1).describe("Page number (1-10)"),
    sort: z.enum(["recent", "helpful"]).optional().default("recent"),
  },
  async ({ id, appId, country, page, sort }) => {
    const sortMap = { recent: store.sort.RECENT, helpful: store.sort.HELPFUL };
    const results = await store.reviews({ id, appId, country, page, sort: sortMap[sort] });
    return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
  }
);

server.tool(
  "appstore_similar",
  "Get similar apps from Apple App Store",
  {
    id: z.number().optional().describe("Numeric app ID"),
    appId: z.string().optional().describe("Bundle ID"),
    country: z.string().optional().default("us"),
  },
  async ({ id, appId, country }) => {
    const results = await store.similar({ id, appId, country });
    return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
  }
);

// ─── Start ────────────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
