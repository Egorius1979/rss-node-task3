# CRUD API

## Quick start

1. Clone this repo using:

```shell
$ git clone git@github.com:Egorius1979/rss-node-task3.git
```

2. To install:

```shell
$ npm install
```

3. Run project in Dev mode

```shell
$ npm run start:dev
```

4. Create first build & run

```shell
$ npm run start:prod
```

## How to use

To test the API, you can use Postman or any other similar tool (HTTP client).

- **GET:**

  - `api/users` - get all persons
  - `api/user/:userId` - get a specific person

- **POST:**

  - `api/users` - create a new user and store it in database

- **PUT:**

  - `api/user/:userId` - update existing person (you can change partially, not all properties at once)

- **DELETE:**
  - `api/user/:userId` - deletes a specific person

to create an object, use `json`(all properties are required):

- "username": `string`,
- "age": `number`,
- "hobbies": `string`[] or []

## Testing

Implemented 3 test scenarios for the API:

```shell
$ npm run test
```
