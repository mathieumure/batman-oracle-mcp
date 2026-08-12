import { App } from '@modelcontextprotocol/ext-apps';
import { createRoot } from 'react-dom/client';
import { CrimeScene } from './CrimeScene.tsx';
import type { CrimeScene as CrimeSceneData } from '@batman/data/crime-scene.js';

if (import.meta.env.DEV) {
  fetch('http://localhost:8080/crime-scene', {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjMwMDEiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAvbWNwIn0.po39ftaAJg1flUk_PKR_3T5mp9QlBgbkDY8H9dLdXy0`,
    },
  })
    .then((it) => it.json())
    .then((data) => {
      createRoot(document.getElementById('root')!).render(
        <CrimeScene crimeScene={data as CrimeSceneData} onUpdateData={() => Promise.resolve([])} />,
      );
    });
} else {
  const app = new App({ name: 'Batman Oracle', version: '1.0.0' });

  const updateData = async (type: 'exhibits' | 'residues'): Promise<string[]> => {
    const data = await app.readServerResource({ uri: `forensics:/${type}` });

    return JSON.parse((data.contents[0] as { text: string }).text);
  };

  app.addEventListener('toolresult', (result) => {
    const crimeScene = result.structuredContent as unknown as CrimeSceneData;
    createRoot(document.getElementById('root')!).render(<CrimeScene crimeScene={crimeScene} onUpdateData={updateData} />);
  });

  app.connect().catch((err) => {
    console.error('Failed to connect to app', err);
  });
}
