import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Alert from './Alert'
import '../../styles/Alerts.scss'
class AlertList extends Component {
  static propTypes = {
    alerts: PropTypes.array.isRequired,
  };
  render () {
    const { alerts } = this.props
    alerts.reverse()
    var display = <h3 className='alert__list__title--sub'>no alerts :-)</h3>
    if (alerts.length !== 0) {
      display = <ul className='alert__list'>
        {alerts.map((alert) =>
          <Alert key={alert.generatedAt + alert.type}
            generatedAt={alert.generatedAt}
            type={alert.type}
            average={alert.average}
          />
        )}
      </ul>
    }
    return (
      <div>
        <h2 className='alert__list__title'>Load Alerts</h2>
        {display}
      </div>
    )
  }
}

export default AlertList
