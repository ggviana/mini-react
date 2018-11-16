var App = (function ({ Component, node }) {

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      definedLimit: 2500,
      maxLimit: 5000
    }
  }

  setDefinedLimit (e) {
    this.setState((prevState) => ({
      definedLimit: parseInt(e.target.value)
    }))
  }

  render () {
    const {
      maxLimit,
      definedLimit
    } = this.state

    return node({
      tagName: 'div',
      props: {
        className: 'page'
      },
      children: [
        node({
          tagName: 'h1',
          textContent: 'Ajuste de limite'
        }),
        node({
          tagName: 'input',
          type: 'text',
          value: definedLimit,
          onchange: e => this.setDefinedLimit(e)
        }),
        node({
          componentClass: LimitLabel,
          props: {
            maxLimit,
            definedLimit
          }
        }),
        node({
          tagName: 'input',
          type: 'range',
          min: 0,
          max: maxLimit,
          value: definedLimit,
          onchange: e => this.setDefinedLimit(e)
        })
      ]
    })
  }
}

class LimitLabel extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const {
      maxLimit,
      definedLimit
    } = this.props

    return node({
      tagName: 'p',
      children: [
        node({
          componentClass: Currency,
          props: {
            value: maxLimit - definedLimit
          }
        }),
        node(' disponíveis')
      ]
    })
  }
}

class Currency extends Component {
  render () {
    const [, integer, cents] = this.props.value.toFixed(2).match(/(\d+)\.(\d+)/)

    return node({
      tagName: 'span',
      className: 'currency',
      children: [
        node({
          tagName: 'span',
          className: 'currency-symbol',
          textContent: 'R$ '
        }),
        node({
          tagName: 'span',
          className: 'currency-integer',
          textContent: `${integer}`
        }),
        node({
          tagName: 'span',
          className: 'currency-cents',
          textContent: `,${cents}`
        })
      ]
    })
  }
}

return App
}(MiniReact));
