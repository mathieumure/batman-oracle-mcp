import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { LIVECODE_PORT } from './livecode.config.mjs'

const deckRoot = dirname(fileURLToPath(import.meta.url))

const VIRTUAL_ID = 'virtual:livecode'
const RESOLVED_ID = `\0${VIRTUAL_ID}`

let isBuild = false

// A virtual module, not `define`: Slidev overwrites the deck's `define` when it
// merges configs, but concatenates `plugins`.
export default {
  plugins: [
    {
      name: 'livecode-config',
      configResolved(config: { command: string }) {
        isBuild = config.command === 'build'
      },
      resolveId(id: string) {
        return id === VIRTUAL_ID ? RESOLVED_ID : null
      },
      load(id: string) {
        if (id !== RESOLVED_ID) return null
        // A static export has no code-server, so shipping the build machine's
        // path would leak it for nothing.
        return [
          `export const DECK_ROOT = ${JSON.stringify(isBuild ? '' : deckRoot)}`,
          `export const PORT = ${JSON.stringify(LIVECODE_PORT)}`,
        ].join('\n')
      },
    },
  ],
}
