
Welcome!

I'm [Steve Ognibene](http://www.pluralsight.com/author/steve-ognibene) and I gave a talk at [Code Camp NYC 2015](http://www.codecampnyc.org/) on October 10, 2015 called *Introduction to TypeScript*.  In the talk, I showed how to convert an existing web project that uses JavaScript to TypeScript.

I've uploaded the starter project to this repository and provided basic instructions on how to convert it to TypeScript.  If you're interested to learn more, I've got a course on Pluralsight called [Practical TypeScript Migration](http://www.pluralsight.com/courses/typescript-practical-migration) that discusses getting started with TypeScript in an existing project in great detail.  It's appropriate for any web developer with an existing JavaScript code base, regardless of any frameworks used or back-end.

Thanks for reading!  If you like this, send me a tweet at [@nycdotnet](https://twitter.com/nycdotnet), or open an issue in this repo and say thanks!


## Editor
I use [atom](https://atom.io/), with the [atom-typescript](https://atom.io/packages/atom-typescript) plugin.  I use the Redmond [UI Theme](https://atom.io/themes/redmond-ui) and [Syntax Theme](https://atom.io/themes/redmond-syntax).  Note that the atom-typescript plugin takes a few minutes to download and install several dependencies after it's installed, so be patient until you see the toast indicating it's complete.

You'll also need to install the latest official [Node.js](https://nodejs.org/), which is 4.1.2 as of October 11, 2015.

## Get started

  * Clone this repository using Git, or click the "Download Zip" button and extract the archive to a folder.  Open that folder in atom using "File... Open Folder".
  * Open a command-prompt in that folder and run `npm install`.  This will install all of the dependencies used by the project.  If you get a git error, you may need to download a git client and make sure git is in your path.
  * Run `node server.js` which will launch the hapi web server.
  * Open `http://localhost:3000` in your browser.  You should be able to add and remove items from the cart, the totals and taxes should calculate, reset should clear everything, and the checkout button should report the grand total and reset the form.
  * If you click "tests" in the "toolbar" area, QUnit should run a few assertions and everything should pass (green bar at top and check-box in page title).
  * If everything looks good with the Shopping Cart and tests, you can proceed.  If not, try to fix things first.

## Convert to TypeScript

  * Rename `public\js\controllers.js` to `controllers.ts`.  If you had the file open, close it and open it again.
  * A new "TypeScript" bar should show up at the bottom of the screen while a TypeScript file is open.  This is atom-typescript's window.  You should have one error which is "no tsconfig.json".  Create one by pressing Ctrl+Shift+P and typing tsconfig.  That should reveal the helper to create a tsconfig.json file - click it.
  * By default, it will be created in the current folder.  Drag it to the root of the project to ensure any TypeScript files we create get included in the TypeScript compilation context.
  * Open the tsconfig.json and change `noImplicitAny` to true and save it.  This is optional, but it's my preference to put TypeScript in a stricter mode.  We learn more things about our code base this way.  In general, having `noImplicitAny` active means you are opting-in to providing type annotations on function parameters and variables that are declared on a different line from where they are instantiated with a value.  TypeScript can generally use [type inference](https://www.stevefenton.co.uk/2014/07/Embrace-Type-Inference-In-TypeScript/) for everything else.  Also, `noImplicitAny` doesn't mean `doNotAllowAny` - we can still annotate variables with the `any` type and opt-out of type checking when desired.  (If you really do want to ban any, the tool [tslint](https://www.npmjs.com/package/tslint) can do that, but I find occasional use of `any` to be pragmatic).
  * If all is working well, when we open `controllers.ts` again, we should see 14 errors (it had been 6 with `noImplicitAny` as false).  If your error count is different, don't worry too much as long as you do see *some* errors - you may be on a future version of TypeScript or something.  Let's work on them.
  * Note that if you save `controllers.ts`, TypeScript will still emit the JavaScript regardless of the errors it's showing, so you should be able to ignore the TypeScript errors and run the web page again if you want to and it will work the same as before.

## Getting type definitions

  Two of the errors are "Cannot find name 'angular'" and "Cannot find name 'Big'".  These are global variables created by two of the libraries our shopping cart uses.  We can fetch a TypeScript definition file for them from [DefinitelyTyped](http://definitelytyped.org/) using the command-line tool [tsd](https://github.com/Definitelytyped/tsd#install).

  * In the command-prompt pointed to your project folder, kill the web server if it's still running with Ctrl+C.
  * Run `npm install tsd -g`.  That will install tsd globally.  You only have to do this once per machine (or if you want to upgrade your version of tsd).  If you get an error, you may need to install tsd from an administrative command-prompt.
  * Run `tsd init` to create a `tsd.json`.
  * Run `tsd query angular --action install --save` to install the angular definitions and save them to `tsd.json`.
  * Run `tsd query big.js --action install --save` to install and save the Big.js definitions.
  * Click the "refresh" button on the far-right of the TypeScript bar in Atom.  This will refresh the TypeScript compilation context and the "Cannot find name 'angular'" and "Cannot find name 'Big'" errors should go away after a second or so.  If not - did you move your `tsconfig.json` to the project root?

## Fixing the remaining errors

  * Many of the remaining errors are "Parameter 'name' implicitly has an 'any' type".  In this case we know `name` is a string, so we can just change `name` to `name: string` in each of the locations where the error appears.  (You can click on the `at line ## col ##` location text in the linter to jump directly to the location.)  If we didn't know what type something was supposed to be, we could also *explicitly* type it as `any`.  After fixing them, we should be down to 2 errors.
  * The error "Supplied parameters do not match any signature of the call target" means we're not calling something correctly.  The problem is that the second parameter of `getCartItem` is not defined as optional.  Click `getCartItem` on line 39 and press F12 - that will bring you to the definition.  We can mark `info` as optional by changing it to `info?`.  We should be down to 1 error.
  * The last error is another "implicit any" warning.  Technically the type is `{name: string, price: number}` so you could change `info?` to `info?: {name: string, price: number}` and it would work, however it's probably better to use an interface so this complex type can be re-used.
  * In a file called `cheatcodes.txt`, I've defined three interfaces.  Copy them out of there and paste them in to `controllers.ts`.  You could do it anywhere in the file, though interfaces are typically defined in the top of a file or even in their own file.  (If you do create a file for an interface, create it as a `.d.ts` file - this signals to TypeScript that it won't have to be emitted as JS).
  * Now you can type the `info` parameter of `getCartItem` as `info?: IProductInfo`.
  * Start up the web server again (`node server.js`) and confirm that everything still works.

## More stuff to do

  One annoying thing about TypeScript is that there's not yet a way to define what `this` should be inside a function.  There is a way to fake it, though, if you're using a "capture variable".  That's what we've done at the top of `ShoppingCartCtrl()`: `var vm = this;`.  If we type our `vm` variable, and only use `vm` instead of `this`, we can simulate a strongly-typed `this` fairly effectively within the function.
  * Strongly-type the `vm` variable using the interface we just added: `var vm: IShoppingCartCtrl = this;`.  This ensures that anything we add to `ShoppingCartCtrl` matches the types we've defined in the interface.

## Extra credit

  * Convert the tests to TypeScript.  The TSD ID for QUnit is "qunit".  You may run into an issue with the type of the controller not being known.  This is due to [Issue #2310](https://github.com/Microsoft/TypeScript/issues/2310).  Please tell Microsoft you've hit it and ask for it to be fixed.  I have posted a work-around on the linked [issue #2299](https://github.com/Microsoft/TypeScript/issues/2299) and I discuss it in my Pluralsight course.
  * Convert the web server to TypeScript.  The TSD ID for Hapi is "hapi".
