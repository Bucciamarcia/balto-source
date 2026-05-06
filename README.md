# Balto Source

This is the source code for Balto Source. Anyone is welcome to contribute. Go to the wiki for contributing guidelines: https://github.com/Bucciamarcia/balto-source/wiki

## How to test the website

NOTE: This is for the tech people who know how to work with git and the terminal.

The repo contains the frontend built in Svelte, and the backend in Pocketbase and Go.

The website is developed in Node v22.22.2 (npm 10.9.7) and Go 1.25.1, so first of all, go ahead and install thsoe for your operating system.

After `git clone`, go to `backend/database_schema.json` and copy it. Then run the backend with `go run . serve`.

A browser window will appear asking you to create a Pocketbase account; if it doesn't, click on the dashboard link in the treminal window.

After creating an account, inside the Pocketbase dashboard, go to Settings -> Import collections. Paste the database schema you copied, and save it.

Not that copying the database schema is only a first time step: the schema will be saved locally and from now on you can just start the backend and it will work.

While you keep the backend running, open a new terminal session and enter the frontend folder. Run the frontend app with `npm run dev -- --open`

A browser tab will open with the website.
