misskey.ts
====

[misskey.ts](misskey.ts) is a Misskey library for Node.js, written in TypeScript, developed for Disskey.

## Download
```
curl https://raw.githubusercontent.com/AyaMorisawa/Disskey/master/src/misskey.ts > misskey.ts
```

If you want to use misskey.ts from JavaScript, please build Disskey yourself.

## Usage
misskey.ts provides very simple authentication and straightforward API.

```ts
import { SAuth, Token } from 'path/to/misskey';

SAuth.Session.create('app-key')
	.then(session => Token.create(session, 'pincode'))
	.then(doSomething);

function doSomething(token: Token) {
	console.log(token.userKey);
	token.status.getTimeline().then(posts => console.log(posts));
	token.status.update('Hello, world!');
}
```

### From user-key
```ts
var token = new Token('app-key', 'user-key');
doSomething(token);
```

### Low-level function
```ts
token.callApiWithHeaders<any>('status/update', {
	method: 'POST',
	form: {
		text: 'test'
	}
});
```

## Example
* https://gist.github.com/AyaMorisawa/a1d0836beac75a6dc9e9

## Supported API
### Status API
* `token.status.getTimeline(options?: {sinceCursor?: number, maxCursor?: number, count?: number}): Promise<any>`
* `token.status.update(text: string, inReplyToStatusId?: number): Promise<any>`
* `token.status.show(id: string): Promise<any>`
* `token.status.repost(id: string, text?: string): Promise<any>`
* `token.status.favorite(id: string): Promise<any>`

## Dependencies
Please install by using npm.

* open
* request
* request-promise

## License
misskey.ts is licensed under the MIT License. See [LICENSE](../LICENSE)