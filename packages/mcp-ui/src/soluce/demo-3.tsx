import { App } from '@modelcontextprotocol/ext-apps';
import { createRoot } from 'react-dom/client';
import { CrimeScene } from '../crime-scene/CrimeScene.tsx';
import type { CrimeScene as CrimeSceneData } from '@batman/data/crime-scene.js';

const app = new App({ name: 'Batman Oracle', version: '1.0.0' });

app.addEventListener('toolresult', (result) => {
  const updateData = async (type: 'exhibits' | 'residues'): Promise<string[]> => {
    //DEMO
    if (type === 'exhibits') {
      const data = await app.readServerResource({ uri: `forensics:/${type}` });
      return JSON.parse((data.contents[0] as { text: string }).text);
    } else {
      const data = await app.callServerTool({ name: 'get_forensics_residues' });
      return data.structuredContent?.residues as string[];
    }
    //DEMO
  };

  const crimeScene = result.structuredContent as unknown as CrimeSceneData;
  createRoot(document.getElementById('root')!).render(<CrimeScene crimeScene={crimeScene} onUpdateData={updateData} />);
});

app.connect().catch((err) => {
  console.error('Failed to connect to app', err);
});
