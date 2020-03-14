// Initializes the npm packages used
var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var cart = [];

// Initializes the connection variable to sync with a MySQL database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "Lee",

  // Your password
  password: "corsair098",
  database: "bamazon"
});

// Creates the connection with the server and loads the product data upon a successful connection
connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
  }
  loadProducts();
});

// Function to load the products table from the database and print results to the console
function loadProducts() {
  // Selects all of the data from the MySQL products table
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;

    // Draw the table in the terminal using the response
    console.table(res);

    // Then prompt the customer for their choice of product, pass all the products to promptCustomerForItem
    promptCustomerForItem(res);
  });
}

// Prompt the customer for a product ID
function promptCustomerForItem(inventory) {
  // Prompts user for what they would like to purchase
  inquirer
    .prompt({
      name: 'item',
      type: 'input',
      message: 'Please enter the ID number of the product you would like to purchase.'
    })
    .then(function (answer) {
      var productId = parseInt(answer.item);
      checkIfShouldExit(answer.item);
      checkInventory(productId, inventory);
    });
};

// Prompt the customer for a product quantity
function promptCustomerForQuantity(product, inventory) {
  inquirer
    .prompt({
      name: 'quantity',
      type: 'input',
      message: 'How many would you like to purchase?'
    })
    .then(function (answer) {
      var quantity = parseInt(answer.quantity);
      checkIfShouldExit(answer.quantity);
      if (quantity > product.stock_quantity) {
        console.log(`We apologize for any inconvenience, as there is ${product.stock_quantity} left in stock.`)
        promptCustomerForItem(inventory);
      } else {
        makePurchase(product, quantity);
      }
    })
};

// Purchase the desired quantity of the desired item
function makePurchase(product, quantity) {
  connection.query(`UPDATE products
  SET stock_quantity = stock_quantity - ${quantity} 
  WHERE item_id = ${product.item_id}`)
  cart.push({
    'item': product,
    'quantity': quantity
  });
  console.log('')
  console.log('===============RECEIPT===============')
  console.log('')
  console.log('')
  console.log('You Purchased:')
  var total = 0
  cart.forEach(x => {
    total += x.item.price * x.quantity
    console.log(`\n\t${x.item.product_name} ${x.quantity} x $${x.item.price}.....$${x.item.price * x.quantity}`)
  })
  console.log(`\nTotal: $${total}`);
  console.log('')
  console.log('===============RECEIPT===============')
  console.log('')
  loadProducts();
};

// Check to see if the product the user chose exists in the inventory
function checkInventory(choiceId, inventory) {
  var product;
  inventory.forEach(p => {
    if (p.item_id === choiceId) {
      product = p;
    }
  });
  if (product) {
    console.log('')
    console.log(`You have selected Item ID ${product.item_id}: ${product.product_name}.`)
    console.log('')
    promptCustomerForQuantity(product, inventory);
  } else {
    console.log("Please enter a valid item ID.")
    promptCustomerForItem(inventory);
  }
};


// Check to see if the user wants to quit the program
function checkIfShouldExit(choice) {
  if (typeof choice == 'string') {
    if (choice.toLowerCase() === "q") {
      // Log a message and exit the current node process
      console.log("Goodbye!");
      process.exit(0);
    };
  }
};