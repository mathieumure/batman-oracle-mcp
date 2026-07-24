import { App } from '@modelcontextprotocol/ext-apps';
import { createRoot } from 'react-dom/client';
import { type LocatedVillain, type MapCenter, VillainsMap } from './VillainsMap.tsx';
import { crimes } from '@batman/data/crimes.ts';
import { villains } from '@batman/data/villains.ts';

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
    villains: crimes.map(it => ({
      name: it.id,
      picture: villains.find(villain => villain.name === it.suspect)?.picture ?? 'https://i.ebayimg.com/images/g/r9sAAOSwBMNlZRCk/s-l1200.jpg',
      lat: it.location.lat,
      lng: it.location.lng
    }))
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
