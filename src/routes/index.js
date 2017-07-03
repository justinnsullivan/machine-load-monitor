// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/PageLayout'
import Main from './Main'
import Docs from './Docs'

export const createRoutes = (store) => ({
  path: '/',
  component: CoreLayout,
  indexRoute: Main(store),
  childRoutes: [Docs]
})

export default createRoutes
