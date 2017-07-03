import {
    RECEIVE_LOAD_STATS,
    receiveLoadStats,
    default as loadStatsReducer
} from 'routes/Main/modules/load'

// -- SCRIPTING TO GENERATE DATA FOR ALERT TESTS -- \\

// For dummy stats the proccessing and cpu statistics don't
// mean anything and thus they can be left constant.
var processes = [{ 'type': 'total', 'value': 389 }, { 'type': 'running', 'value': 2 },
{ 'type': 'sleeping', 'value': 387 }, { 'type': 'threads', 'value': 1978 }]
var cpu = [{ 'type': 'user', 'percent': 5.39 }, { 'type': 'sys', 'percent': 12.25 },
{ 'type': 'idle', 'percent': 82.35 }]

const generateTest = (type) => {
  var base = '2017/07/01 18:3'
  var last = '2017/07/01 18:29:59'
  var stats = []
  var average = 0
  switch (type) {
        // Case with high load over 1 after 2 minutes
    case 'high':
      stats = createStats(randomHighFloat, 12, base, 0, 0)
      break
        // Case with high prior average and then average below 1
    case 'low':
      var first = createStats(randomHighFloat, 12, base, 0, 0)
      stats = createStats(randomLowFloat, 12, base, 2, 0).concat(first)
      average = 1.89
      last = '2017/07/01 18:30:00'
      break
        // Case for no warning with loads all averaging to 1
    case 'none':
      first = createStats(randomLowFloat, 12, base, 0, 0)
      stats = createStats(randomLowFloat, 12, base, 2, 0).concat(first)
      average = 0.5
      last = '2017/07/01 18:30:00'
      break
  }
  return {
    toggle: false,
    stats: stats,
    alerts: [],
    lastAlert: last,
    lastAverage: average
  }
}

// Creates load statistics every 10 seconds for the 'total' iterations
const createStats = (floatFunc, total, base, minutes, seconds) => {
  var stats = []
  for (var i = 0; i < total; i++) {
    seconds += 10
    if (seconds === 60) {
      seconds = 0
      minutes += 1
    }
    stats.unshift({
      load: floatFunc(),
      processes: processes,
      cpu: cpu,
      generatedAt: ('2017/07/01 18:3' + minutes + ':' + seconds)
    })
  }
  return stats
}

const randomFloat = (min, max) => {
  return Math.random() * (max - min) + min
}
const randomHighFloat = () => {
  return randomFloat(1.0, 1.99)
}
const randomLowFloat = () => {
  return randomFloat(0.0, 0.99)
}

describe('(Redux Module) Load', () => {
  it('Should export a constant RECEIVE_LOAD_STATS.', () => {
    expect(RECEIVE_LOAD_STATS).to.equal('RECEIVE_LOAD_STATS')
  })

  describe('(Reducer)', () => {
    it('Should be a function.', () => {
      expect(loadStatsReducer).to.be.a('function')
    })
    it('Should initialize with a state of toggle -> true, stats->[], alerts -> [], lastAlert -> now, ' +
      ' lastAverage -> 0.', () => {
      const state = loadStatsReducer(undefined, {})
      expect(state.toggle).to.be.true()
      expect(state.stats).to.be.empty()
      expect(state.alerts).to.be.empty()
      expect(state.lastAverage).to.equal(0)
    })

    it('Should return the previous state if an action was not matched.', () => {
      var stat = {
        'load': 0.54,
        'processes': [
                    { 'type': 'total', 'value': 393 },
                    { 'type': 'running', 'value': 2 },
                    { 'type': 'sleeping', 'value': 391 },
                    { 'type': 'threads', 'value': 2030 }
        ],
        'cpu': [
                    { 'type': 'user', 'percent': 10.24 },
                    { 'type': 'sys', 'percent': 14.14 },
                    { 'type': 'idle', 'percent': 75.6 }
        ],
        'generatedAt': '2017/07/01 18:3'
      }

            // wrong action type
      let state = loadStatsReducer(undefined, {})
      state = loadStatsReducer(state, { type: '@@@@@@@' })
      expect(state.toggle).to.be.true()
      expect(state.stats).to.be.empty()
      expect(state.alerts).to.be.empty()
      expect(state.lastAverage).to.equal(0)

            // first stat is equal to above but average is still 0 because
            // two minutes have not elapsed
      state = loadStatsReducer(state, receiveLoadStats(stat))
      expect(state.stats[0]).to.equal(stat)
      expect(state.lastAverage).to.equal(0)

            // wrong action type again and state should be unchanged
      state = loadStatsReducer(state, { type: '@@@@@@@' })
      expect(state.stats[0]).to.equal(stat)
      expect(state.lastAverage).to.equal(0)
    })
  })

  it('Should return a high alert when given a set with an average load >= 1 in the past 2 mins', () => {
    const highStat = {
      'load': 1.99,
      processes,
      cpu,
      'generatedAt': '2017/07/01 18:32:10'
    }
    let state = loadStatsReducer(generateTest('high'), {})
    state = loadStatsReducer(state, receiveLoadStats(highStat))
    expect(state.alerts[0]).to.include({ type: 'high' })
    expect(state.alerts[0].average).to.be.above(1)
    expect(state.lastAverage).to.not.equal(0)
  })

  it('Should return a low alert when given a set with an average load' +
    ' <= 1 in the past 2 mins with an average load > 1 for the prior 2 mins', () => {
    let state = loadStatsReducer(generateTest('low'), {})
    const lowStat = {
      'load': 0.49,
      processes,
      cpu,
      'generatedAt': '2017/07/01 18:34:20'
    }
    state = loadStatsReducer(state, receiveLoadStats(lowStat))
    expect(state.alerts[0]).to.include({ type: 'low' })
    expect(state.alerts[0].average).to.be.below(1)
    expect(state.lastAverage).to.not.equal(0)
  })

  it('Should return a no alert because of low load', () => {
    let state = loadStatsReducer(generateTest('none'), {})
    const lowStat = {
      'load': 0.49,
      processes,
      cpu,
      'generatedAt': '2017/07/01 18:34:20'
    }
    state = loadStatsReducer(state, receiveLoadStats(lowStat))
    expect(state.alerts).to.be.empty()
  })
})
