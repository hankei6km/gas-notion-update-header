import { endpoint, payload } from '../src/util.js'
const mockOptions = (kind: 'database' | 'page') => ({
  apiKey: '',
  id: '',
  kind
})

describe('endpoint()', () => {
  it('should return endpoint for databases  ', () => {
    expect(
      endpoint({
        ...mockOptions('database'),
        id: 'dummy'
      })
    ).toEqual('https://api.notion.com/v1/databases/dummy')
  })
  it('should return endpoint for pages', () => {
    expect(
      endpoint({
        ...mockOptions('page'),
        id: 'dummy'
      })
    ).toEqual('https://api.notion.com/v1/pages/dummy')
  })
})

describe('payload()', () => {
  it('should return empty payload', () => {
    expect(
      payload({
        ...mockOptions('database')
      })
    ).toEqual({})
    expect(
      payload({
        ...mockOptions('page')
      })
    ).toEqual({})
  })
  it('should transform string to conver', () => {
    expect(
      payload({
        ...mockOptions('database'),
        cover: 'dummy'
      }).cover
    ).toEqual({ external: { url: 'dummy' }, type: 'external' })
    expect(
      payload({
        ...mockOptions('page'),
        cover: 'dummy'
      }).cover
    ).toEqual({ external: { url: 'dummy' }, type: 'external' })
  })
  it('should pass-through cover', () => {
    expect(
      payload({
        ...mockOptions('database'),
        cover: {
          type: 'external',
          external: {
            url: 'dummy-cover'
          }
        }
      }).cover
    ).toEqual({
      external: { url: 'dummy-cover' },
      type: 'external'
    })
  })
  it('should transform string to icon', () => {
    expect(
      payload({
        ...mockOptions('database'),
        icon: '😀'
      }).icon
    ).toEqual({ emoji: '😀', type: 'emoji' })
    expect(
      payload({
        ...mockOptions('page'),
        icon: '😀'
      }).icon
    ).toEqual({ emoji: '😀', type: 'emoji' })
  })
  it('should pass-through icon', () => {
    expect(
      payload({
        ...mockOptions('database'),
        icon: {
          type: 'external',
          external: {
            url: 'dummy-icon'
          }
        }
      }).icon
    ).toEqual({
      external: { url: 'dummy-icon' },
      type: 'external'
    })
    expect(
      payload({
        ...mockOptions('page'),
        icon: {
          type: 'external',
          external: {
            url: 'dummy-icon'
          }
        }
      }).icon
    ).toEqual({
      external: { url: 'dummy-icon' },
      type: 'external'
    })
  })
  it('should transform string to title', () => {
    expect(
      (
        payload({
          ...mockOptions('database'),
          titleDatabase: 'dummy'
        }) as any
      ).title
    ).toEqual([{ text: { content: 'dummy' }, type: 'text' }])
    // page は後で対応
    //expect(
    //  (
    //    payload({
    //      ...mockOptions('page'),
    //      title: 'dummy'
    //    }) as any
    //  ).properties.Title
    //).toEqual({
    //  title: [{ text: { content: 'dummy' }, type: 'text' }],
    //  type: 'title'
    //})
  })
  it('should pass-through title', () => {
    expect(
      (
        payload({
          ...mockOptions('database'),
          titleDatabase: [{ text: { content: 'dummy-title' }, type: 'text' }]
        }) as any
      ).title
    ).toEqual([{ text: { content: 'dummy-title' }, type: 'text' }])
    // page は後で対応
    //expect(
    //  (
    //    payload({
    //      ...mockOptions('page'),
    //      title: [{ text: { content: 'dummy-title' }, type: 'text' }]
    //    }) as any
    //  ).properties.Title
    //).toEqual({
    //  title: [{ text: { content: 'dummy-title' }, type: 'text' }],
    //  type: 'title'
    //})
  })
})
