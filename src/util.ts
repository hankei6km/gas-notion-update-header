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
      opts.titleDatabase === undefined
        ? undefined
        : typeof opts.titleDatabase === 'string'
        ? [{ type: 'text' as const, text: { content: opts.titleDatabase } }]
        : opts.titleDatabase
    return {
      ...basic,
      title
    }
  }

  type TitleValue = Exclude<
    Extract<NotionUpdateHeader.Options['titlePage'], { title: any }>['title'],
    string
  >
  const title =
    opts.titlePage === undefined
      ? undefined
      : typeof opts.titlePage === 'string'
      ? {
          title: {
            title: [
              { type: 'text' as const, text: { content: opts.titlePage } }
            ],
            type: 'title' as const
          }
        }
      : typeof opts.titlePage.title === 'string' &&
        typeof opts.titlePage.name === 'string'
      ? ((title: string, name: string) => {
          const ret: Record<string, { title: TitleValue; type: 'title' }> = {}
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
        })(opts.titlePage.title, opts.titlePage.name)
      : typeof opts.titlePage.title !== 'string' &&
        typeof opts.titlePage.name === 'string'
      ? ((title: TitleValue, name: string) => {
          const ret: Record<string, { title: TitleValue; type: 'title' }> = {}
          ret[name] = { title, type: 'title' }
          return ret
        })(opts.titlePage.title, opts.titlePage.name)
      : (undefined as any)
  const ret: Payload = { ...basic, properties: title }
  return ret
}
