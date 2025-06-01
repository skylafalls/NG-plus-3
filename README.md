# Antimatter Dimensions NG+3

This is a port of [Aarex's NG+3 mod](https://github.com/aarextiakhiao/NG-plus-3) onto the Antimatter Dimensions Reality Update,
bringing a more modernized style.

## Run

To run the game locally, you will need to install [Deno](https://denoland.com).

First, run the following command in your terminal (or command line) while being
inside the checked out repository:

```
deno install
```

After all the packages are installed, start up the game:

```
deno task dev
```

This will make the game served via your localhost, and the playable link will
be displayed in your terminal. The server **doesn't** need to be restarted
after you've made changes, vite will automatically refresh the game. The server **can**
occasionally crash, so check your terminal from time to time and run `dev`
again if needed.
