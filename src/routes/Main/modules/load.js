// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_LOAD_STATS = 'RECEIVE_LOAD_STATS'
export const TOGGLE_STREAM = 'TOGGLE_STREAM'

// ------------------------------------
// Actions
// ------------------------------------

export const receiveLoadStats = (stats) => ({
  type: RECEIVE_LOAD_STATS,
  stats
})

export const toggleStream = (toggle) => {
  return ({
    type: TOGGLE_STREAM,
    toggle })
}

export const fetchLoadStats = () => (dispatch) => {
  var req = new Request(`http://` + location.host + `/top`)
  return fetch(req)
        .then(response => response.json())
        .then(json => dispatch(receiveLoadStats(json)))
}

export const actions = {
  fetchLoadStats,
  toggleStream
}

const addToStats = (original, next) => {
  if (original.length < 60) {
    return next.concat(original)
  } else {
    original.pop()
    return next.concat(original)
  }
}

const twoMinuteAverage = (newStats) => {
  let sum = 0
  let n = 12
  if (newStats.length < 12) n = newStats.length
  for (var i = 0; i < n; i++) {
    sum += newStats[i].load
  }
  return sum / n
}

const generateAlertIfNeeded = (lastAverage, newAverage, alerts) => {
  if (lastAverage >= 1 && newAverage <= 1) {
    alerts.push({ average: newAverage, generatedAt: getNow(), type: 'low' })
  } else if (newAverage >= 1) {
    alerts.push({ average: newAverage, generatedAt: getNow(), type: 'high' })
  }
  return alerts
}

const twoMinuteElapsed = (timeA, timeB) => {
  return ((Date.parse(timeA) - Date.parse(timeB)) >= 119999)
}

const generateState = (state, action) => {
  let lastAlert = state.lastAlert
  let lastAverage = state.lastAverage
  let newStats = addToStats(state.stats, [action.stats])
  let currTime = action.stats.generatedAt
  let alerts = state.alerts
  if (twoMinuteElapsed(currTime, lastAlert)) {
    var newAverage = twoMinuteAverage(newStats)
    alerts = generateAlertIfNeeded(lastAverage, newAverage, alerts)
    lastAverage = newAverage
    lastAlert = currTime
  }
  return {
    toggle: state.toggle,
    stats: newStats,
    alerts: alerts,
    lastAverage: lastAverage,
    lastAlert: lastAlert
  }
}

const getNow = () => {
  const today = new Date()
  const date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate()
  const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
  return (date + ' ' + time)
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RECEIVE_LOAD_STATS]: (state, action) => (generateState(state, action)),
  [TOGGLE_STREAM]: (state, action) => (
    {
      toggle: action.toggle,
      stats: state.stats,
      alerts: state.alerts,
      lastAverage: state.lastAverage,
      lastAlert: state.lastAlert
    })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { toggle:true, stats:[], alerts: [], lastAlert:getNow(), lastAverage: 0 }
export default function loadStatsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
