import {useState, useRef} from 'react'
import {Bar} from 'react-chartjs-2';
import {normal} from 'randtools'
import './App.css';


const App = () => {
  const today = new Date()
  const [total, setTotal] = useState({})
  const [stats, setStats] = useState({})
  const [bottomStats, setBottomStats] = useState({worst: '', best: '', mean: '', sigma: '', oneDev: '', twoDev: ''})
  const [currency, setCurrency] = useState("SEK")
  const selectCurrency = useRef(null)
  const inputAge = useRef(null)
  const inputRetireAt = useRef(null)
  const inputCapital = useRef(null)
  const inputDuration = useRef(null)
  const inputSalary = useRef(null)
  const inputSalaryInc = useRef(null)
  const inputCosts = useRef(null)
  const inputCostsInc = useRef(null)
  const inputROI = useRef(null)
  const inputDeviation = useRef(null)
  const inputFees = useRef(null)
  const inputInflation = useRef(null)
  const inputIterations = useRef(null)

  const swedishTax = (monthly) => {
    if (monthly <= 10000) {
      return 0.15
    } else if (80000 <= monthly && monthly < 100000) {
      return 0.4
    } else if (100000 < monthly) {
      return 0.45
    } else {
      return (30.7 + 14.3 * Math.sin(0.0000256 * monthly - 1.3)) / 100
    }
  }

  const analyse = (iterations) => {
    const current = parseFloat(inputCapital.current.value) || 0
    const fees = parseFloat(inputFees.current.value) || 0
    const inflation = parseFloat(inputInflation.current.value) || 0
    const roi = parseFloat(inputROI.current.value) || 0
    const deviation = parseFloat(inputDeviation.current.value) || 0
    const salaryInc = 1 + parseFloat(inputSalaryInc.current.value) / 100 || 1
    const costsInc = 1 + parseFloat(inputCostsInc.current.value) / 100 || 1
    const todayYear = today.getFullYear()
    let totalsCombinedData = []
    let statsData = {sigmas: [], outcomes: []}
    const workingYears = Math.max(parseInt(inputRetireAt.current.value - inputAge.current.value), 0)

    let k = 1
    do {
      let salary = parseFloat(inputSalary.current.value) || 0
      let costs = parseFloat(inputCosts.current.value) || 0
      let totalsData = new Object({
        years: [todayYear],
        worth: [current],
        salaryWorth: [Math.round((salary - costs) * 12)],
        fees: [Math.round((salary - costs)) * 12 * (fees + inflation)/ 100]
      })

      let i = 0
      while (++i < parseFloat(inputDuration.current.value)) {
        const len = totalsData.years.length
        const netSalary = workingYears && workingYears < i ? -costs * 12 : (salary * (1 - swedishTax(salary)) - costs) * 12
        totalsData.years.splice(len, 0, todayYear + i)
        totalsData.salaryWorth.splice(len, 0, workingYears && workingYears < i ? totalsData.salaryWorth[len - 1] : Math.round(netSalary + totalsData.salaryWorth[len - 1]))
        totalsData.worth.splice(len, 0, Math.round((netSalary + totalsData.worth[len - 1]) * (1 + (normal.mean(roi, deviation) - (fees + inflation))/ 100)))
        totalsData.fees.splice(len, 0, Math.round((netSalary + totalsData.worth[len - 1]) * (fees + inflation)/ 100))
        salary = salary * salaryInc
        costs = costs * costsInc
      }

      totalsCombinedData.splice(totalsCombinedData.length, 0, totalsData)
    } while (k++ < iterations)

    let avgWorth = []
    let lastWorth = []
    totalsCombinedData.forEach(d => {
      lastWorth.splice(lastWorth.length, 0, d.worth[d.worth.length - 1])
      d.worth.forEach((_d, i) => avgWorth[i] = ((avgWorth[i] || 0) + _d))
    })
    lastWorth.sort((a, b) => a - b)
    avgWorth = avgWorth.map(d => Math.round(d / totalsCombinedData.length))

    const mean = Math.round(lastWorth.reduce((sum, w) => sum + w) / lastWorth.length)
    const sigma = Math.round(Math.sqrt(lastWorth.reduce((sum, w) => sum + Math.pow(w - mean, 2), 0) / (lastWorth.length - 1)))

    let deviations = {}
    lastWorth.forEach(w => {
      const diff = mean - w
      const deviationNumber = diff > 0 ? Math.ceil(diff / sigma) : Math.floor(diff / sigma)
      deviations[deviationNumber] = deviations[deviationNumber] ? deviations[deviationNumber] + 1 : 1
    })

    Object.keys(deviations).sort((a, b) => a - b).forEach(k => {
      statsData.sigmas.splice(statsData.sigmas.length, 0, k)
      statsData.outcomes.splice(statsData.outcomes.length, 0, deviations[k])
    })

    setBottomStats({
      best: lastWorth[lastWorth.length - 1],
      worst: lastWorth[0],
      mean: mean,
      sigma: sigma,
      oneDev: (100 * ((deviations['-1'] || 0) + (deviations['1'] || 0)) / totalsCombinedData.length).toPrecision(4),
      twoDev: (100 * ((deviations['-1'] || 0) + (deviations['1'] || 0) + (deviations['-2'] || 0) + (deviations['2'] || 0)) / totalsCombinedData.length).toPrecision(4)
    })

    setTotal({
      labels: totalsCombinedData[0].years,
      datasets: [
        {
          label: 'Total',
          backgroundColor: 'darkslateblue',
          borderColor: 'rgba(0,0,0,1)',
          borderWidth: 2,
          data: avgWorth
        },
        {
          label: 'Invested',
          backgroundColor: 'rgba(0,192,0,1)',
          borderColor: 'rgba(0,0,0,1)',
          borderWidth: 2,
          data: totalsCombinedData[0].salaryWorth
        },
        {
          label: 'Fees & Inflation',
          backgroundColor: 'rgba(192,0,0,1)',
          borderColor: 'rgba(0,0,0,1)',
          borderWidth: 2,
          data: totalsCombinedData[0].fees
        }
      ]
    })

    setStats({
      labels: statsData.sigmas,
      datasets: [
        {
          label: 'Outcomes',
          backgroundColor: 'darkslateblue',
          borderColor: 'rgba(0,0,0,1)',
          borderWidth: 2,
          data: statsData.outcomes
        },
      ]
    })
  }

  return (
    <div className="App flex-center">
      <div className="wrapper flex-rows">
        <div className="finance-inputs">
          <span>
            <h1>Financial planner</h1>
            <select ref={selectCurrency} onChange={() => setCurrency(selectCurrency.current.value)}>
              <option value="SEK">SEK</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </span>
          <br></br>
          <span>
            <p>Your age:</p><input ref={inputAge}  type="text" maxLength={2} defaultValue="25"/><p>Yrs</p>
          </span>
          <span>
            <p>Retirement age:</p><input ref={inputRetireAt}  type="text" maxLength={2} defaultValue="45"/><p>Yrs</p>
          </span>
          <span>
            <p>Duration to analyze:</p><input ref={inputDuration} type="text" maxLength={2} defaultValue="25"/><p>Yrs</p>
          </span>
          <span>
            <p>Starting capital:</p><input ref={inputCapital} type="number" defaultValue="250000"/><p>{currency}</p>
          </span>
          <hr/>
          <span>
            <p>Monthly gross salary:</p><input ref={inputSalary} type="number" defaultValue="32000"/><p>{currency}</p>
          </span>
          <span>
            <p>Annual salary increase:</p><input ref={inputSalaryInc} type="percent" defaultValue="5"/><p>%</p>
          </span>
          <span>
            <p>Monthly costs:</p><input ref={inputCosts} type="number" defaultValue="12000"/><p>{currency}</p>
          </span>
          <span>
            <p>Annual cost increase:</p><input ref={inputCostsInc } type="percent" defaultValue="3"/><p>%</p>
          </span>
          <hr/>
          <span>
            <p>Annual ROI excl. fees:</p><input ref={inputROI} type="percent" defaultValue="11.5"/><p>%</p>
          </span>
          <span>
            <p>Standard deviation:</p><input ref={inputDeviation} type="percent" defaultValue="15"/><p>%</p>
          </span>
          <span>
            <p>Annual fees:</p><input ref={inputFees} type="percent" defaultValue="3"/><p>%</p>
          </span>
          <span>
            <p>Inflation:</p><input ref={inputInflation} type="percent" defaultValue="2"/><p>%</p>
          </span>
          <hr/>
          <span>
            <span className="flex-center">
              <p>Iterations:</p><input ref={inputIterations} type="text" maxLength={5} defaultValue="1000"/>
            </span>
            <button onClick={() => analyse(inputIterations.current.value)}>Run Analysis</button>
          </span>
          <hr/>
          {bottomStats.best &&
          <div className="bottom-stats flex-cols">
            <span>
              <p>Best:</p><p>{bottomStats.best.toLocaleString().replaceAll(",", " ")} ({currency.toLowerCase()})</p>
            </span>
            <span>
              <p>Worst:</p><p>{bottomStats.worst.toLocaleString().replaceAll(",", " ")} ({currency.toLowerCase()})</p>
            </span>
            <span>
              <p>Mean:</p><p>{bottomStats.mean.toLocaleString().replaceAll(",", " ")} ({currency.toLowerCase()})</p>
            </span>
            <span>
              <p>Sigma:</p><p>{bottomStats.sigma.toLocaleString().replaceAll(",", " ")} ({currency.toLowerCase()})</p>
            </span>
            <span>
              <p>s=1:</p><p>{bottomStats.oneDev}%</p>
            </span>
            <span>
              <p>s=2:</p><p>{bottomStats.twoDev}%</p>
            </span>
          </div>}
        </div>
        <div className="flex-cols">
          <Bar
            data={total}
            options={{
              title:{
                display: true,
                text: 'Expected returns',
                fontSize: 20
              },
              scales: {
                yAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: currency
                  }
                }]
              },
              legend:{
                display: true,
                position: 'right'
              }
            }}
          />
          <Bar
            data={stats}
            options={{
              title:{
                display: true,
                text: 'Normal distribution',
                fontSize: 20
              },
              scales: {
                xAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: 'Standard deviations'
                  }
                }],
                yAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: currency
                  }
                }]
              },
              legend:{
                display: true,
                position: 'right'
              }
            }}
          />
        </div>
      </div>
      <footer>
        All Rights Reserved Emanuel Slätteby 2021
      </footer>
    </div>
  );
}

export default App;