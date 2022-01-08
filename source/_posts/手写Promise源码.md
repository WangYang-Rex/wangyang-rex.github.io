---
title: 手写Promise源码
date: 2021-12-20 21:05:44
tags: [javascript]
---

https://juejin.cn/post/6994594642280857630

```js
class MyPromise {
  constructor(fn) {
    this.PromiseResult = null; // 终值
    this.PromiseState = 'pending'; // 状态

    this.onFulfiledCallbacks = []; // 保存成功回调
    this.onRejectedCallbacks = []; // 保存失败回调
    // 绑定this
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
    try {
      fn(this.resolve, this.reject);
    } catch(e) {
      this.reject(e)
    }
  }

  resolve (value) {
    // 状态不可变
    if(this.PromiseState !== 'pending') return
    this.PromiseState = 'fulfiled';
    this.PromiseResult = value;

    while (this.onFulfiledCallbacks.length) {
      this.onFulfilledCallbacks.shift()(this.PromiseResult)
    }
  }
  reject (reason) {
    // 状态不可变
    if(this.PromiseState !== 'pending') return
    this.PromiseState = 'rejected';
    this.PromiseResult = reason;

    while (this.onRejectedCallbacks.length) {
      this.onRejectedCallbacks.shift()(this.PromiseResult)
    }
  }

  // 接受两个参数
  // 1、then方法本身会返回一个新的Promise对象
  // 2、如果返回值是promise对象，返回值为成功，新promise就是成功
  // 3、如果返回值是promise对象，返回值为失败，新promise就是失败
  // 4、如果返回值非promise对象，新promise对象就是成功，值为此返回值
  then (onFulfilled, onRejected) {
    // 返回 Promise 对象
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };

    let thenPromise = new MyPromise((resolve, reject)=>{

      const resolvePromise = cb => {

        setTimeout(()=>{
          try {
            const x = cb(this.PromiseResult);
            if(x === thenPromise) {
              throw new Error('不能返回自身')
            }
            if(x instanceof MyPromise) {
              // 如果返回值是Promise
              // 如果返回值是promise对象，返回值为成功，新promise就是成功
              // 如果返回值是promise对象，返回值为失败，新promise就是失败
              // 谁知道返回的promise是失败成功？只有then知道
              x.then(resolve, reject)
            } else {
              // 非Promise就直接成功
              resolve(x)
            }
          } catch(err) {
            reject(err)
            throw new Error(err)
          }
        })
      }

      if(this.PromiseState == 'fulfiled') {
        // 如果当前为成功状态，执行第一个回调
        
        // let x = onFulfilled(this.PromiseResult);
        // if(x instanceof MyPromise) {
        //   x.then(resolve, reject);
        // } else {
        //   resolve(x)
        // }
        resolvePromise(onFulfilled)
      } else if(this.PromiseState == 'rejected') {
        // 如果当前为失败状态，执行第二个回调
        
        // let x = onRejected(this.PromiseResult);
        // if(x instanceof MyPromise) {
        //   x.then(reject, reject)
        // } else {
        //   reject(x);
        // }
        resolvePromise(onRejected)
      } else if(this.PromiseState == 'pending') {
        // 如果状态为待定状态，暂时保存两个回调
        // this.onFulfilledCallbacks.push(onFulfilled.bind(this))
        // this.onRejectedCallbacks.push(onRejected.bind(this))
        this.onFulfilledCallbacks.push(resolvePromise.bind(this, onFulfilled))
        this.onRejectedCallbacks.push(resolvePromise.bind(this, onRejected))
      }
    })

    return thenPromise;
  }
}
```