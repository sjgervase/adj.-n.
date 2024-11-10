import Store from 'electron-store'
const storage = new Store()

// Get and Set Window Position
export const getWindowPosition = (): number[] => {
  const defaultPosition = [0, 0]
  const position = storage.get('window-position')

  if (Array.isArray(position)) return position
  else {
    storage.set('window-position', defaultPosition)
    return defaultPosition
  }
}
export const setWindowPosition = (newPosition: number[]): void => {
  storage.set('window-position', newPosition)
}

// Get and Set Window Size
export const getWindowSize = (): number[] => {
  const defaultSize = [900, 670]
  const size = storage.get('window-size')

  if (Array.isArray(size)) return size
  else {
    storage.set('window-size', defaultSize)
    return defaultSize
  }
}
export const setWindowSize = (newBounds: number[]): void => {
  storage.set('window-size', newBounds)
}
