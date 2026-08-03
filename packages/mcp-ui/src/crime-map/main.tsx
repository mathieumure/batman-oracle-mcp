import { App } from '@modelcontextprotocol/ext-apps';
import { createRoot } from 'react-dom/client';
import { type MapCenter, CrimeMap } from './CrimeMap.tsx';
import type { Crime } from './types.ts';

type ToolResult = {
  structuredContent?: {
    city: string;
    center: MapCenter;
    crimes: Crime[];
    connectChronologically?: boolean;
  };
};

const render = (result: ToolResult) => {
  const data = result.structuredContent;
  if (!data) return;
  createRoot(document.getElementById('root')!).render(
    <CrimeMap city={data.city} center={data.center} crimes={data.crimes} connectChronologically={data.connectChronologically} />,
  );
};

if (import.meta.env.DEV) {
  fetch('http://localhost:8080/crimes')
    .then((it) => it.json())
    .then((data) => {
      createRoot(document.getElementById('root')!).render(
        <CrimeMap city="Clermont-Ferrand" center={{ lat: 45.7797, lng: 3.0863 }} crimes={data as Crime[]} connectChronologically={false} />,
      );
    });
} else {
  const app = new App({ name: 'Batman Oracle', version: '1.0.0' });
  app.ontoolresult = render as NonNullable<typeof app.ontoolresult>;
  app.connect().catch((err) => {
    console.error('Failed to connect to app', err);
  });
}
