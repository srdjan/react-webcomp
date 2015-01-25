const React = require('react')
const PROPERTY_DELIMITER_CHARACTERS = [':', '-', '_']

function extend(extandable, extending) {
  for (let i in extending) {
    if (extandable[i] === undefined) {
      if (typeof extending[i] === 'function') {
        extandable[i] = extending[i].bind(extending)
      } else {
        extandable[i] = extending[i]
      }
    }
  }
}

function getContentNodes(el) {
  let fragment = document.createElement('content')
  while(el.childNodes.length) {
    fragment.appendChild(el.childNodes[0])
  }
  return fragment
}

function getAllProperties(el, attributes) {
  let result = {}
  for (let i = 0; i < attributes.length; i++) {
    let attribute = attributes[i]
    let propertyName = attributeNameToPropertyName(attribute.name)
    result[propertyName] = parseAttributeValue(attributes[i].value)
  }

  result._content = el._content
  return result
}

function attributeNameToPropertyName(attributeName) {
  let result = attributeName.replace('x-', '').replace('data-', '')
  let delimiterIndex = -1

  while ((delimiterIndex = getNextDelimiterIndex(result)) !== -1) {
    result = result.slice(0, delimiterIndex) +
             result.charAt(delimiterIndex + 1).toUpperCase() +
             result.slice(delimiterIndex + 2, result.length)
  }
  return result
}

function getNextDelimiterIndex(string) {
  let result = -1
  for (let i = 0; i < PROPERTY_DELIMITER_CHARACTERS.length; i++) {
    let char = PROPERTY_DELIMITER_CHARACTERS[i]
    result = string.indexOf(char)
    if (result !== -1) {
        break
    }
  }
  return result
}

function parseAttributeValue(value) {
  let regexp = /\{.*?\}/g
  let matches = value.match(regexp)
  if (matches !== null && matches !== undefined && matches.length > 0) {
    value = eval(matches[0].replace('{', '').replace('}', ''))
  }
  return value
}

function getterSetter(variableParent, variableName, getterFunction, setterFunction) {
  if (Object.defineProperty) {
    Object.defineProperty(variableParent, variableName, {
        get: getterFunction,
        set: setterFunction
    })
  }
  else if (document.__defineGetter__) {
    variableParent.__defineGetter__(variableName, getterFunction)
    variableParent.__defineSetter__(variableName, setterFunction)
  }

  variableParent["get" + variableName] = getterFunction
  variableParent["set" + variableName] = setterFunction
}

// //Mozilla bind polyfill
// if (!Function.prototype.bind) {
//   Function.prototype.bind = function (oThis) {
//     if (typeof this !== "function") {
//       // closest thing possible to the ECMAScript 5 internal IsCallable function
//       throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable")
//     }

//     let aArgs = Array.prototype.slice.call(arguments, 1)
//     let fToBind = this
//     let fNOP = function () { }
//     let fBound = function () {
//           return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
//                                aArgs.concat(Array.prototype.slice.call(arguments)))
//     }
//     fNOP.prototype = this.prototype
//     fBound.prototype = new fNOP()
//     return fBound
//   }
// }

function registerReact(elementName, reactClass) {
  let registrationFunction = (document.registerElement || document.register).bind(document)
  if (registrationFunction === undefined) {
    console.log('registrationFunction === undefined')
    return
  }

  let elementPrototype = Object.create(HTMLElement.prototype)
  elementPrototype.createdCallback = function () {
    this._content = getContentNodes(this)
    let reactElement = React.createElement(reactClass, getAllProperties(this, this.attributes))

    //Since React v0.12 API was changed, so need a check for current API
    this.reactiveElement = React.render(reactElement, this)
    extend(this, this.reactiveElement)
    getterSetter(this, 'props', () => this.reactiveElement.props, value => this.reactiveElement.setProps(value))
  }
  elementPrototype.attributeChangedCallback = function () {
    this.reactiveElement.props = getAllProperties(this, this.attributes)
    this.reactiveElement.forceUpdate()
  }

  registrationFunction(elementName, { prototype: elementPrototype })
}

global.document.registerReact = registerReact
if (global.xtag !== undefined) {
  global.xtag.registerReact = registerReact
}
