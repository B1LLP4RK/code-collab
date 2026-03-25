# Code-collab

- demonstration of shared code editor using [monaco](https://github.com/microsoft/monaco-editor), [yjs](https://github.com/yjs/yjs) with websocket connection, with the help of [monaco-editor/react](https://github.com/suren-atoyan/monaco-react).

- run the server at `localhost:1234` with

````
```powershell
cd y-websocket-server
npm install
npx patch-package
npx y-websocket
````

- the server patches `@y/websocket-server` package
- open the client, and open multiple tabs in the browser at `locahost:3000`

```powershell
cd client
npm install
npm run dev
```

- you can see that the contents are being shared across browsers
