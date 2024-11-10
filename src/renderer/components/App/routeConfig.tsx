import { Navigate, type RouteObject } from 'react-router-dom'
import Container from './Container'
import Home from '../Containers/Home/Home'

export const routeConfig: RouteObject[] = [
  {
    path: '/',
    element: <Container />,
    children: [
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '',
        element: <Navigate to="/home" replace />
      }
    ]
  }
]
