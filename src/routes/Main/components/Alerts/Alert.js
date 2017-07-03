import React, { Component } from 'react'
import PropTypes from 'prop-types'
import '../../styles/Alerts.scss'

class Alert extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    average: PropTypes.number.isRequired,
    generatedAt: PropTypes.string.isRequired,

  };
  render () {
    const { type, average, generatedAt } = this.props
    var time = generatedAt.split(' ')[1].split(':')
    var minutes = (time[1].toString().length === 1) ? '0' + time[1].toString() : time[1].toString()
    var seconds = (time[2].toString().length === 1) ? '0' + time[1].toString() : time[2].toString()
    time = time[0] + ':' + minutes + ':' + seconds
    return (
      <li key={alert.generatedAt} className={'alert--' + type}>
        {(type === 'high')
                    ? <span>High load generated an alert - load = {average}</span>
                    : <span>Load has recoverd - load =  = {average}</span>
                }
        <span> triggered at {time}</span>
      </li>
    )
  }
}

export default Alert
