# 新增api记录

## showSaveFilePicker(实验性)

```
可进行文件的保存、但是前提是需要用户进行选择 手动调用无用
```
```js
async function getNewFileHandle (blob) {
  const handle = await window.showSaveFilePicker();
  const writable = await handle.createWritable();
  await writable.write(blob);
  await writable.close();
}
const boundsBlob = new Blob([JSON.stringify(bounds)], {type: 'text/plain'});
getNewFileHandle(boundsBlob);
```

## showOpenFilePicker(实验性)

```
可打开文件
```
```js
async function getFileHandle() {
  const [handle] = await window.showOpenFilePicker();
  return handle;
}
async function getFile() {
  const handle = await getFileHandle();
  const file = await handle.getFile();
  return file;
}
```

## showDirectoryPicker(实验性)

```
可打开文件夹
```
```js
async function getDirectoryHandle() {
  const handle = await window.showDirectoryPicker();
  return handle;
}
async function getDirectory() {
  const handle = await getDirectoryHandle();
  const files = [];
  for await (const entry of handle.values()) {
    files.push(entry);
  }
  return files;
}
```

## clipboard

``` 
  剪切板
```

```js
// 读取剪切板
navigator.clipboard.readText().then(text => {
  console.log('Pasted content: ', text);
});

// 写入剪切板
navigator.clipboard.writeText('Hello World').then(() => {
  console.log('Copying to clipboard was successful!');
}, () => {
  console.log('Could not copy text: ');
});
```
