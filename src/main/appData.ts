import Store from 'electron-store'
const storage = new Store()

const defaultAppData = {}

// Get User Data
export const getUserData = (): typeof defaultAppData => {
  const appData = storage.get('appData') as typeof defaultAppData

  if (!appData) {
    storage.set('appData', defaultAppData)
    return defaultAppData
  }

  return appData
}
