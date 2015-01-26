//author:  https://github.com/nick
//project: https://github.com/nick/react-styl

// let styl = require('styl')
// let strip = require('strip-indent')

let _styles = ""

  // .webcomp {
  //   color: blue;
  //   background: yellow;
  //   float: center;
  //   display: inline-block;
  //   padding: 5px;
  // }
  // .webcomp:hover {
  //   background: red;
  // }

module.exports = {
  setStyle(styles) {
    _styles += styles;
    // _styles += strip(styles);
  },
  addStylesheet() {
    let css = styl(_styles, { whitespace: true }).toString()
    let style = document.createElement('style')
    style.type = 'text/css'
    if (style.styleSheet) {
      style.styleSheet.cssText = css
    }
    else {
      style.appendChild(document.createTextNode(css))
    }
    document.head.appendChild(style)
  }
}
