//todo: embed styles
//todo: allow external style changes (position?)
const React = require('react')
const registerReact = require('./reactive-elements')

function updateStyles() {
  [].slice.call(document.querySelectorAll('.checkout')).forEach(function(el) {
    var openCtrl = el.querySelector('.checkout-button');
    openCtrl.addEventListener('click', function(ev) {
      ev.preventDefault();
      el.classList.add('checkout--active');
    });

    var closeCtrls = el.querySelectorAll('.checkout-cancel');
    [].slice.call(closeCtrls).forEach(function(ctrl) {
      ctrl.addEventListener('click', function() {
        el.classList.remove('checkout--active');
      });
    });
  });
}

let ShopCart = React.createClass({
  componentDidMount() {
    updateStyles()
  },
  render() {
    return (
      <div className="checkout">
        <a className="checkout-button" href="#"><img className="value-img" src="images/calculator.svg"/></a>
        <div className="checkout-order">
          <div className="checkout-order-inner">
            <table className="checkout-summary">
              <thead>
                <tr><th>Your Order</th><th>Price</th></tr>
              </thead>
              <tfoot>
                <tr><th colSpan="2">Total <span className="checkout-total">$56.20</span></th></tr>
              </tfoot>
              <tbody>
                <tr><td>Imitations <span>Mark Lanegan</span></td><td>$9.90</td></tr>
                <tr><td>In The Silence <span>Ásgeir</span></td><td>$5.50</td></tr>
                <tr><td>Out Of Exile <span>Audioslave</span></td><td>$11.00</td></tr>
                <tr><td>London <span>Frank Sinatra</span></td><td>$19.90</td></tr>
                <tr><td>Cure For Pain <span>Morphine</span></td><td>$9.90</td></tr>
              </tbody>
            </table>
            <button className="checkout-option checkout-cancel">Close</button>
            <button className="checkout-option">Save</button>
          </div>
        </div>
      </div>
  )}
})

document.registerReact('react-shopcart', ShopCart)
// React.render(<ShopCart/>, document.getElementById('shopcart'))
