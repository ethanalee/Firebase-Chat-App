# firebase-chat-app
> Example Vuejs  + Firebase web app.

## Create a Firebase project
> https://console.firebase.google.com

Make sure to configure:
- Auth with email and password
- Auth with google (optional)
- Firestore with "messages", "users", and "conversations" collections

Create a .env.local with the following config variables from the firebase console:
```
VUE_APP_FIREBASE_KEY = XXXXX
VUE_APP_FIREBASE_AUTH_DOMAIN = XXXXX
VUE_APP_FIREBASE_DATABASE_URL = XXXXX
VUE_APP_FIREBASE_PROJECT_ID = XXXXX
VUE_APP_FIREBASE_STORAGE_BUCKET = XXXXX
VUE_APP_FIREBASE_KEY_MESSAGING = XXXXX
VUE_APP_FIREBASE_APP_ID = XXXXX
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize Vue configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
