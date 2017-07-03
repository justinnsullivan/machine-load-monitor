import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LoadChart from './LoadChart'
import CpuChart from './CpuChart'
import Processes from './Processes'
import '../../styles/Charts.scss'
import '../../styles/App.scss'

class Charts extends Component {
  static propTypes = {
    stats: PropTypes.array.isRequired,
  };
  render () {
    const { stats } = this.props
    var percentages = [{
      'type': 'user',
      'percent': 33.3

    }, {
      'type': 'sys',
      'percent': 33.3
    }, {
      'type': 'idle',
      'percent': 33.3
    }]
    var processes = []
    if (stats[0]) {
      percentages = stats[0].cpu
      processes = stats[0].processes
    }
    return (
      <div className='chart__wrapper--outer'>
        <h1 className='app__header'>Machine Load Monitor</h1>
        <div className='app__header--sub col-lg-7'>
                    This is a Load Monitor for the machine on which this web app is being run.
                    Below the machine load, CPU usage and Processes are being displayed.
                    The monitor receives your load statistics every 10 seconds,
                    thus it will take 10 seconds to see the results reflected within the load
                    chart below. If there are any important updates about your machine, you
                    will receive an alert.
                </div>
        <div className='chart__wrapper--inner'>
          <div className='chart__wrapper--outer'>
            <h2 className='chart__title'>Machine Load</h2>
            <LoadChart className='chart--line' stats={stats} />
          </div>
          <div className='chart__wrapper--outer'>
            <h2 className='chart__title'>CPU Usage</h2>
            <CpuChart percentages={percentages} />
          </div>
        </div>
        <Processes processes={processes} />
      </div>
    )
  }
}

export default Charts
