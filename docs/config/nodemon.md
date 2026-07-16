# nodemon 配置

```shell
 npm install nodemon -g
```

## nodemon.json

```json   
{
	"ignore": [
		"node_modules",
		"dist"
	],
	"colours": true,
	"verbose": true,
	"restartable": "rs",
	"watch": [
		"*.*"
	],
	"ext": "html,js"
}
```

## package

```json
{
  "name": "electron-camera",
  "version": "1.0.0",
  "description": "",
  "main": "main.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon --exec electron . "
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "electron": "^22.0.2"
  }
}
```
