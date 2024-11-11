import { Navigate, type RouteObject } from 'react-router-dom'
import Container from './Container'
import ParametersForm from '../Containers/ParametersForm'
import Results from '../Containers/Results/Results'

export const routeConfig: RouteObject[] = [
  {
    path: '/',
    element: <Container />,
    children: [
      {
        path: '/form',
        element: <ParametersForm />
      },
      {
        path: '/results',
        element: <Results />
      },
      {
        path: '',
        element: <Navigate to="/form" replace />
      }
    ]
  }
]
