---
title: react事件研究及阻止冒泡
date: 2017-08-25 22:14:08
tags: [react]
---

### React 中的事件处理逻辑
为了解决跨浏览器兼容性问题，`React` 会将浏览器原生事件（`Browser Native Event`）封装为合成事件（`SyntheticEvent`）传入设置的事件处理器中。这里的合成事件提供了与原生事件相同的接口，不过它们屏蔽了底层浏览器的细节差异，保证了行为的一致性。另外有意思的是，`React` 并没有直接将事件附着到子元素上，而是以单一事件监听器的方式将所有的事件发送到顶层进行处理。这样 `React` 在更新 `DOM` 的时候就不需要考虑如何去处理附着在 `DOM` 上的事件监听器，最终达到优化性能的目的。

### 合成事件 SyntheticEvent
`SyntheticEvent` 是浏览器原生事件跨浏览器的封装。`SyntheticEvent` 和浏览器原生事件一样有 `stopPropagation()`、`preventDefault()` 接口，而且这些接口夸浏览器兼容。

如果出于某些原因想使用浏览器原生事件，可以使用 `nativeEvent` 属性获取。每个和成事件（`SyntheticEvent`）对象都有以下属性：
```
boolean bubbles
boolean cancelable
DOMEventTarget currentTarget
boolean defaultPrevented
Number eventPhase
boolean isTrusted
DOMEvent nativeEvent
void preventDefault()
void stopPropagation()
DOMEventTarget target
Date timeStamp
String type
```

### 支持的事件
React 将事件统一化，使事件在不同浏览器上有一致的属性。

事件处理程序在事件冒泡阶段被触发。如果要注册事件捕获处理程序，应该使用 `Capture` 事件，例如使用 `onClickCapture` 处理点击事件的捕获阶段，而不是 `onClick`。

### 阻止冒泡事件分三种情况
A、阻止合成事件间的冒泡，用e.stopPropagation();
```js
import React,{ Component } from 'react';
import ReactDOM,{findDOMNode} from 'react-dom';

class Counter extends Component{
    constructor(props){
        super(props);
        this.state = {
            count:0,
        }
    }

    handleClick(e){
        // 阻止合成事件间的冒泡
        e.stopPropagation();
        this.setState({count:++this.state.count});
    }

    testClick(){
        console.log('test')
    }

    render(){
        return(
            <div ref="test" onClick={()=>this.testClick()}>
                <p>{this.state.count}</p>
                <a ref="update" onClick={(e)=>this.handleClick(e)}>更新</a>
            </div>
        )
    }
}

var div1 = document.getElementById('content');
ReactDOM.render(<Counter/>,div1,()=>{});
```

B、阻止合成事件与最外层`document`上的事件间的冒泡，用`e.nativeEvent.stopImmediatePropagation()`;
```js
import React,{ Component } from 'react';
import ReactDOM,{findDOMNode} from 'react-dom';

class Counter extends Component{
    constructor(props){
        super(props);
        this.state = {
            count:0,
        }
    }

    handleClick(e){
        // 阻止合成事件与最外层document上的事件间的冒泡
        e.nativeEvent.stopImmediatePropagation();
        this.setState({count:++this.state.count});
    }

    render(){
        return(
            <div ref="test">
                <p>{this.state.count}</p>
                <a ref="update" onClick={(e)=>this.handleClick(e)}>更新</a>
            </div>
        )
    }

    componentDidMount() {
        document.addEventListener('click', () => {
            console.log('document');
        });
    }
}

var div1 = document.getElementById('content');

ReactDOM.render(<Counter/>,div1,()=>{});
```

### C、阻止合成事件与除最外层document上的原生事件上的冒泡，通过判断e.target来避免
```js
import React,{ Component } from 'react';
import ReactDOM,{findDOMNode} from 'react-dom';

class Counter extends Component{
    constructor(props){
        super(props);

        this.state = {
            count:0,
        }
    }

    handleClick(e){
        this.setState({count:++this.state.count});
    }
    render(){
        return(
            <div ref="test">
                <p>{this.state.count}</p>
                <a ref="update" onClick={(e)=>this.handleClick(e)}>更新</a>
            </div>
        )
    }

    componentDidMount() {
        document.body.addEventListener('click',e=>{
            // 通过e.target判断阻止冒泡
            if(e.target&&e.target.matches('a')){
                return;
            }
            console.log('body');
        })
    }
}

var div1 = document.getElementById('content');

ReactDOM.render(<Counter/>,div1,()=>{});
```

### stackoverflow 

https://stackoverflow.com/questions/24415631/reactjs-syntheticevent-stoppropagation-only-works-with-react-events

React uses event delegation with a single event listener on document for events that bubble, like 'click' in this example, which means stopping propagation is not possible; the real event has already propagated by the time you interact with it in React. stopPropagation on React's synthetic event is possible because React handles propagation of synthetic events internally.

Working JSFiddle with the fixes from below: http://jsfiddle.net/7LEDT/6/

React Stop Propagation on jQuery Event

Use `Event.stopImmediatePropagation` to prevent your other (jQuery in this case) listeners on the root from being called. It is supported in IE9+ and modern browsers.
```js
stopPropagation: function(e){
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
},
```
- Caveat: Listeners are called in the order in which they are bound. React must be initialized before other code (jQuery here) for this to work.

jQuery Stop Propagation on React Event

Your jQuery code uses event delegation as well, which means calling stopPropagation in the handler is not stopping anything; the event has already propagated to document, and React's listener will be triggered.

```js
// Listener bound to `document`, event delegation
$(document).on('click', '.stop-propagation', function(e){
    e.stopPropagation();
});
```
To prevent propagation beyond the element, the listener must be bound to the element itself:
```js
// Listener bound to `.stop-propagation`, no delegation
$('.stop-propagation').on('click', function(e){
    e.stopPropagation();
});
```
Clarified that delegation is necessarily only used for events that bubble. For more details on event handling, React's source has descriptive comments: https://github.com/facebook/react/blob/3b96650e39ddda5ba49245713ef16dbc52d25e9e/src/renderers/dom/client/ReactBrowserEventEmitter.js#L23