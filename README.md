## Shopping Cart
Shopping cart backend API based on express framework and mongoDB.

## Run locally
- Clone this project: `git clone https://github.com/youyaochi/ShoppingCart.git`
- Install dependencies: `yarn install`  or `npm install`
- Start MongoDB, modify the config file (`config/config.yml`) if necessary, by default the uri is `mongodb://localhost/test`
- Initialize database by `npm run initdb` (this action will delete collections named `products`, `users` and `shoppingcarts`)
- Start server with `npm start`, visit `http://localhost:3000`

## Documentation

All of public APIs are documented using Swagger, please check `http://localhost:3000/api-docs/`.

## Usage
To use shopping carts, users need to log in firstly by posting `/users/authentication` API with right usernames and passwords (initialized database comes with 3 users: `alice:alice`, `bobo:bobo` and `admin:admin`), when `token` is returned click the `Authrize` button and fill the blank with it, then click Authorize, you are logged in.

## Todo
- Price 0 can not be shown as 0.00
- Better error notification
