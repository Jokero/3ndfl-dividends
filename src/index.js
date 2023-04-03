const dividends = require('../dividends.json')
const addDividends = require('./addDividends')
const { countriesMap, currenciesMap } = require('./constants')

addDividends(dividends, countriesMap, currenciesMap)