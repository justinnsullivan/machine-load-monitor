import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Charts from './Charts/Charts'
import AlertList from './Alerts/AlertList'
import '../styles/Process.scss'

class LoadMonitor extends Component {
  static propTypes = {
    loadStats: PropTypes.object.isRequired,
    fetchLoadStats: PropTypes.func.isRequired,
    toggleStream: PropTypes.func.isRequired
  };

  componentDidMount = () => {
    const { fetchLoadStats } = this.props
    fetchLoadStats()
  }

  stream = setInterval(this.props.fetchLoadStats, 10000);

  isPaused = false;

  componentWillReceiveProps = (nextProps) => {
    const { fetchLoadStats, loadStats } = nextProps
    if (loadStats.toggle === false) {
      this.isPaused = true
      clearInterval(this.stream)
    } else if (this.isPaused === true) {
      fetchLoadStats()
      this.stream = setInterval(this.props.fetchLoadStats, 10000)
      this.isPaused = false
    }
  }

  switchToggle = () => {
    const { toggleStream, loadStats } = this.props
    toggleStream(!loadStats.toggle)
  }

  render = () => {
    const { loadStats } = this.props
    var buttonText = 'Pause'
    if (loadStats.toggle === false) buttonText = 'Start'
    return (
      <div>
        <Charts stats={loadStats.stats} />
        <AlertList alerts={loadStats.alerts} />
        <button className='btn button btn-lg' onClick={this.switchToggle}>
          {buttonText}
        </button>
      </div>
    )
  }
}

export default LoadMonitor
