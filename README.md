# Antimatter Dimensions NG+3

This is a port of
[Aarex's NG+3 mod](https://github.com/aarextiaokhiao/NG-plus-3) onto the
Antimatter Dimensions Reality Update, bringing a more modernized style.

## Run

To run the game locally, you will need to install [Node.js](https://nodejs.org).

First, run the following command in your terminal (or command line) while being
inside the checked out repository:

```sh
npm ci
```

After all the packages are installed, start up the game:

```sh
npm run dev
```

This will make the game served via your localhost, and the playable link will be
displayed in your terminal. The server **doesn't** need to be restarted after
you've made changes, vite will automatically refresh the game. The server
**can** occasionally crash, so check your terminal from time to time and run
`dev` again if needed.
