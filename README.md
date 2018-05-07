# NotifyzZ

Plugin for shown notifications on your site.

## Demo

[Demo page](https://brooons.github.io/notifyzz/index.html)

## Usage

**Connect**

In head:

```html
<link rel="stylesheet" href="/js/notifyzz.min.css">
```

Before `</body>`

```html
<script src="/js/notifyzz.min.js"></script>
```

**HTML**

```html
<div class="timer j-timer"></div>
```

**Initialization**

```js
new NotifyzZ({
  title: 'BrooonS',
  content: 'Hello world!',
});
```

## Config

```js
new NotifyzZ({
  title: '',
  content: '',
  duration: 5000,
  extraClass: '',
  position: '',
  isClosingOnClick: true,
  isClosingOnSwipe: true,
  beforeCreate() {},
  beforeOpen() {},
  beforeClose() {},
  beforeDestroy() {},
  beforeContainerDestroy() {},
});
```

| Setting                | Description                          | Type       |
| ---------------------- | ------------------------------------ | ---------- |
| title                  | Title in notify (HTML is allowed)    | `string`   |
| content                | Content in notify (HTML is allowed)  | `string`   |
| duration               | Duration of a notification           | `number`   |
| extraClass             | Added to notify                      | `string`   |
| position               | Notify position (allow left, bottom) | `string`   |
| isClosingOnClick       | Close on mouse or touch              | `boolean`  |
| isClosingOnSwipe       | Close on swipe on mobile devices     | `boolean`  |
| beforeCreate           | Callback                             | `function` |
| beforeOpen             | Callback                             | `function` |
| beforeClose            | Callback                             | `function` |
| beforeDestroy          | Callback                             | `function` |
| beforeContainerDestroy | Callback                             | `function` |


## Author

**@BrooonS**

## Licence
MIT [licence](https://github.com/BrooonS/NotifyzZ/blob/master/LICENSE)
