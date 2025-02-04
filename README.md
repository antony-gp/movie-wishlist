# Movie Whishlist

### Challenge

Develop a Node.js API to manage a movie wishlist. The API should allow an authenticated user to add movies, change states (pending, watched, rated, recommended/not recommended) and check its history. This challenge focus on building an efficient and scalable log middleware that attach an unique identifier for each movie and keeps track of all actions.

### Usage

Make sure to have both `docker` and `docker compose` on your machine.

Then configure your `.env` file with the following variables:

| Key          | Value                                |
| ------------ | ------------------------------------ |
| **NODE_ENV** | Either `development` or `production` |
| **PORT**     | `number`, must be an available port  |

<small>\*Hot reload will only be available when **NODE_ENV** is set to `development`</small>

---

Now to spin up the containers and start the application, you can run

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

The API will be available through `localhost:${PORT}`
