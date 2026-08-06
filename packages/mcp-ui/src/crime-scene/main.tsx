import { App } from '@modelcontextprotocol/ext-apps';
import { createRoot } from 'react-dom/client';
import { CrimeScene } from './CrimeScene.tsx';
import type { CrimeScene as CrimeSceneData } from '@batman/data/crime-scene.js';

type ToolResult = {
  structuredContent?: CrimeSceneData;
};

const render = (result: ToolResult) => {
  const data = result.structuredContent;
  if (!data) return;
  createRoot(document.getElementById('root')!).render(<CrimeScene crimeScene={data} />);
};

if (import.meta.env.DEV) {
  fetch('http://localhost:8080/crime-scene')
    .then((it) => it.json())
    .then((data) => {
      createRoot(document.getElementById('root')!).render(<CrimeScene crimeScene={data as CrimeSceneData} />);
    });
} else {
  const app = new App({ name: 'Batman Oracle', version: '1.0.0' });
  app.ontoolresult = render as NonNullable<typeof app.ontoolresult>;
  app.connect().catch((err) => {
    console.error('Failed to connect to app', err);
  });
}
