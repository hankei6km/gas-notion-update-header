import { jest } from '@jest/globals'
import { NotionUpdateHeader } from '../src/notion-update-header.js'

const saveUrlFetchApp = global.UrlFetchApp
afterEach(() => {
  global.UrlFetchApp = saveUrlFetchApp
})

describe('NotionUpdateHeader.update()', () => {
  const unusedApiKey = 'dummy-apiKey'
  it('should call UrlFetchApp.fetch metod', () => {
    const mockfetch = jest.fn().mockReturnValue({
      getResponseCode: () => 200
    })
    global.UrlFetchApp = {
      fetch: mockfetch
    } as any
    NotionUpdateHeader.update({
      apiKey: unusedApiKey,
      id: 'dummy-id',
      kind: 'database'
    })
    expect(mockfetch).toBeCalledWith(
      'https://api.notion.com/v1/databases/dummy-id',
      {
        headers: {
          Authorization: `Bearer ${unusedApiKey}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28'
        },
        method: 'patch',
        muteHttpExceptions: true,
        payload: '{}'
      }
    )
  })
  it('should throw error by code(400)', () => {
    const mockfetch = jest.fn().mockReturnValue({
      getResponseCode: () => 400,
      getContentText: () => 'dummy error'
    })
    global.UrlFetchApp = {
      fetch: mockfetch
    } as any
    expect(() =>
      NotionUpdateHeader.update({
        apiKey: unusedApiKey,
        id: 'dummy-id',
        kind: 'database'
      })
    ).toThrowError(/code: 400, message: dummy error/)
  })
  it('should throw error by code(500)', () => {
    const mockfetch = jest.fn().mockReturnValue({
      getResponseCode: () => 500,
      getContentText: () => 'dummy error'
    })
    global.UrlFetchApp = {
      fetch: mockfetch
    } as any
    expect(() =>
      NotionUpdateHeader.update({
        apiKey: unusedApiKey,
        id: 'dummy-id',
        kind: 'database'
      })
    ).toThrowError(/code: 500, message: dummy error/)
  })
})
