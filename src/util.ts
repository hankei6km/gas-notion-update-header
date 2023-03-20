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

  const icon: UpdateDatabaseParameters['icon'] | UpdatePageParameters['icon'] =
    opts.icon === undefined
      ? undefined
      : typeof opts.icon === 'string'
      ? {
          emoji: opts.icon as any, // EmojiRequest に合致するかの検証は難しい(おそらく API でエラーになる)
          type: 'emoji'
        }
      : opts.icon

  const basic = { cover, icon }
  if (opts.kind === 'database') {
    const title =
      opts.title === undefined
        ? undefined
        : typeof opts.title === 'string'
        ? [{ type: 'text' as const, text: { content: opts.title } }]
        : Array.isArray(opts.title)
        ? opts.title
        : undefined
    const description =
      opts.description === undefined
        ? undefined
        : typeof opts.description === 'string'
        ? [{ type: 'text' as const, text: { content: opts.description } }]
        : Array.isArray(opts.description)
        ? opts.description
        : undefined
    return {
      ...basic,
      description,
      title
    }
  }

  const title =
    opts.title === undefined
      ? undefined
      : typeof opts.title === 'string'
      ? {
          title: {
            title: [{ type: 'text' as const, text: { content: opts.title } }],
            type: 'title' as const
          }
        }
      : Array.isArray(opts.title)
      ? {
          title: {
            title: opts.title,
            type: 'title' as const
          }
        }
      : typeof opts.title.title === 'string' &&
        typeof opts.title.name === 'string'
      ? ((title: string, name: string) => {
          const ret: Record<
            string,
            { title: NotionUpdateHeader.TitleRichText; type: 'title' }
          > = {}
          ret[name] = {
            title: [
              {
                type: 'text' as const,
                text: { content: title }
              }
            ],
            type: 'title'
          }
          return ret
        })(opts.title.title, opts.title.name)
      : typeof opts.title.title !== 'string' &&
        typeof opts.title.name === 'string'
      ? ((title: NotionUpdateHeader.TitleRichText, name: string) => {
          const ret: Record<
            string,
            { title: NotionUpdateHeader.TitleRichText; type: 'title' }
          > = {}
          ret[name] = { title, type: 'title' }
          return ret
        })(opts.title.title, opts.title.name)
      : (undefined as any)
  const ret: Payload = { ...basic, properties: title }
  return ret
}
