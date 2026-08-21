import { mcpServer } from '../mcp-server.js';
import { GCPDClient } from '../gcpd.api.js';
import { z } from 'zod';
import { resolveDistFiles } from '../utils.js';

// <DEMO-3>
const csp = {
  resourceDomains: [process.env.MCP_ORIGIN, 'https://static.wikia.nocookie.net'],
};
// <DEMO-3>

// <DEMO>
mcpServer.registerTool(
  'get_criminals',
  {
    description: 'Get the list of all criminals from the GCPD database.',
    // <DEMO-2>
    _meta: {
      ui: {
        resourceUri: 'ui://get_criminals',
      },
    },
    // </DEMO-2>
    outputSchema: {
      criminals: z.array(
        z.object({
          name: z.string(),
          picture: z.url().nullable(),
          details: z
            .object({
              realName: z.string().nullable(),
              aliases: z.array(z.string()),
              relatives: z.array(z.string()),
              citizenship: z.string().nullable(),
              gender: z.string().nullable(),
              height: z.string().nullable(),
              weight: z.string().nullable(),
              eyes: z.string().nullable(),
              hair: z.string().nullable(),
              affiliation: z.array(z.string()),
            })
            .nullable(),
        }),
      ),
    },
  },
  async () => {
    const criminals = await GCPDClient.getCriminals();
    return {
      content: [{ type: 'text', text: JSON.stringify(criminals) }],
      structuredContent: { criminals },
    };
  },
);

// </DEMO>

// <DEMO-2>
mcpServer.registerResource(
  'get_criminals_ui',
  'ui://get_criminals',
  {
    mimeType: 'text/html;profile=mcp-app',
    // <DEMO-3>
    _meta: {
      ui: {
        csp,
      },
    },
    // </DEMO-3>
  },
  async () => {
    const html = await resolveDistFiles('src/criminals/index.html');
    return {
      contents: [
        {
          uri: 'ui://get_criminals',
          mimeType: 'text/html;profile=mcp-app',
          text: html,
          _meta: {
            ui: {
              csp,
            },
          },
        },
      ],
    };
  },
);
// </DEMO-2>
