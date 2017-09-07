---
layout: post
title: "express-generator - Node.js + Express 프로젝트 생성하기"
category : "Node.js"
tags : [nodejs,express,expressgenerator]
---
처음 Node.js 개발환경을 구성 할 때 이것저것 설정할게 많은데 간단하게 "Node.js + Express"구조의 뼈대를 만들어주는 `express-generator`라는 도구가 있습니다.     
> "Java + Spring Boot" 개발환경의 뼈대를 만들어주는 [Spring Initializr](/java/2017/03/07/springboot-initilizr/)와 비슷한 녀석입니다.        

설치
----
npm을 통해서 아래와 같이 설치합니다.    
```console
$ npm install -g express-generator
```

프로젝트 만들기
----
`express`라는 명령어로 실행이 가능한데 도움말을 보면 아래와 같이 설정을 볼 수 있습니다.

```console
$ express -h

  Usage: express [options] [dir]

  Options:

    -h, --help           output usage information
        --version        output the version number
    -e, --ejs            add ejs engine support
        --pug            add pug engine support
        --hbs            add handlebars engine support
    -H, --hogan          add hogan.js engine support
    -v, --view <engine>  add view <engine> support (dust|ejs|hbs|hjs|jade|pug|twig|vash) (defaults to jade)
    -c, --css <engine>   add stylesheet <engine> support (less|stylus|compass|sass) (defaults to plain css)
        --git            add .gitignore
    -f, --force          force on non-empty directory
```

먼저 `express`를 이용하여 뼈대가 되는 소스를 만들고 해당 프로젝트 폴더 내에서 `npm install`을 실행하여 dependency를 다운 받고 사용하면 됩니다.   
만약 template engine은 `handlebars`를 사용하고 css engine은 `sass`를 사용한다면 아래와 같이 실행하시면 됩니다.

```console
$ express --view=hbs --css=sass <project dir>
$ cd <project dir>
$ npm install
$ npm start 
```

기본적으로 package.json에 `start`커맨드를 통해 서버를 올릴 수 있도록 script를 만들어주며 실행시 [http://localhost:3000](http://localhost:3000)으로 접속하여 동작 화면을 확인 할 수 있습니다.         
![run-server](/assets/img/express-generator/1.png)      

app.js 파일을 열면 다음과 같이 template/css engine이 설정 되어 있는 것을 확인 할 수 있습니다.     

```javascript
// app.js
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

...

app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
```    

SASS 변경하기
----
설정을 보면 기본적으로 sass를 사용하도록 되어 있습니다. 저는 scss확장자를 쓰고 싶으니 변경해 보도록 하겠습니다.    

```javascript
// app.js
app.use(sassMiddleware({
  ... 
  indentedSyntax: false, // true = .sass and false = .scss
  ...
}));
``` 

기본적으로 CSS경로는 `/public/stylesheets` 하위로 설정되어 있습니다. sass파일을 scss로 바꿉니다.

```console
style.sass -> style.scss
```

그리고 설정을 scss문법에 맞게 수정합니다.

```scss
// style.scss
body {
  padding: 51px;
  font: 25px "Lucida Grande", Helvetica, Arial, sans-serif;
  color: #445544;
}

a {
  color: #AAB7FF;
}
```

`node-sass-middleware`의 옵션 중에 css파일을 압축해주는 'compressed' 옵션이 있습니다. 아래와 같이 적용해봅니다.     

```javascript
// app.js
app.use(sassMiddleware({
  ... 
  outputStyle: 'compressed',
  ...
}));
```

적용이 완료되고 `npm start`명령을 통해 서버를 실행하고 [http://localhost:3000](http://localhost:3000)을 호출하여 다운받은 style.css파일을 확인하면 다음과 같이 변경된 것을 확인 할 수 있습니다.    
> css/template파일을 변경시 바로 적용되나 app.js파일 수정시에는 반드시 express server를 재시작해야 합니다.      

![compressed-scss-file](/assets/img/express-generator/2.png)          

참고
----
[npm express-generator](https://www.npmjs.com/package/express-generator)         
[npm node-sass-middleware](https://www.npmjs.com/package/node-sass-middleware)          

 


