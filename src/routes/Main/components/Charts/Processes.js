import React, { Component } from 'react'
import PropTypes from 'prop-types'
import '../../styles/Process.scss'

class Processes extends Component {
  static propTypes = {
    processes: PropTypes.array.isRequired,
  };
  render = () => {
    const { processes } = this.props
    return (
      <div className='process__list col-lg-7'>
        {processes.map((proc) =>
          <div key={proc.value + proc.type} className='process'>
            <span className='process__value'>{proc.value}</span>
            <span className='process__type'>{proc.type.toUpperCase()}</span>
          </div>
        )}
      </div>
    )
  }
}

export default Processes
