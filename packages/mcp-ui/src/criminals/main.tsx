import { App } from '@modelcontextprotocol/ext-apps';
import { createRoot } from 'react-dom/client';
import { type Criminal, Criminals } from './Criminals.tsx';

if (import.meta.env.DEV) {
  fetch('http://localhost:8080/criminals')
    .then((it) => it.json())
    .then((data) => {
      createRoot(document.getElementById('root')!).render(<Criminals criminals={data as Criminal[]} />);
    });
} else {
  const app = new App({ name: 'DLP Hotels', version: '1.0.0' });

  app.ontoolresult = (result) => {
    createRoot(document.getElementById('root')!).render(<Criminals criminals={result.structuredContent?.criminals as Criminal[]} />);
  };

  app.connect().catch((err) => {
    console.error('Failed to connect to app', err);
  });
}
