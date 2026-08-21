import { App } from '@modelcontextprotocol/ext-apps';
import { createRoot } from 'react-dom/client';
import { CrimeMap, type MapCenter } from '../crime-map/CrimeMap.tsx';
import type { Crime } from '../crime-map/types.ts';

type Meta = {
  city: string;
  center: MapCenter;
  crimes: Crime[];
  connectChronologically?: boolean;
};

const app = new App({ name: 'Batman Oracle', version: '1.0.0' });

app.addEventListener('toolresult', (result) => {
  // DEMO
  const data = result._meta as Meta;
  createRoot(document.getElementById('root')!).render(
    <CrimeMap city={data.city} center={data.center} crimes={data.crimes} connectChronologically={data.connectChronologically} />,
  );
  // END DEMO
});

app.connect().catch((err) => {
  console.error('Failed to connect to app', err);
});
