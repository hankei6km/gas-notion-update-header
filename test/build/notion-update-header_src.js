import { jest } from '@jest/globals'

const saveUrlFetchApp = global.UrlFetchApp
afterEach(() => {
  global.UrlFetchApp = saveUrlFetchApp
})

describe('update()', () => {
  it('should call UrlFetchApp.fetch metod', () => {
    const mockfetch = jest.fn().mockReturnValue({
      getResponseCode: () => 200
    })
    global.UrlFetchApp = {
      fetch: mockfetch
    }
    update({
      apiKey: 'dummy-apiKey',
      id: 'dummy-id',
      kind: 'database'
    })
    expect(mockfetch).toHaveBeenCalledTimes(1)
  })
})
