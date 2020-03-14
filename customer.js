// Initializes the npm packages used
var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

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
      type: 'number',
      message: 'Please enter the ID number of the product you would like to purchase.\n======================================================================'
    })
    .then(function (answer) {
      item = answer.item;
      connection.query(
        "SELECT * FROM products WHERE ?", {
          item_id: item,
        },
        function (err, res) {
          if (err) throw err;
          if (res.length === 0) {
            console.log("Please enter a valid item ID.")
            promptCustomerForItem();
          } else {
            console.log(`You have selected Item ID ${res[0].item_id}: ${res[0].product_name}.`)
            promptCustomerForQuantity();
          }

        }
      )
    });
};

// Prompt the customer for a product quantity
function promptCustomerForQuantity(product) {
  inquirer
    .prompt({
      name: 'quantity',
      type: 'number',
      message: 'How many would you like to purchase?\n======================================'
    })
    .then(function (answer) {
      quantity = answer.quantity;
      console.log(quantity)
      connection.query(
        'SELECT stock_quantity FROM products',
        function (err, res) {
          console.log(res[0])
          if (err) throw err;
          if (quantity > res[0].stock_quantity) {
            console.log("ain't got that many")
          } else {
            console.log('we got that many')
          }
        }
      )
    });
};

// Purchase the desired quantity of the desired item
function makePurchase(product, quantity) {

};

// Check to see if the product the user chose exists in the inventory
function checkInventory(choiceId, inventory) {

};

// Check to see if the user wants to quit the program
function checkIfShouldExit(choice) {
  if (choice.toLowerCase() === "q") {
    // Log a message and exit the current node process
    console.log("Goodbye!");
    process.exit(0);
  };
};