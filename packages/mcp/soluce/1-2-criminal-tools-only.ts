import { mcpServer } from './mcp-server.js';
import { GCPDClient } from './gcpd.api.js';
import { z } from 'zod';
import { resolveDistFiles } from './utils.js';

mcpServer.registerTool(
  'Get Criminals',
  {
    description: 'Get the list of all criminals from the GCPD database.',
    outputSchema: {
      criminals: z.array(
        z.object({
          name: z.string().describe('The name of the criminal'),
          picture: z.url().nullable().describe('The official GCPD picture of the criminal'),
          details: z
            .object({
              realName: z.string().nullable().describe('The real name of the criminal'),
              aliases: z.array(z.string()).describe('All known aliases of the criminal'),
              relatives: z.array(z.string()).describe('All known friend and family of the criminal'),
              citizenship: z.string().nullable().describe('The nationality of the criminal'),
              gender: z.string().nullable().describe('The gender of the criminal'),
              height: z.string().nullable().describe('The heigh in feet of the criminal'),
              weight: z.string().nullable().describe('The weight in lbs of the criminal'),
              eyes: z.string().nullable().describe('The color of eyes of the criminal'),
              hair: z.string().nullable().describe('The color of the hair of the criminal'),
              affiliation: z.array(z.string()).describe('All known affiliation'),
            })
            .nullable()
            .describe('Additional information of the criminal'),
        }),
      ),
    },
  },
  async () => {
    const criminals = await GCPDClient.getCriminals();

    return {
      content: [{ type: 'text', text: JSON.stringify({ criminals }) }],
      structuredContent: { criminals },
    };
  },
);
