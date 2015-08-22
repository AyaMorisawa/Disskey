misskey.ts
====

misskey.ts is a Misskey library for Node.js, written in TypeScript.

## Usage
```ts
import { SAuth, Token } from 'path/to/misskey';

SAuth.Session.create('app-key')
	.then(session => Token.create(session, 'pincode'))
	.then(token => console.log(token.userKey));
```

## Dependencies
Please install by using npm.

* open
* request
* request-promise

## License
misskey.ts is licensed under the MIT License.