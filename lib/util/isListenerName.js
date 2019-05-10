export default function isListenerName (name) {
  return /^on/i.test(name)
}
