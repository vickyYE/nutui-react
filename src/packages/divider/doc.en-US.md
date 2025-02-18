# Divider 

### Introduce

Separate content into multiple areas.

### Install

```ts
// react
import { Divider } from '@nutui/nutui-react';
```
### code demo
### Basic Usage

Default render one horizontal divider line.

:::demo

```tsx
import  React from "react";
import { Divider } from '@nutui/nutui-react';

const App = () => {
  return (
    <>
    <Divider />
    </>
  );
};
export default App;
```
:::


### With Text

Insert text into divider with default slot.

:::demo

```tsx
import  React from "react";
import { Divider } from '@nutui/nutui-react';

const App = () => {
  return (
    <>
        <Divider>Text</Divider>
    </>
  );
};
export default App;
```
:::


### Content Position

Set Content Position with `contentPosition` attribute.

:::demo

```tsx
import  React from "react";
import { Divider } from '@nutui/nutui-react';

const App = () => {
  return (
    <>
        <Divider contentPosition="left">Text</Divider>
        <Divider contentPosition="right">Text</Divider>
    </>
  );
};
export default App;
```
:::


### Dashed

Render dashed divider line with `dashed` attribute.

:::demo

```tsx
import  React from "react";
import { Divider } from '@nutui/nutui-react';

const App = () => {
  return (
    <>
        <Divider dashed>Text</Divider>
    </>
  );
};
export default App;
```
:::


### Custom Style

User can custom divider style with `styles` attribute.

:::demo

```tsx
import  React from "react";
import { Divider } from '@nutui/nutui-react';

const App = () => {
  return (
    <>
        <Divider styles={{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }}>Text</Divider>
    </>
  );
};
export default App;
```
:::

### Vertical Divider

:::demo

```tsx
import  React from "react";
import { Divider } from '@nutui/nutui-react';

const App = () => {
  return (
    <>
    <div>
        文本
        <Divider direction="vertical" />
        <a href="#" style={{ color: '#1989fa' }}>Link</a>
        <Divider direction="vertical" />
        <a href="#" style={{ color: '#1989fa' }}>Link</a>
    </div>
    </>
  );
};
export default App;
```
:::


## API

### Props

| Attribute            | Description                       | Type    | Default |
| --------------- | ----------------------------- | ------- | ------ |
| dashed          | Whether to use dashed border                  | boolean | `false`  |
| hairline        | Whether to use hairline             | boolean | `true`   |
| contentPosition | Content position, can be set to left or right   | string  | `center` |
| styles          | Modify custom styles                | CSSProperties     | -      |
| direction           | The direction of divider, can be set to horizontal or vertical            | string     | `horizontal`      |

### Slots

| Name    | Description |
| ------- | ---- |
| default | Default slot |


## Theming

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles. Please refer to [ConfigProvider component](#/en-US/component/configprovider).

| Name | Default Value |
| --- | --- |
| --nutui-divider-margin | `16px 0` |
| --nutui-divider-text-font-size | `$font-size-2` |
| --nutui-divider-text-color | `$gray1` |
| --nutui-divider-line-height | `2px` |
| --nutui-divider-before-margin-right | `16px` |
| --nutui-divider-after-margin-left | `16px` |
| --nutui-divider-vertical-height | `12px` |
| --nutui-divider-vertical-top | `2px` |
| --nutui-divider-vertical-border-left | `rgba(0, 0, 0, 0.06)` |
| --nutui-divider-vertical-margin | `0 8px` |
