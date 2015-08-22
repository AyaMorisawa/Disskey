misskey.ts
====

misskey.ts is a Misskey library for Node.js, written in TypeScript.

## Usage
```ts
import { SAuth, Token } from 'path/to/misskey';

SAuth.Session.create('app-key')
	.then(session => Token.create(session, 'pincode'))
	.then(doSomething);

function doSomething(token: Token) {
	console.log(token.userKey);
	
	token.callApiWithHeaders<any>('status/update', {
		method: 'POST',
		form: {
			text: 'test'
		}
	});
}
```

## Dependencies
Please install by using npm.

* open
* request
* request-promise

## License
misskey.ts is licensed under the MIT License.