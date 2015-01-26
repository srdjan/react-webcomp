const React = require('react')
const registerReact = require('./reactive-elements')

let items = [
    { name: 'Raven'},
    { name: 'Dove'},
    { name: 'Hawk'},
    { name: 'Colibri'}
  ]

let style = {
              color: 'blue',
              background: 'yellow',
              float: 'center'
            }

let Webcomp = React.createClass({
  componentWillMount() {
    //-- get user store
    for(let prop in this.props.config.style) {
      style[prop] = this.props.config.style[prop]
    }
  },
  render() {
    return  <div style={style}>
              <h2>{this.props._content.innerHTML}</h2>
              <ul>
                {items.map(i => <li key={i.name}>{i.name}</li>)}
              </ul>
            </div>
  }
})

document.registerReact('react-webcomp', Webcomp)
