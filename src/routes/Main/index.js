import { injectReducer } from '../../store/reducers'

export default (store) => ({
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const LoadStats = require('./containers/MainContainer').default
      const reducer = require('./modules/load').default
      injectReducer(store, { key: 'loadStats', reducer })
      cb(null, LoadStats)
    }, 'loadStats')
  }
})
