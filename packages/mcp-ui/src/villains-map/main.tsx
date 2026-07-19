import { App } from '@modelcontextprotocol/ext-apps';
import { createRoot } from 'react-dom/client';
import { type LocatedVillain, type MapCenter, VillainsMap } from './VillainsMap.tsx';

type ToolResult = {
  structuredContent?: {
    city: string;
    center: MapCenter;
    villains: LocatedVillain[];
  };
};

const render = (result: ToolResult) => {
  const data = result.structuredContent;
  if (!data) return;
  createRoot(document.getElementById('root')!).render(<VillainsMap city={data.city} center={data.center} villains={data.villains} />);
};

// TODO : We can maybe use the same villains as in the ‘villains’ tool? wyt mister M ?
const mockResult: ToolResult = {
  structuredContent: {
    city: 'Clermont-Ferrand',
    center: { lat: 45.7797, lng: 3.0863 },
    villains: [
      {
        name: 'Joker',
        picture: 'https://static.wikia.nocookie.net/marvel_dc/images/4/41/Batman_Vol_2_23.1_The_Joker_Textless.jpg',
        lat: 45.781,
        lng: 3.084,
      },
      {
        name: 'Bane',
        picture: 'https://static.wikia.nocookie.net/marvel_dc/images/b/b0/Batman_Vol_3_18_Textless.jpg',
        lat: 45.778,
        lng: 3.089,
      },
    ],
  },
};

if (import.meta.env.DEV) {
  render(mockResult);
} else {
  const app = new App({ name: 'Batman Oracle', version: '1.0.0' });
  app.ontoolresult = render as NonNullable<typeof app.ontoolresult>;
  app.connect().catch((err) => {
    console.error('Failed to connect to app', err);
  });
}
