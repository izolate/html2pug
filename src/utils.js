// Extend an object (a) with the values of another (b)
module.exports.extend = (a, b) => {
  Object.keys(b).forEach(key => {
    a[key] = b[key]
  })
  return a
}
