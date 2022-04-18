const dividends = require('../dividends.json')
const addDividends = require('./addDividends')
const { sourcesListSelector, countriesMap, currenciesMap } = require('./constants')

addDividends(dividends, sourcesListSelector, countriesMap, currenciesMap)