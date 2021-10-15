# Minesweeper Arena

Play new versions of minesweeper against your friends in real time. 

Single Board Versus: Clear more tiles than your opponent to win!

Time Attack: Play on a sepeprate board with the same layout as your opponent. Clear your board first to win!

Made with:

peerjs
Vue (may abandon)
html canvas

Rust WASM (future)
electron (future)

wasm priority: 
1. state
2. render thread
3. game managers

# Known Issues
In Chrome, Peerjs connection may fail when two players are on the same local network due to NAT traversal.
To fix, open `chrome://flags/`, Search for `Anonymize local IPs exposed by WebRTC` and disable it.


## .env configuration
```
VUE_APP_PEER_SERVER=localhost
VUE_APP_PORT=8081
VUE_APP_USE_PUBLIC_PEERJS=false
VUE_APP_PEER_DEBUG_LEVEL=0
```
### Using a peer.js server

VUE_APP_USE_PUBLIC_PEERJS can be 'true' or 'false' to switch between using the public peer.js server and a locally hosted one.

VUE_APP_PEER_SERVER should be the ipv4 address that your application is running on (see image) if you are hosting the server yourself. It will NOT work if you try and google what your IPv4 address is. NOTE: "[localhost normally resolves to the IPv4 loopback address 127.0.0.1](https://en.wikipedia.org/wiki/Localhost)." You can use localhost if you are doing solo testing.

![ipv4 address that your application is running on](https://i.imgur.com/19C15tb.png) 

VUE_APP_PORT is the port of your local peer.js server .




## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Starts local Peer.js server
```
yarn start
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


[//]: # (vscode markdown preview shortcut is command + shift + v)