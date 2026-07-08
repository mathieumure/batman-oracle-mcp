import { App } from '@modelcontextprotocol/ext-apps';
import { createRoot } from 'react-dom/client';
import { type Villain, Villains } from './Villains.tsx';

const result = {
  structuredContent: {
    villains: [
      { name: 'Joker', picture: 'https://static.wikia.nocookie.net/marvel_dc/images/4/41/Batman_Vol_2_23.1_The_Joker_Textless.jpg' },
      { name: 'Bane', picture: 'https://static.wikia.nocookie.net/marvel_dc/images/b/b0/Batman_Vol_3_18_Textless.jpg' },
    ],
  },
};

if (import.meta.env.DEV) {
  createRoot(document.getElementById('root')!).render(<Villains villains={result.structuredContent?.villains as Villain[]} />);
} else {
  const app = new App({ name: 'DLP Hotels', version: '1.0.0' });

  app.ontoolresult = (result) => {
    createRoot(document.getElementById('root')!).render(<Villains villains={result.structuredContent?.villains as Villain[]} />);
  };

  app.connect().catch((err) => {
    console.error('Failed to connect to app', err);
  });
}
