import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PieChart } from 'react-d3-basic'

class CpuChart extends Component {
  static propTypes = {
    percentages: PropTypes.array.isRequired,
  };
  render = () => {
    const { percentages } = this.props
    const width = 400
    const height = 400
    const value = function (d) {
      return +d.percent
    }
    const name = function (d) {
      return d.type
    }
    var colors = ['#51336B', '#784C9E', '#D3B7EA']
    var color = 0
    var chartSeries = [{
      'field': 'user',
      'name': 'User',
      'color': '#51336B',

    }, {
      'field': 'sys',
      'name': 'Sys',
      'color': '#784C9E'
    },
    {
      'field': 'idle',
      'name': 'Idle',
      'color': '#D3B7EA'
    }]
    if (percentages.length !== 0) {
      chartSeries = []
      for (var i = 0; i < percentages.length; i++) {
        if (color === 3) color = 0
        let data = {
          'field': percentages[i].type,
          'name': percentages[i].type.charAt(0).toUpperCase() + percentages[i].type.slice(1),
          'color': colors[color]
        }
        chartSeries.push(data)
        color += 1
      }
    }
    return (
      <PieChart
        data={percentages}
        width={width}
        height={height}
        chartSeries={chartSeries}
        value={value}
        name={name}
      />
    )
  }
}

export default CpuChart
