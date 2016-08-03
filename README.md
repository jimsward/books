## MEANbooks

#### Booksjs: a MEAN Alternative to Quickbooks Online All the features of quickbooks online; but stable.

### Checking

#### Login

A user not yet logged in has read-only access. Unless you are logged in, any actions that would change the database are disabled. The Sign Up page allows a potential user to receive an email with a randomly generated 8 character password.

#### Table of checkbook entries

The table starts with 40 rows - one per entries document - of check entries. Clicking on any row will spawn a dialog with all the fields for that document made editable.

#### Check Entry Form

This is where new checks are entered. Date, account, and an amount is required. The amount can be a payment or a deposit but not both. The account must be in the accounts collection. Only logged in users can save an entry

#### Search Registry Dialog

Launched by the Search Register button. Choose to search by date, amount, account, or payee. Enter value to search for. Returns a table with all the entries matching value. Click on one of the entries; a form appears with the fields in the chosen entries document and inputs for most of the fields allow you to change the data or delete the entire document.

### Customers

#### New Customer

New Customer Button opens a dialog with a form with Name, Company, Address, Phone, email, and, Opening Balance fields

#### Find a customer.

Find a customer by entering a name or click on a customer name in the customer table. Once a customer is selected, a page appears with customer details in one tab and transactions in the other. You can edit the details in the former and view transactions by date and access a copy of any transaction in the latter.

#### Create Invoice

Create an invoice by way of the Create Invoice button or clicking the create invoice field of an individual customer's entry in the customer table

#### Invoice Entry

The Invoice Page has inputs for name, invoice number, date and a table for line items. Each line item has a (required) service, (optional) description, and (required) amount

### Reports

#### Profit and Loss

The Profit and Loss Report takes a date range and produces a report subtotaled by category, account, date, type, then number

### About

A few paragraphs about us. Most relevant: "We are a small startup with the goal of producing a complete online accounting package via the MEAN stack."

#### Links:

[Fork it](https://github.com/jimsward/books)

[See it Live](http://stump3.us)
