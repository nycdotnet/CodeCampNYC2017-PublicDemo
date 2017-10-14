QUnit.module("ShoppingCartCtrl Tests");

QUnit.test("Tests run.", function (assert) {
    assert.ok(1 === 1, "Tests are running.");
});

QUnit.test("Shopping cart starts empty.", function (assert) {
    var cart = new ShoppingCartCtrl();
    assert.strictEqual(cart.shoppingCart.length, 0);
    assert.strictEqual(cart.cartHasItems(), false);
});

QUnit.test("Adding an item makes the cart have one item of that type.", function (assert) {
    var cart = new ShoppingCartCtrl();
    cart.addItem("Wireless Mouse");
    assert.strictEqual(cart.shoppingCart.length, 1);
    assert.strictEqual(cart.shoppingCart[0].quantity, 1);
    assert.strictEqual(cart.cartHasItems(), true);
});

QUnit.test("Adding more of the same item makes the cart still have one item but higher quantity.", function (assert) {
    var cart = new ShoppingCartCtrl();
    cart.addItem("Wireless Mouse");
    cart.addItem("Wireless Mouse");
    assert.strictEqual(cart.shoppingCart.length, 1);
    assert.strictEqual(cart.shoppingCart[0].quantity, 2);
});
