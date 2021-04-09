import {useState, useRef, useEffect} from 'react'
import {normal} from 'randtools'
import './App.css';
import InputComponent from "./input/InputComponent";
import StatsComponent from "./stats/StatsComponent";
import ChartWrapperComponent from "./chart-wrapper/ChartWrapperComponent";
import AddExtrasComponent from "./add-extras/AddExtrasComponent";
import ExtraComponent from "./extra/ExtraComponent";
import TaxComponent from "./tax/TaxComponent";
import SettingsComponent from "./settings/SettingsComponent";
import {SettingsContext} from "../SettingsContext";


const App = () => {
  const today = new Date()
  const todayYear = today.getFullYear()
  const todayMonth = today.getMonth()

  const [total, setTotal] = useState({})
  const [stats, setStats] = useState({})
  const [expenses, setExpenses] = useState({})
  const [settings, setSettings] = useState({currency: 'SEK'})
  const [extras, setExtras] = useState([])
  const [bottomStats, setBottomStats] = useState({worst: '', best: '', mean: '', median: '', sigma: '', s1: '', s2: ''})

  const inputAge = useRef(null)
  const inputRetireAt = useRef(null)
  const inputCapital = useRef(null)
  const inputDuration = useRef(null)
  const inputTax = useRef(null)
  const inputSalary = useRef(null)
  const inputSalaryInc = useRef(null)
  const inputCosts = useRef(null)
  const inputCostsInc = useRef(null)
  const inputROI = useRef(null)
  const inputDeviation = useRef(null)
  const inputFees = useRef(null)
  const inputInflation = useRef(null)

  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  }

  const calcTax = (monthly) => {
    return inputTax.current?.radio.checked ? Math.max(parseFloat(inputTax.current.input.value) / 100, 0) || 0 : swedishTax(monthly)
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

  const calcMeanMedianSigma = (arr) => {
    const mean = Math.round(arr.reduce((sum, w) => sum + w) / arr.length)
    const median = arr[Math.floor(arr.length / 2)]
    const sigma = Math.round(Math.sqrt(arr.reduce((sum, w) => sum + Math.pow(w - mean, 2), 0) / (arr.length - 1)))
    return {mean: mean, median: median, sigma: sigma}
  }

  const calcAnnualExtras = (input) => {
    let xtras = Array(Math.max(parseInt(inputDuration.current?.value), 0)).fill(0)

    input.map(xtra => {
      xtra.period.map((p, i) => {
        let amount = xtra.annual
        const index = Math.max(p - todayYear, 0)

        if (i === 0) {
          amount += xtra.first
        } else if (i === xtra.period.length - 1) {
          amount += xtra.last
        }
        xtras[index] += amount
      })
    })
    return xtras
  }

  const addExtra = (extra) => {
    if (extra) {
      setExtras([extra, ...extras])
    }
  }

  const removeExtra = (id) => {
    setExtras(extras.filter(x => x.id !== id))
  }

  const analyse = (iterations) => {
    const monthsLeft = Math.max(11 - todayMonth, 0)
    const current = parseFloat(inputCapital.current?.value) || 0
    const fees = parseFloat(inputFees.current?.value) || 0
    const inflation = parseFloat(inputInflation.current?.value) || 0
    const roi = parseFloat(inputROI.current?.value) || 0
    const deviation = parseFloat(inputDeviation.current?.value) || 0
    const salaryInc = 1 + parseFloat(inputSalaryInc.current?.value) / 100 || 1
    const costsInc = 1 + parseFloat(inputCostsInc.current?.value) / 100 || 1
    const workingYears = Math.max(inputRetireAt.current?.value - inputAge.current?.value, 0)
    const annualExtras = calcAnnualExtras(extras)
    const precision = Math.min(1 / settings.precision, 1)
    const inSalary = Math.max(parseFloat(inputSalary.current?.value), 0) || 0
    const inCosts = Math.max(parseFloat(inputCosts.current?.value), 0) || 0
    const investedFirstYear = Math.round(Math.max((inSalary * (1 - calcTax(inSalary)) - inCosts) * monthsLeft, 0))
    let totalsCombinedData = []
    let finalWorth = []
    let avgWorth = [(current + investedFirstYear + (annualExtras[0] < 0 ? -annualExtras[0] : 0)) * iterations]
    let statsData = {sigmas: [], outcomes: []}

    // perform monte carlo iterations
    let k = 1
    do {
      let salary = Math.max(inSalary, 0) || 0
      let costs = Math.max(inCosts, 0) || 0

      let totalsData = new Object({
        years: [todayYear],
        worth: [current + investedFirstYear - annualExtras[0]],
        invested: [investedFirstYear],
        fees: [Math.max(Math.round((salary - costs)) * 12 * (fees + inflation)/ 100, 0)],
        expenses: [Math.max(costs * monthsLeft + (annualExtras[0] < 0 ? -annualExtras[0] : 0), 0)]
      })

      let i = 0
      while (++i < parseFloat(inputDuration.current?.value)) {
        const len = totalsData.years.length
        const toInvest = workingYears && workingYears < i ? -costs * 12 : (salary * (1 - calcTax(salary)) - costs) * 12
        const totalsBeforeFees = toInvest + totalsData.worth[len - 1] + annualExtras[i]
        const netTotal = Math.round(totalsBeforeFees * (1 + (normal.mean(roi, deviation, 3) - (fees + inflation))/ 100))

        totalsData.years.push(todayYear + i)
        totalsData.invested.push(workingYears && workingYears < i ? totalsData.invested[len - 1] : Math.round(Math.max(toInvest + totalsData.invested[len - 1], 0)))
        totalsData.worth.push(netTotal)
        totalsData.fees.push(Math.round(Math.max(totalsBeforeFees * (fees + inflation)/ 100, 0)))
        totalsData.expenses.push(Math.round(Math.max(costs * 12 + (annualExtras[i] < i ? -annualExtras[i] : i), 0)))

        avgWorth[i] = (avgWorth[i] || 0) + netTotal
        salary = Math.max(salary * salaryInc, 0)
        costs = Math.max(costs * costsInc ,0)
      }

      finalWorth.push(totalsData.worth[i - 1])
      totalsCombinedData.push(totalsData)
    } while (k++ < iterations)

    finalWorth.sort((a, b) => a - b)
    avgWorth = avgWorth.map(d => Math.round(d / totalsCombinedData.length))

    // calculate distribution
    const {mean, median, sigma} = calcMeanMedianSigma(finalWorth)
    let deviations = {x: [], no: []}
    finalWorth.forEach(w => {
      const diff = mean - w
      const x = diff > 0 ? Math.ceil(diff / (sigma * precision)) : Math.floor(diff / (sigma * precision))
      const deviationNumber = diff > 0 ? Math.ceil(diff / sigma) : Math.floor(diff / sigma)
      deviations.x[x] = (deviations.x[x] || 1) + 1
      deviations.no[deviationNumber] = (deviations.no[deviationNumber] || 1) + 1
    })

    Object.keys(deviations.x).sort((a, b) => a - b).forEach(k => {
      statsData.sigmas.push(k)
      statsData.outcomes.push(deviations.x[k])
    })

    // update GUI
    setBottomStats({
      best: [finalWorth[finalWorth.length - 1], settings.currency],
      worst: [finalWorth[0], settings.currency],
      mean: [mean, settings.currency],
      median: [median, settings.currency],
      sigma: [sigma, settings.currency],
      s1: [(100 * ((deviations.no['-1'] || 0) + (deviations.no['1'] || 0)) / totalsCombinedData.length).toPrecision(4), '%'],
      s2: [(100 * ((deviations.no['-1'] || 0) + (deviations.no['1'] || 0) + (deviations.no['-2'] || 0) + (deviations.no['2'] || 0)) / totalsCombinedData.length).toPrecision(4), '%']
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
          data: totalsCombinedData[0].invested
        },
      ]
    })

    setExpenses({
      labels: totalsCombinedData[0].years,
      datasets: [
        {
          label: 'Fees & Inflation',
          backgroundColor: 'rgba(255,100,0,1)',
          borderColor: 'rgba(0,0,0,1)',
          borderWidth: 2,
          data: totalsCombinedData[0].fees
        },
        {
          label: 'Expenses',
          backgroundColor: 'rgba(192,0,0,1)',
          borderColor: 'rgba(0,0,0,1)',
          borderWidth: 2,
          data: totalsCombinedData[0].expenses
        }
      ]
    })

    setStats({
      labels: statsData.sigmas,
      datasets: [
        {
          backgroundColor: 'darkslateblue',
          borderColor: 'rgba(0,0,0,1)',
          borderWidth: 2,
          data: statsData.outcomes,
          pointRadius: 0
        },
      ]
    })
  }

  return (
    <SettingsContext.Provider value={{settings, setSettings}}>
      <div className="App flex-center">
        <header className="flex-center">
          <h1>Financial Simulator</h1>
        </header>
        <div className="wrapper flex-rows">
          <div className="finance-inputs">
            <br></br>
            <InputComponent text="Your age:" unit="Yrs" ref={inputAge} options={{type: 'text', maxLength: 2, defaultValue: 25}}/>
            <InputComponent text="Retirement age:" unit="Yrs" ref={inputRetireAt} options={{type: 'text', maxLength: 2, defaultValue: 45}}/>
            <InputComponent text="Duration to analyze:" unit="Yrs" ref={inputDuration} options={{type: 'text', maxLength: 2, defaultValue: 25}}/>
            <InputComponent text="Starting capital:" unit={settings.currency} ref={inputCapital} options={{defaultValue: 250000}}/>
            <hr/>
            <TaxComponent ref={inputTax}/>
            <hr/>
            <InputComponent text="Monthly gross salary:" unit={settings.currency} ref={inputSalary} options={{defaultValue: 32000}}/>
            <InputComponent text="Annual salary increase:" unit="%" ref={inputSalaryInc} options={{type: 'percent', defaultValue: 5}}/>
            <InputComponent text="Monthly costs:" unit={settings.currency} ref={inputCosts} options={{defaultValue: 12000}}/>
            <InputComponent text="Annual costs increase:" unit="%" ref={inputCostsInc} options={{type: 'percent', defaultValue: 2}}/>
            <hr/>
            <InputComponent text="Annual ROI excl. fees:" unit="%" ref={inputROI} options={{type: 'percent', defaultValue: 10.5}}/>
            <InputComponent text="Standard deviation:" unit="%" ref={inputDeviation} options={{type: 'percent', defaultValue: 16}}/>
            <InputComponent text="Annual fees:" unit="%" ref={inputFees} options={{type: 'percent', defaultValue: 3}}/>
            <InputComponent text="Inflation:" unit="%" ref={inputInflation} options={{type: 'percent', defaultValue: 2}}/>
            <hr/>
            <SettingsComponent/>
            <span className="flex-center">
              <button className="analyse-button" onClick={() => analyse(settings.iterations)}>Run Analysis</button>
            </span>
            <hr/>
            <h3>Add custom events:</h3>
            <AddExtrasComponent addExtra={addExtra} currency={settings.currency}/>
            <div className="extras">
              {(extras || []).map(extra => <ExtraComponent key={extra.id} extra={extra} currency={settings.currency} removeExtra={removeExtra}/>)}
            </div>
          </div>
          <div className="flex-cols">
            <ChartWrapperComponent type='bar' title='Total Assets' data={total} yLabel={settings.currency} legend={true}/>
            <ChartWrapperComponent type='bar' title='Annual Expenses' data={expenses} yLabel={settings.currency} legend={true}/>
            <ChartWrapperComponent type='bar' title='Distribution' data={stats}
                                   xLabel={settings.iterations ? `Sigma / ${settings.precision}` : 'Sigma'}
                                   yLabel={'No. Outcomes'} legend={false}/>
            {bottomStats.best &&
            <div className="bottom-stats">
              <h3>Statistics summary:</h3>
              <span className="flex-cols">
                {Object.keys(bottomStats).map((s, i) => <StatsComponent key={i} text={s.capitalize() + ':'} stat={bottomStats[s.toLowerCase()]}/>)}
              </span>
            </div>
            }
          </div>
        </div>
        <footer>
          <hr/>
          All Rights Reserved Emanuel Slätteby 2021
        </footer>
      </div>
    </SettingsContext.Provider>
  );
}

export default App;