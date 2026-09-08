import { mcpServer } from './mcp-server.js';
import { GCPDClient } from './gcpd.api.js';
import { z } from 'zod';
import { resolveDistFiles } from './utils.js';

const csp = {
  resourceDomains: [process.env.MCP_ORIGIN],
};

mcpServer.registerTool(
  'crime_scene',
  {
    _meta: {
      ui: {
        resourceUri: 'ui://crime_scene',
      },
    },
    description:
      'Get the forensic report for the current crime scene from the GCPD: fingerprints, blood traces, lab residue analysis, and exhibits found on site.',
    outputSchema: {
      description: z.string(),
      fingerprintsFound: z.boolean(),
      fingerprintsDetails: z.string().nullable(),
      bloodTraces: z.boolean(),
      bloodTracesDetails: z.string().nullable(),
      residues: z.array(z.string()),
      exhibits: z.array(z.string()),
    },
  },
  async ({ authInfo }) => {
    const crimeScene = await GCPDClient.getCrimeScene(authInfo?.token as string);

    return {
      content: [{ type: 'text', text: JSON.stringify(crimeScene) }],
      structuredContent: { ...crimeScene },
    };
  },
);

mcpServer.registerResource(
  'crime_scene_ui',
  'ui://crime_scene',
  {
    mimeType: 'text/html;profile=mcp-app',
    _meta: {
      ui: {
        csp,
      },
    },
  },
  async () => {
    const html = await resolveDistFiles('src/crime-scene/index.html');
    return {
      contents: [
        {
          uri: 'ui://crime_scene',
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
