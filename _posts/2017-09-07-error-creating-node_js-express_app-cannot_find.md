---
layout: post
title: "Error creating Node.js Express App. Cannot find - WebStorm에서 Node.js프로젝트 생성시 오류"
category : "Node.js"
tags : [nodejs,express,troubleshooting,webstorm,expressgenerator]
---
Node.js로 개발해보려고 WebStorm에서 Node.js 프로젝트를 생성하다가 아래와 같은 오류를 만났습니다.

```text
Error creating Node.js Express App. Cannot find 
```
![create-project](/assets/img/nodejs/error-creating-node_js-express_app-cannot_find/1.png)      
![error-message](/assets/img/nodejs/error-creating-node_js-express_app-cannot_find/2.png)     

구글링을 해보니 답변은 `express-generator`를 이용하여 만든 후 WebStorm에서 해당 폴더를 오픈하여 프로젝트를 생성하라고 하더군요. ([Error creating Node.js Express App. Cannot find](https://stackoverflow.com/questions/43125932/error-creating-node-js-express-app-cannot-find))       
생성 방법은 아래와 같습니다.    

```console
$ npm install -g express-generator
$ express <project_name>
$ cd <project_name>
$ npm install
```
> 자세한 생성 방법은 [express-generator - Node.js + Express 프로젝트 생성하기](/node.js/2017/09/07/express-generator/)를 참고하세요.      

위 명령 실행 후 WebStrom에서 Open하여 사용하면 정상적으로 만들어져 있는것을 확인 할 수 있습니다.   

또 다른 방법으로는 WebStorm에서 Node.js 프로젝트 생성시 사용하는 `express-generator`버전을 낮춰서 해결 할 수 있는데 "14.14.1"로 낮추면 정상 생성 가능합니다.    
![downgrade-version](/assets/img/nodejs/error-creating-node_js-express_app-cannot_find/3.png)      

> 4.13.0 버전 이하로 낮출 경우 SASS를 쓸 수 없으니 주의하세요 

참고
----
[Error creating Node.js Express App. Cannot find](https://stackoverflow.com/questions/43125932/error-creating-node-js-express-app-cannot-find)




