misskey.ts
====

[misskey.ts](misskey.ts) is a Misskey library for Node.js, written in TypeScript, developed for Disskey.

## Features
* Cross platform
* Modern way to use Misskey API with **Promise**
* Developed and maintained by a Misskey committer

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
	.then(doSomething)
	.catch(error => console.log('Error: ', error));

function doSomething(token: Token) {
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
* `token.status.getTimeline(options?: {sinceCursor?: number, maxCursor?: number, count?: number}): Promise<IStatus>`
* `token.status.update(text: string, inReplyToStatusId?: number): Promise<IStatus>`
* `token.status.show(id: string): Promise<IStatus>`
* `token.status.repost(id: string, text?: string): Promise<IStatus>`
* `token.status.favorite(id: string): Promise<IStatus>`

### Users API
* `token.users.showById(id: string): Promise<IUser>`
* `token.users.showByScreenName(screenName: string): Promise<IUser>`
* `token.users.follow(id: string): Promise<IUser>`
* `token.users.unfollow(id: string): Promise<IUser>`

## Dependencies
### npm packages
* open
* request
* request-promise

### Type definitions
* open
* request-promise

## License
misskey.ts is licensed under the MIT License.
See [LICENSE](../LICENSE).