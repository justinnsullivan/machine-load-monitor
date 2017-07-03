import { connect } from 'react-redux'
import { fetchLoadStats, toggleStream } from '../modules/load'
import LoadMonitor from '../components/LoadMonitor'

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLoadStats: () => {
      dispatch(fetchLoadStats())
    },
    toggleStream: (toggle) => {
      dispatch(toggleStream(toggle))
    }
  }
}

const mapStateToProps = (state) => ({
  loadStats: state.loadStats
})

export default connect(mapStateToProps, mapDispatchToProps)(LoadMonitor)
