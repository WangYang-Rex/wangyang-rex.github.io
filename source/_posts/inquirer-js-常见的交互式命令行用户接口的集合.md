---
title: inquirer.js-常见的交互式命令行用户接口的集合
date: 2017-05-31 10:46:27
tags: [node, nodejs]
---

创建交互式命令行用户接口
![](/images/page/inquirer/1.png)

github地址： [https://github.com/SBoudrias/Inquirer.js](https://github.com/SBoudrias/Inquirer.js)

<!--more-->

### Installation
```js
npm install inquirer
```

```js
var inquirer = require('inquirer');
inquirer.prompt([/* Pass your questions in here */]).then(function (answers) {
	// Use user feedback for... whatever!!
});
```

### Examples
```js
/**
 * Pizza delivery prompt example
 * run example by writing `node pizza.js` in your console
 */

'use strict';
var inquirer = require('..');

console.log('Hi, welcome to Node Pizza');

var questions = [
  {
    type: 'confirm',
    name: 'toBeDelivered',
    message: 'Is this for delivery?',
    default: false
  },
  {
    type: 'input',
    name: 'phone',
    message: 'What\'s your phone number?',
    validate: function (value) {
      var pass = value.match(/^([01]{1})?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i);
      if (pass) {
        return true;
      }

      return 'Please enter a valid phone number';
    }
  },
  {
    type: 'list',
    name: 'size',
    message: 'What size do you need?',
    choices: ['Large', 'Medium', 'Small'],
    filter: function (val) {
      return val.toLowerCase();
    }
  },
  {
    type: 'input',
    name: 'quantity',
    message: 'How many do you need?',
    validate: function (value) {
      var valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
    filter: Number
  },
  {
    type: 'expand',
    name: 'toppings',
    message: 'What about the toppings?',
    choices: [
      {
        key: 'p',
        name: 'Pepperoni and cheese',
        value: 'PepperoniCheese'
      },
      {
        key: 'a',
        name: 'All dressed',
        value: 'alldressed'
      },
      {
        key: 'w',
        name: 'Hawaiian',
        value: 'hawaiian'
      }
    ]
  },
  {
    type: 'rawlist',
    name: 'beverage',
    message: 'You also get a free 2L beverage',
    choices: ['Pepsi', '7up', 'Coke']
  },
  {
    type: 'input',
    name: 'comments',
    message: 'Any comments on your purchase experience?',
    default: 'Nope, all good!'
  },
  {
    type: 'list',
    name: 'prize',
    message: 'For leaving a comment, you get a freebie',
    choices: ['cake', 'fries'],
    when: function (answers) {
      return answers.comments !== 'Nope, all good!';
    }
  }
];

inquirer.prompt(questions).then(function (answers) {
  console.log('\nOrder receipt:');
  console.log(JSON.stringify(answers, null, '  '));
});

```

运行效果：
![](/images/page/inquirer/2.png)
![](/images/page/inquirer/3.png)
