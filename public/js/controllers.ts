
var shoppingCartDemo = angular.module('shoppingCartDemo', []);

shoppingCartDemo.controller('ShoppingCartCtrl', [ShoppingCartCtrl]);


function ShoppingCartCtrl(this: IShoppingCartCtrl) {
  var vm = this;

  vm.allProducts = [
    {name: "Wireless Mouse", price: 29.99},
    {name: "Fancy Keyboard", price: 54.95},
    {name: "Nice LCD Display", price: 269.95}
  ];

  vm.demoFor = "Code Camp NYC 2017 TypeScript!";

  vm.taxRate = Big('0.0875');

  vm.shoppingCart = [];

  vm.cartHasItems = function() {
    return vm.shoppingCart.length > 0;
  }

  vm.itemInCart = function(name: string) {
    return itemIndexInCart(name) > -1;
  }

  vm.addItem = function(name: string) {
    var info = productInfo(name);
    var item = getCartItem(name, info);
    item.quantity += 1;
    if (vm.shoppingCart.indexOf(item) === -1) {
      vm.shoppingCart.push(item);
    }
  }

  vm.removeItem = function(name: string) {
    var item = getCartItem(name);
    if (item.quantity === 0) {
      return;
    };
    item.quantity -= 1;
    if (item.quantity === 0) {
      removeCartItem(name)
    };
  }

  vm.subTotal = function() {
    var subTotal = Big(0);
    for (var i = 0; i < vm.shoppingCart.length; i += 1) {
       subTotal = subTotal.plus(vm.shoppingCart[i].subTotal());
    }
    return subTotal;
  }

  vm.taxes = function() {
    var taxes = Big(0);
    for (var i = 0; i < vm.shoppingCart.length; i += 1) {
       taxes = taxes.plus(vm.shoppingCart[i].subTotal().times(vm.taxRate).round(2));
    }
    return taxes;
  }

  vm.grandTotal = function() {
    return vm.taxes().plus(vm.subTotal());
  }

  vm.checkOut = function() {
    alert('You have been charged ' + vm.grandTotal().toFixed(2) + '.');
    reset();
  }

  vm.confirmReset = function() {
    var result = confirm("Are you sure?");
    if (result) {
      reset();
    }
  }

  function reset() {
    vm.shoppingCart.length = 0;
  }

  function productInfo(name: string) {
    for (var i = 0; i < vm.allProducts.length; i += 1) {
      if (vm.allProducts[i].name === name) {
        return vm.allProducts[i];
      }
    }
    return null;
  }

  function getCartItem(name: string, info: any = {}) {
    var index = itemIndexInCart(name);
    if (index > -1) {
      return vm.shoppingCart[index];
    }
    return {
      name: name,
      price: (info && info.price) ? Big(info.price) : Big(0),
      quantity: 0,
      subTotal: function subtotal() {
        return this.price.times(this.quantity);
      }
    };
  }

  function removeCartItem(name: string) {
    var index = itemIndexInCart(name);
    if (index > -1) {
      vm.shoppingCart.splice(index,1);
    }
  }

  function itemIndexInCart(name: string) {
    for (var i = 0; i < vm.shoppingCart.length; i += 1) {
      if (vm.shoppingCart[i].name === name) {
        return i;
      }
    }
    return -1;
  }

}


interface IShoppingCartCtrl {
  allProducts: IProductInfo[];
  demoFor: string;
  taxRate: BigJs.Big;
  subTotal: () => BigJs.Big;
  taxes: () => BigJs.Big;
  grandTotal: () => BigJs.Big;
  shoppingCart: IShopingCartItem[];
  cartHasItems: () => boolean;
  itemInCart: (name: string) => boolean;
  addItem: (name: string) => void;
  removeItem: (name: string) => void;
  checkOut: () => void;
  confirmReset: () => void;
}

interface IProductInfo {
  name: string;
  price: number;
}

interface IShopingCartItem {
  name: string;
  price: BigJs.Big;
  quantity: number;
  subTotal: () => BigJs.Big;
}
