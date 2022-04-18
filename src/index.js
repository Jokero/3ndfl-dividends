const dividends = require('../dividends.json')
const addDividends = require('./addDividends')
const { addSourceButtonClasses, sourcesListClasses, countriesMap, currenciesMap } = require('./constants')

addDividends(dividends, addSourceButtonClasses, sourcesListClasses, countriesMap, currenciesMap)