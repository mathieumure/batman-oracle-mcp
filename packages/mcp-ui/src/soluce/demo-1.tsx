import { App } from '@modelcontextprotocol/ext-apps';
import { createRoot } from 'react-dom/client';
import { type Criminal, Criminals } from '../criminals/Criminals.tsx';

// DEMO
const app = new App({ name: 'Batman Oracle', version: '1.0.0' });

app.addEventListener('toolresult', (result) => {
  const criminals = result.structuredContent?.criminals as Criminal[];
  createRoot(document.getElementById('root')!).render(<Criminals criminals={criminals} />);
});

app.connect().catch((err) => {
  console.error('Failed to connect to app', err);
});
// END DEMO
