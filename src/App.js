import {useState, useRef} from 'react'
import {normal} from 'randtools'
import InputComponent from "./components/InputComponent";
import './App.css';
import StatsComponent from "./components/StatsComponent";
import BarWrapperComponent from "./components/BarWrapperComponent";


const App = () => {
  const today = new Date()
  const [total, setTotal] = useState({})
  const [stats, setStats] = useState({})
  const [bottomStats, setBottomStats] = useState({worst: '', best: '', mean: '', sigma: '', s1: '', s2: ''})
  const [currency, setCurrency] = useState("SEK")
  const selectCurrency = useRef('SEK')
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

  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  }

  const swedishTax = (monthly) => {
    if (monthly <= 10000) {
      return 0.15
    } else if (80000 <= monthly && monthly < 100000) {
      return 0.4
    } else if (100000 <= monthly) {
      return 0.45
    } else {
      return (30.7 + 14.3 * Math.sin(0.0000256 * monthly - 1.3)) / 100
    }
  }

  const calcMeanAndSigma = (arr) => {
    const mean = Math.round(arr.reduce((sum, w) => sum + w) / arr.length)
    const sigma = Math.round(Math.sqrt(arr.reduce((sum, w) => sum + Math.pow(w - mean, 2), 0) / (arr.length - 1)))
    return {mean: mean, sigma: sigma}
  }

  const analyse = (iterations) => {
    const todayYear = today.getFullYear()
    const current = parseFloat(inputCapital.current.value) || 0
    const fees = parseFloat(inputFees.current.value) || 0
    const inflation = parseFloat(inputInflation.current.value) || 0
    const roi = parseFloat(inputROI.current.value) || 0
    const deviation = parseFloat(inputDeviation.current.value) || 0
    const salaryInc = 1 + parseFloat(inputSalaryInc.current.value) / 100 || 1
    const costsInc = 1 + parseFloat(inputCostsInc.current.value) / 100 || 1
    const workingYears = Math.max(inputRetireAt.current.value - inputAge.current.value, 0)
    let totalsCombinedData = []
    let finalWorth = []
    let avgWorth = [current * iterations]
    let statsData = {sigmas: [], outcomes: []}

    // perform monte carlo iterations
    let k = 1
    do {
      let salary = parseFloat(inputSalary.current.value) || 0
      let costs = parseFloat(inputCosts.current.value) || 0

      let totalsData = new Object({
        years: [todayYear],
        worth: [current],
        salaryWorth: [Math.round((salary * (1 - swedishTax(salary)) - costs) * 12)],
        fees: [Math.round((salary - costs)) * 12 * (fees + inflation)/ 100]
      })

      let i = 0
      while (++i < parseFloat(inputDuration.current.value)) {
        const len = totalsData.years.length
        const netSalary = workingYears && workingYears < i ? -costs * 12 : (salary * (1 - swedishTax(salary)) - costs) * 12
        const netTotal = Math.round((netSalary + totalsData.worth[len - 1]) * (1 + (normal.mean(roi, deviation) - (fees + inflation))/ 100))

        totalsData.years.splice(len, 0, todayYear + i)
        totalsData.salaryWorth.splice(len, 0, workingYears && workingYears < i ? totalsData.salaryWorth[len - 1] : Math.round(netSalary + totalsData.salaryWorth[len - 1]))
        totalsData.worth.splice(len, 0, netTotal)
        totalsData.fees.splice(len, 0, Math.round((netSalary + totalsData.worth[len - 1]) * (fees + inflation)/ 100))

        avgWorth[i] = (avgWorth[i] || 0) + netTotal
        salary = salary * salaryInc
        costs = costs * costsInc
      }

      finalWorth.splice(finalWorth.length, 0, totalsData.worth[i - 1])
      totalsCombinedData.splice(totalsCombinedData.length, 0, totalsData)
    } while (k++ < iterations)

    finalWorth.sort((a, b) => a - b)
    avgWorth = avgWorth.map(d => Math.round(d / totalsCombinedData.length))

    // calculate normal distribution
    const {mean, sigma} = calcMeanAndSigma(finalWorth)
    let deviations = {}

    finalWorth.forEach(w => {
      const diff = mean - w
      const deviationNumber = diff > 0 ? Math.ceil(diff / sigma) : Math.floor(diff / sigma)
      deviations[deviationNumber] = deviations[deviationNumber] ? deviations[deviationNumber] + 1 : 1
    })

    Object.keys(deviations).sort((a, b) => a - b).forEach(k => {
      statsData.sigmas.splice(statsData.sigmas.length, 0, k)
      statsData.outcomes.splice(statsData.outcomes.length, 0, deviations[k])
    })

    // update GUI
    setBottomStats({
      best: [finalWorth[finalWorth.length - 1], currency],
      worst: [finalWorth[0], currency],
      mean: [mean, currency],
      sigma: [sigma, currency],
      s1: [(100 * ((deviations['-1'] || 0) + (deviations['1'] || 0)) / totalsCombinedData.length).toPrecision(4), '%'],
      s2: [(100 * ((deviations['-1'] || 0) + (deviations['1'] || 0) + (deviations['-2'] || 0) + (deviations['2'] || 0)) / totalsCombinedData.length).toPrecision(4), '%']
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
          <header className="flex-between">
            <h1>Financial planner</h1>
            <select ref={selectCurrency} onChange={() => setCurrency(selectCurrency.current.value)}>
              <option value="SEK">SEK</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </header>
          <br></br>
          <InputComponent text="Your age:" unit="Yrs" ref={inputAge} options={{type: 'text', maxLength: 2, defaultValue: 25}}/>
          <InputComponent text="Retirement age:" unit="Yrs" ref={inputRetireAt} options={{type: 'text', maxLength: 2, defaultValue: 45}}/>
          <InputComponent text="Duration to analyze:" unit="Yrs" ref={inputDuration} options={{type: 'text', maxLength: 2, defaultValue: 25}}/>
          <InputComponent text="Starting capital:" unit={currency} ref={inputCapital} options={{defaultValue: 250000}}/>
          <hr/>
          <InputComponent text="Monthly gross salary:" unit={currency} ref={inputSalary} options={{defaultValue: 32000}}/>
          <InputComponent text="Annual salary increase:" unit="%" ref={inputSalaryInc} options={{type: 'percent', defaultValue: 5}}/>
          <InputComponent text="Monthly costs:" unit={currency} ref={inputCosts} options={{defaultValue: 12000}}/>
          <InputComponent text="Annual costs increase:" unit="%" ref={inputCostsInc} options={{type: 'percent', defaultValue: 5}}/>
          <hr/>
          <InputComponent text="Annual ROI excl. fees:" unit="%" ref={inputROI} options={{type: 'percent', defaultValue: 10.5}}/>
          <InputComponent text="Standard deviation:" unit="%" ref={inputDeviation} options={{type: 'percent', defaultValue: 16}}/>
          <InputComponent text="Annual fees:" unit="%" ref={inputFees} options={{type: 'percent', defaultValue: 3}}/>
          <InputComponent text="Inflation:" unit="%" ref={inputInflation} options={{type: 'percent', defaultValue: 2}}/>
          <hr/>
          <span className="flex-rows flex-between">
            <InputComponent text="Iterations:" unit='' ref={inputIterations} options={{type: 'text', maxLength: 6, defaultValue: 1000}}/>
            <button onClick={() => analyse(inputIterations.current.value)}>Run Analysis</button>
          </span>
          <hr/>
          {bottomStats.best &&
            <div className="flex-cols">
              {Object.keys(bottomStats).map(s => <StatsComponent text={s.capitalize() + ':'} stat={bottomStats[s.toLowerCase()]}/>)}
            </div>
          }
        </div>
        <div className="flex-cols">
          <BarWrapperComponent title='Expected returns' data={total} yLabel={currency}/>
          <BarWrapperComponent title='Standard deviations' data={stats} yLabel={currency}/>
        </div>
      </div>
      <footer>
        <hr/>
        All Rights Reserved Emanuel Slätteby 2021
      </footer>
    </div>
  );
}

export default App;