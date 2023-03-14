import type {
  UpdateDatabaseParameters,
  UpdatePageParameters
} from '@notionhq/client/build/src/api-endpoints.js'
import { NotionUpdateHeader } from './notion-update-header.js'

type Payload =
  | Omit<UpdateDatabaseParameters, 'database_id'>
  | Omit<UpdatePageParameters, 'page_id'>

export function endpoint(opts: NotionUpdateHeader.Options): string {
  return opts.kind === 'database'
    ? `https://api.notion.com/v1/databases/${opts.id}`
    : `https://api.notion.com/v1/pages/${opts.id}`
}

export function payload(opts: NotionUpdateHeader.Options): Payload {
  const cover:
    | UpdateDatabaseParameters['cover']
    | UpdatePageParameters['cover'] =
    opts.cover === undefined
      ? undefined
      : typeof opts.cover === 'string'
      ? {
          type: 'external',
          external: {
            url: opts.cover
          }
        }
      : opts.cover
  const title =
    opts.title === undefined
      ? undefined
      : typeof opts.title === 'string'
      ? [{ type: 'text' as const, text: { content: opts.title } }]
      : opts.title

  if (opts.kind === 'database') {
    return {
      cover,
      title
    }
  }
  const ret: Payload = { cover }
  if (title) {
    ret.properties = {
      // title はプロパティを無視している、と思う。
      Title: { title: title, type: 'title' as const }
    }
  }
  return ret
}
