import AsyncStorage from '@react-native-async-storage/async-storage'
import { saveToStorage, loadFromStorage } from '@/hooks/useAsyncStorage'

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

describe('useAsyncStorage utils', () => {
  beforeEach(() => {
    AsyncStorage.clear()
  })

  it('saves and loads an object correctly', async () => {
    const key = '@test:data'
    const value = { foo: 'bar', num: 42 }
    await saveToStorage(key, value)
    const loaded = await loadFromStorage<typeof value>(key)
    expect(loaded).toEqual(value)
  })

  it('returns null for missing key', async () => {
    const result = await loadFromStorage('@test:missing')
    expect(result).toBeNull()
  })
})
