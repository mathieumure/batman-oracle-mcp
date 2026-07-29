import { App } from '@modelcontextprotocol/ext-apps';
import { createRoot } from 'react-dom/client';
import { type LocatedCriminal, type MapCenter, CriminalsMap } from './CriminalsMap.tsx';
import { crimes } from '@batman/data/crimes.ts';
import { criminals } from '@batman/data/criminals.ts';

type ToolResult = {
  structuredContent?: {
    city: string;
    center: MapCenter;
    criminals: LocatedCriminal[];
  };
};

const render = (result: ToolResult) => {
  const data = result.structuredContent;
  if (!data) return;
  createRoot(document.getElementById('root')!).render(<CriminalsMap city={data.city} center={data.center} criminals={data.criminals} />);
};

const mockResult: ToolResult = {
  structuredContent: {
    city: 'Clermont-Ferrand',
    center: { lat: 45.7797, lng: 3.0863 },
    criminals: crimes.map(it => ({
      name: it.id,
      picture: criminals.find(criminal => criminal.name === it.suspect)?.picture ?? 'https://i.ebayimg.com/images/g/r9sAAOSwBMNlZRCk/s-l1200.jpg',
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
