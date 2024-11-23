import { UiLayout } from '@/components/ui/ui-layout'
import { lazy } from 'react'
import { Navigate, RouteObject, useRoutes } from 'react-router-dom'

const AccountListFeature = lazy(() => import('../components/account/account-list-feature'))
const AccountDetailFeature = lazy(() => import('../components/account/account-detail-feature'))
const ClusterFeature = lazy(() => import('../components/cluster/cluster-feature'))
const HomePage = lazy(() => import('../components/homepage/homepage'))
const BetPage = lazy(() => import('../components/bet/betpage'))
const DevPage = lazy(() => import('../components/dev/devpage'))
const TosPage = lazy(() => import('../components/tos/tos'))

const routes: RouteObject[] = [
  { path: '/account/', element: <AccountListFeature /> },
  { path: '/account/:address', element: <AccountDetailFeature /> },
  { path: '/clusters', element: <ClusterFeature /> },
  { path: '/bet', element: <BetPage /> },
  { path: '/dev', element: <DevPage /> },
  { path: '/tos', element: <TosPage /> },
]

export function AppRoutes() {
  const router = useRoutes([
    { index: true, element: <Navigate to={'/home'} replace={true} /> },
    { path: '/home', element: <HomePage /> },
    ...routes,
    { path: '*', element: <Navigate to={'/home'} replace={true} /> },
  ])
  return <UiLayout>{router}</UiLayout>
}
