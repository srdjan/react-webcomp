// http://pixelscommander.com/en/interactive-revolution/web-components-and-react-js-with-reactiveelements/
// http://addyosmani.com/blog/component-interop-with-react-and-custom-elements/
const React = require('react')
const registerReact = require('./reactive-elements')

let Webcomp = React.createClass({
  render() {
     return <div style={this.props.config.style}>
              <h2>{this.props._content.innerHTML}</h2>
              <ul>
                {this.props.config.items.map(i => <li key={i.name}>{i.name}</li>)}
              </ul>
            </div>
  }
})

document.registerReact('react-webcomp', Webcomp)
