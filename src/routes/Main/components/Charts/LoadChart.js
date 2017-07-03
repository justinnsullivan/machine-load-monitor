import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AreaStackChart } from 'react-d3-basic'

class LoadChart extends Component {
  static propTypes = {
    stats: PropTypes.array.isRequired,
  };
  render () {
    const { stats } = this.props
    var max = 0
    const timeFormat = d3.time.format('%H:%M:%S').parse
    const chartData = stats.map((stat) => {
      if (stat.load > max) max = stat.load
      return { time: stat.generatedAt.split(' ')[1], load: stat.load }
    })
    const width = 750
    const height = 400
    const chartSeries = [{
      field: 'load',
      name: 'Machine Load',
      color: '#9C88AE',
      style: {
        'strokeWidth': 2,
        'strokeOpacity': 0.2,
        'fillOpacity': 0.7
      }
    }]
    const x = function (d) {
      return timeFormat(d.time)
    }
    const yScale = [0, max + 1.5]
    return (
      <AreaStackChart
        className='chart'
        data={chartData}
        width={width}
        height={height}
        chartSeries={chartSeries}
        x={x}
        xScale={'time'}
        yDomain={yScale} />
    )
  }
}

export default LoadChart
