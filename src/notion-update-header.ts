import type {
  UpdateDatabaseParameters,
  UpdatePageParameters
} from '@notionhq/client/build/src/api-endpoints'
// import { Client } from '@notionhq/client'
import { payload, endpoint } from './util.js'

export namespace NotionUpdateHeader {
  export type TitleRichText = UpdateDatabaseParameters['title'] // Array<RichTextItemRequest>(UpdatePageParameters から取り出すのは難しい)
  export type DescriptionRichText = UpdateDatabaseParameters['description'] // Array<RichTextItemRequest>
  type HeaderCover =
    | string
    | UpdateDatabaseParameters['cover']
    | UpdatePageParameters['cover']
  type HeaderIcon =
    | Extract<UpdateDatabaseParameters['icon'], { emoji: any }>['emoji'] // EmojiRequest
    | UpdateDatabaseParameters['icon']
    | UpdatePageParameters['icon']
  type HeaderDescription = string | TitleRichText
  type HeaderTitle =
    | string
    | TitleRichText
    | { name: string; title: string }
    | {
        name: string
        title: TitleRichText
      }
  /**
   * Options for update header.
   *
   * @typedef {Object} Options
   * @property {string} apiKey - API key to call Notion API.,
   * @property {string} id - The id of page/datese.
   * @property {('page'|'database')} kind - The kind of object that the id points to.
   * @property {HeaderCover} cover - The image to set cover of the page/database.
   * @property {HeaderIcon} icon - The emoji(or image) to set icon of the page/database.
   * @property {HeaderDescription} description - The description to set cover of the database.
   * @property {HeaderTitle} title - The title to set cover of the page/database.
   */
  export type Options = {
    apiKey: string
    id: string
    kind: 'page' | 'database'
    cover?: HeaderCover
    icon?: HeaderIcon
    description?: HeaderDescription
    title?: HeaderTitle
  }

  /**
   * Update header of a database/page in Notion.

   * @param {Options} opts
   */
  export function update(
    opts: Options = {
      apiKey: '',
      id: '',
      kind: 'database'
    }
  ) {
    const apiVersion = '2022-06-28' // Client.defaultNotionVersion
    try {
      const res = UrlFetchApp.fetch(endpoint(opts), {
        method: 'patch',
        muteHttpExceptions: true,
        headers: {
          Authorization: `Bearer ${opts.apiKey}`,
          'Content-Type': 'application/json',
          'Notion-Version': apiVersion
        },
        payload: JSON.stringify(payload(opts))
      })
      const code = res.getResponseCode()
      const code100 = Math.trunc(code / 100)
      if (code100 === 4 || code100 === 5) {
        throw new Error(
          `update: code: ${code}, message: ${res.getContentText()}`
        )
      }
    } catch (err: any) {
      throw new Error(err)
    }
  }
}
