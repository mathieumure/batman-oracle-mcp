import { httpServer } from './http-server.js';

import './mcp-server.js';
import './01-criminal-tools.js';
import './02-crime-map.js';
import './03-crime-scene.js';

httpServer.listen({ port: 3000 });
