import { App } from '@modelcontextprotocol/ext-apps';
import { createRoot } from 'react-dom/client';
import { type Villain, Villains } from './Villains.tsx';

if (import.meta.env.DEV) {
  fetch('http://localhost:8080/villains')
    .then((it) => it.json())
    .then((data) => {
      createRoot(document.getElementById('root')!).render(<Villains villains={data as Villain[]} />);
    });
} else {
  const app = new App({ name: 'DLP Hotels', version: '1.0.0' });

  app.ontoolresult = (result) => {
    createRoot(document.getElementById('root')!).render(<Villains villains={result.structuredContent?.villains as Villain[]} />);
  };

  app.connect().catch((err) => {
    console.error('Failed to connect to app', err);
  });
}
