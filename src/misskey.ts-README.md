misskey.ts
====

misskey.ts is a Misskey library for Node.js, written in TypeScript.

## Usage

### Importing
```ts
import { SAuth } from 'misskey';
```

### Create session
```ts
SAuth.Session.create('appKey').then(session => {
});
```

### Open authorize page
```ts
session.openAuthorizePage();
```

### Get user-key
```ts
session.getUserKey('pincode').then(({userKey, user}) => {
});
```

## Dependencies
Please install by using npm.

* open
* request
* request-promise

## License
misskey.ts is licensed under the MIT License.