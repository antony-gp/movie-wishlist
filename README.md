# Movie Whishlist

### Challenge

Develop a Node.js API to manage a movie wishlist. The API should allow an authenticated user to add movies, change states (pending, watched, rated, recommended/not recommended) and check its history. This challenge focus on building an efficient and scalable log middleware that attach an unique identifier for each movie and keeps track of all actions.

### Configuration

#### **Starting the API and Database**

Make sure to have both `docker` and `docker compose` on your machine.

Then configure your `.env` file with the following variables:

| Key                       | Value                                                    |
| ------------------------- | -------------------------------------------------------- |
| **NODE_ENV**              | Either `development` or `production`                     |
| **PORT**                  | `number`, must be an available port                      |
| **TMDB_URL**              | `string`, The Movie Database url                         |
| **TMDB_TOKEN**            | `string`, The Movie Database token                       |
| **RATE_LIMIT_WINDOW_MS**  | `number`, Rate limit window for requests in milliseconds |
| **RATE_LIMIT_PER_WINDOW** | `number`, Rate limit maximum requests per window         |
| **MYSQL_HOST**            | `string`, MySQL host url or docker service name          |
| **MYSQL_PORT**            | `number`, MySQL listening port                           |
| **MYSQL_DATABASE**        | `string`, MySQL database to directly connect             |
| **MYSQL_USER**            | `string`, MySQL username                                 |
| **MYSQL_PASSWORD**        | `string`, MySQL specified user password                  |
| **MYSQL_ROOT_PASSWORD**   | `string`, MySQL root user password                       |
| **ELASTICSEARCH_HOST**    | `string`, Elasticsearch host url or docker service name  |
| **ELASTICSEARCH_PORT**    | `number`, Elasticsearch listening port                   |
| **ELASTICSEARCH_VERSION** | `string`, Elasticsearch docker image version             |

<sub>\*Hot reload will only be available when **NODE_ENV** is set to `development`</sub>

---

To spin up the containers and start the application, you can run

```bash
npm run compose
```

If you need to recreate the application's docker image, run

```bash
npm run compose:rebuild
```

---

Alternatively, you can navigate to **docker** folder

```bash
cd docker
```

And run `docker compose`, specifying **env-file** path

```bash
docker compose --env-file "../.env" up -d
```

To stop the containers, you must also specify **env-file** path

```bash
docker compose --env-file "../.env" down
```

---

The API will be available through `localhost:${PORT}`.

#### **Migrations and seeders**

After the database is successfuly up and running, it's tables and some data still need to be created.

To achieve this, we are going to run the following `sequelize-cli`'s commands:

Run all the migrations and create the database structure

```bash
npx sequelize-cli db:migrate
```

Insert necessary data into tables

```bash
npx sequelize-cli db:seed:all
```

<sub>You can follow [Sequelize's Migration](https://sequelize.org/docs/v6/other-topics/migrations) docs if you wish to learn more.</sub>

### Usage

With the whole environment properly configured, you can now generate your `Basic` token by creating a user

Hit `/v1/users` with a `POST` request contaning a `JSON` body with the following properties:

- `email`: a valid email
- `password`: a strong password (minimum length of 8 and at least 1 lowercase, uppercase, number and symbol characters)

Ex:

```json
{
  "email": "abc@def.com",
  "password": "AbCd1@3$"
}
```

As a response, you will get a `JSON` body with a `token` property.

For every other endpoint of the API, you will need to provide this `token` as the `Authorization` header, following the pattern `Basic ${token}`

Ex:

| **Header**    | **Value**                            |
| ------------- | ------------------------------------ |
| Authorization | `Basic YWJjQGRlZi5jb206dW5kZWZpbmVk` |

### Docs

With the project running, you can access the documentation by navigating to `/v1/docs` on your API URL.

**_Note:_** _Don't forget to authenticate with your credentials (email and password of a user you created)._

---

If changes or additions are needed, I strongly recommend heading over to [Swagger Editor](https://editor.swagger.io/).

You can simply import `swagger-document.json`, or copy/paste it's contents and the editor will automatically convert to `YAML`.

To bring the changes, you can go to `File -> Convert and save as JSON`, then replace everything in `swagger-document.json` with it's contents.

### Testing

To execute tests, you may run

```bash
npm t
```

If you wish to have hot reload during test development, then run

```bash
npm run test:dev
```

### Known issues

- Tests are partially done
- Since there's no queue, create/update/delete methods can be problematic with concurrent requests
- Error messages (specially from validators) could be standardized into factory functions instead of being fixed strings.
