
#  SideNavBar组件

### Intro

For content selection and switching

### Install
```tsx
// react
import { SideNavBar,SubSideNavBar,SideNavBarItem } from '@nutui/nutui-react';
```

### Basic Usage

:::demo
```tsx
import  React,{useState} from "react";
import {Cell, SideNavBar,SubSideNavBar,SideNavBarItem } from '@nutui/nutui-react';

const App = () => {
    const [navBarState, setNavBarState] = useState({
    visible: false,
    position: 'left',
  })
  const changeNarBar = (visible, position= navBarState.position) => {
    setNavBarState({
      visible,
      position,
    })
  }
 
  return ( 
    <>   
    <Cell
          title="left"
          isLink
          onClick={() => {
            changeNarBar(true, 'left')
          }}
        />
        <Cell
          title="right"
          isLink
          onClick={() => {
            changeNarBar(true, 'right')
          }}
        />
        <SideNavBar
          title="首页"
          visible={navBarState.visible}
          position={navBarState.position}
          handleClose={() => {
            changeNarBar(false)
          }}
        >
          <SubSideNavBar title="Level 1 title" ikey="1-0" >
            <SideNavBarItem title="Level 1 content-1" ikey="1-01" />
            <SideNavBarItem title="Level 1 content-2" ikey="1-02" />
            <SubSideNavBar title="Level 2 title" ikey="2-0">
              <SideNavBarItem title="Level 2 content-1" ikey="2-01" />
              <SideNavBarItem title="Level 2 content-2" ikey="2-02" />
            </SubSideNavBar>
          </SubSideNavBar>
        </SideNavBar>
    </>
  );
};  
export default App;

```
:::

### Nesting (up to three layers recommended)

:::demo
```tsx
import  React,{useState} from "react";
import {Cell,SideNavBar,SubSideNavBar,SideNavBarItem } from '@nutui/nutui-react';

const App = () => {
  const [visible, setVisible] = useState(false)
  const changeNarBar = (visible) => {
   setVisible(visible)
  }
  const clickItem = ({ title, ikey }) => {
    Toast.text(`title=${title},ikey=${ikey}`)
  }
  const clickTitle = ({ title, ikey, isShow }) => {
    Toast.text(`title=${title},ikey=${ikey},isShow=${isShow}`)
  }
  return ( 
    <>  
      <Cell
          title="show"
          isLink
          onClick={() => {
            changeNarBar(true)
          }}
        /> 
    <SideNavBar
          title="首页"
          visible={visible}
          position='left'
          handleClose={() => {
            changeNarBar(false)
          }}
        >
          <SubSideNavBar title="Level 1 title" ikey="1-0" onClick={clickTitle}>
            <SideNavBarItem title="Level 1 content-1" ikey="1-01" onClick={clickItem} />
            <SideNavBarItem title="Level 1 content-2" ikey="1-02" />
            <SubSideNavBar title="Level 2 title" ikey="2-0">
              <SideNavBarItem title="Level 2 content-1" ikey="2-01" />
              <SideNavBarItem title="Level 2 content-2" ikey="2-02" />
                <SubSideNavBar title="Level 3 title" ikey="3-0">
                  <SideNavBarItem title="Level 3 content-1" ikey="3-01" />
                  <SideNavBarItem title="Level 3 content-2" ikey="3-02" />
                </SubSideNavBar>
            </SubSideNavBar>
          </SubSideNavBar>
        </SideNavBar>
    </>
  );
};  
export default App;

```
:::



## API

### 1、SideNavBar

| Attribute    | Description                      | Type   | Default          |
|--------------|----------------------------------|--------|------------------|
| visible      | Whether the current component is displayed | boolean | `false`   |
| title        | Navigation title                           | string  | -               |
| width        | Eject width  -percentage          | string   | `80%`          |
| position     | Eject position                    | 'left' \| 'right' | `left`  |
| offset       | Navigation indent width           | number  | `20`              |

### 2、SubSideNavBar

| Attribute    | Description                      | Type   | Default         |
|--------------|----------------------------------|--------|------------------|
| ikey         | Navigation unique identifier     | string \| number |          |
| title        | Navigation title                 | string  | -              |
| open         | Whether navigation is expanded by default | boolean  | `true`  |
### 3、SideNavBarItem

| Attribute    | Description                      | Type   | Default          |
|--------------|----------------------------------|--------|------------------|
| ikey         | Navigation unique identifier     | string \| number |          |
| title        | Navigation title                 | string  | -               |

## Events
### 1、SideNavBar Events

| Event | Description            | Arguments     |
|-------|------------------------|--------------|
| onClose     | Click mask trigger     | -           |

### 2、SubSideNavBar Events

| Event | Description                                | Arguments    |
|-------|--------------------------------------------|--------------|
| onClick     | Navigation Click | `data: {title: string, ikey: string \| number, isShow: boolean}`           |

### 3、SideNavBarItem Events

| Event  | Description                                | Arguments    |
|--------|--------------------------------------------|--------------|
| onClick | Navigation Click       | `data: {title: string, ikey: string \| number}`           |


## Theming

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles. Please refer to [ConfigProvider component](#/en-US/component/configprovider).

| Name | Default Value |
| --- | --- |
| --nutui-sidenavbar-content-bg-color | `$white` |
| --nutui-sidenavbar-sub-title-border-color | `#f6f6f6` |
| --nutui-sidenavbar-sub-title-bg-color | `#f6f6f6` |
| --nutui-sidenavbar-sub-title-font-size | `$font-size-large` |
| --nutui-sidenavbar-sub-title-radius | `0` |
| --nutui-sidenavbar-sub-title-border | `0` |
| --nutui-sidenavbar-sub-title-height | `40px` |
| --nutui-sidenavbar-sub-title-text-line-height | `40px` |
| --nutui-sidenavbar-sub-title-text-color | `$title-color` |
| --nutui-sidenavbar-item-title-color | `#333` |
| --nutui-sidenavbar-item-title-bg-color | `$white` |
| --nutui-sidenavbar-item-height | `40px` |
| --nutui-sidenavbar-item-line-height | `40px` |
| --nutui-sidenavbar-item-font-size | `16px` |
