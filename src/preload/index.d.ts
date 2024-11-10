import type { StoreShape } from '@/store/store'
import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getUserData: () => Promise<StoreShape>
    }
  }
}
