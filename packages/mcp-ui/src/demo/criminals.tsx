import { App } from '@modelcontextprotocol/ext-apps';
import { createRoot } from 'react-dom/client';
import { type Criminal, Criminals } from '../criminals/Criminals.tsx';

const app = new App({
    name: 'GCPD MCP Criminals',
    version: '1.0.0',
});

app.addEventListener('toolresult', (data) => {
    const criminals = data.structuredContent?.criminals as Criminal[];

    createRoot(document.getElementById('root')!).render(<Criminals criminals={criminals} />);
})

app.connect();