import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'

import store from '@/store/store'
import { routeConfig } from './routeConfig'

const router = createBrowserRouter(routeConfig)
const App = (): JSX.Element => (
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)

export default App
