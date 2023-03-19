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
  it('should transform string to title(database)', () => {
    expect(
      (
        payload({
          ...mockOptions('database'),
          titleDatabase: 'dummy'
        }) as any
      ).title
    ).toEqual([{ text: { content: 'dummy' }, type: 'text' }])
  })
  it('should pass-through title(database)', () => {
    expect(
      (
        payload({
          ...mockOptions('database'),
          titleDatabase: [{ text: { content: 'dummy-title' }, type: 'text' }]
        }) as any
      ).title
    ).toEqual([{ text: { content: 'dummy-title' }, type: 'text' }])
  })
  it('should transform string to title(page)', () => {
    expect(
      (
        payload({
          ...mockOptions('page'),
          titlePage: 'dummy'
        }) as any
      ).properties
    ).toEqual({
      title: {
        title: [{ text: { content: 'dummy' }, type: 'text' }],
        type: 'title'
      }
    })
    expect(
      (
        payload({
          ...mockOptions('page'),
          titlePage: { title: 'dummy', name: 'DummyTitle' }
        }) as any
      ).properties
    ).toEqual({
      DummyTitle: {
        title: [{ text: { content: 'dummy' }, type: 'text' }],
        type: 'title'
      }
    })
  })
  it('should pass-through title(page)', () => {
    expect(
      (
        payload({
          ...mockOptions('page'),
          titlePage: {
            title: [{ text: { content: 'dummy-title' }, type: 'text' }],
            name: 'DummyTitle'
          }
        }) as any
      ).properties
    ).toEqual({
      DummyTitle: {
        title: [{ text: { content: 'dummy-title' }, type: 'text' }],
        type: 'title'
      }
    })
  })
})
