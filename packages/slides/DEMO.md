1.1 | mcp-server.ts         => Instanciation d'un MCP Serveur & Request management
1.1 | 01-criminal-tools.ts  => Register tool only
1.2 | criminals.tsx         => ext-apps instance + event listener & render + app.connect 
1.2 | 01-criminal-tools.ts  => Register resource + add meta in tool
1.3 | 01-criminal-tools.ts  => Configure CSP in resources

2.1 | 02-crime-map.ts       => Init app + define input et export en structured data
2.1 | crime-map.tsx         => bind structured data
2.2 | 02-crime-map.ts       => Move payload content in meta + update output and add new payload
2.2 | crime-map.tsx         => change structured data with _meta

3.1 | 03-crime-scene.ts     => Add app template & bind authInfo
3.2 | mcp-server.ts         => Add auth description endpoint + auth validation
3.3 | 03-crime-scene.ts     => Add new tool & new resource
3.4 | crime-scene.tsx       => Call tool & resouce

4.1 | 01-criminal-tool.ts   => Add input and forward filter to api client
