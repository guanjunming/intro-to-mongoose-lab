require("dotenv").config();
const mongoose = require("mongoose");
const prompt = require("prompt-sync")();
const Customer = require("./src/models/Customer");
const connectDB = require("./src/db/db");

connectDB();

const main = async () => {
  console.log("Welcome to the CRM");

  while (true) {
    console.log("\nWhat would you like to do?\n");
    console.log("  1. Create a customer");
    console.log("  2. View all customers");
    console.log("  3. Update a customer");
    console.log("  4. Delete a customer");
    console.log("  5. Quit\n");

    const choice = prompt("Number of action to run: ");

    switch (choice) {
      case "1":
        await createCustomer();
        break;
      case "2":
        await viewCustomers();
        break;
      case "3":
        await updateCustomer();
        break;
      case "4":
        await deleteCustomer();
        break;
      case "5":
        console.log("Exiting...");
        mongoose.connection.close();
        process.exit();
      default:
        console.log("Invalid choice, please select a valid option");
        break;
    }
  }
};

const createCustomer = async () => {
  try {
    const name = prompt("Enter the customer's name: ");
    const age = prompt("Enter the customer's age: ");

    const customer = await Customer.create({ name, age });
    console.log("Customer created: ", customer);
  } catch (error) {
    console.error(error.message);
    console.log("Invalid inputs, please try again.");
  }
};

const viewCustomers = async () => {
  try {
    console.log("Below is the list of customers: \n");

    const customers = await Customer.find();
    customers.forEach((customer) =>
      console.log(
        `id: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`
      )
    );
  } catch (error) {
    console.error(error.message);
  }
};

const updateCustomer = async () => {
  try {
    await viewCustomers();

    const id = prompt(
      "\nEnter the id of the customer you would like to update: "
    );
    const customer = await Customer.findById(id);
    if (customer) {
      const newName = prompt("What is the customer's new name? ");
      const newAge = parseInt(prompt("What is the customer's new age? "), 10);

      customer.name = newName;
      customer.age = newAge;
      await customer.save();

      console.log("Customer updated: ", customer);
    } else {
      console.log("Customer not found.");
    }
  } catch (error) {
    console.error(error.message);
    console.log("Invalid customer id or inputs, please try again.");
  }
};

const deleteCustomer = async () => {
  try {
    await viewCustomers();

    const id = prompt(
      "\nEnter the id of the customer you would like to delete: "
    );
    const customer = await Customer.findByIdAndDelete(id);
    if (customer) {
      console.log("Customer deleted: ", customer);
    } else {
      console.log("Customer not found.");
    }
  } catch (error) {
    console.error(error.message);
    console.log("Invalid customer id, please try again.");
  }
};

main();
