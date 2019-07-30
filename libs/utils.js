const floorToFixed = (n, precision) => precision > 0 ? Math.floor(n * Math.pow(10, precision)) / Math.pow(10, precision) : NaN

module.exports = {
  floorToFixed
}
