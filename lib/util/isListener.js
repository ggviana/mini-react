export default function isListener (name) {
  return /^on/i.test(name)
}
