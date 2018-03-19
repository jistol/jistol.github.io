---
layout: post
title:  SpringBoot + ES6 + React 기반 보일러플레이트 소스
category : Web
tags : [es6,springboot,react,boilerplate]
---
SpringBoot/ES6/React 기반으로 개발시 기반 소스로 바로 사용할 수 있는 보일러플레이트입니다.    
해당 소스에는 간단한 React 샘플이 포함되어 있습니다.

소스를 직접 확인하고 싶으시면 다음 주소에서 확인하시기 바랍니다.

GitHub URL : <https://github.com/jistol/boilerplate-boot-es6>

Specification
----
1. Backend
- SpringBoot 2.0.0.RELEASE (Spring MVC, Embedded Tomcat, Thymeleaf)

2. Frontend Builder
- Package manager : npm
- Bundler : webpack

3. ES6 Package
- babel
- react
- jquery
- bootstrap
- sass
- webpack-dev-server

Setup & Run
----
### Git 설치 및 소스 다운로드 ###

Git 설치주소 : <https://git-scm.com/downloads>     

소스 다운로드     

```vim
$ git clone "https://github.com/jistol/boilerplate-boot-es6.git" boilerplate-boot-es6.git
```

### npm 설치 및 초기화 ###    
npm은 Node.js를 설치시 같이 설치 가능합니다.

Node.js 설치주소 : <https://nodejs.org/en/>    

설치 후 ROOT폴더에서 아래 명령어를 통해 초기화를 실행합니다.    

```vim
$ npm install
``` 

위 명령어를 실행하면 `node_modules` 폴더가 생기면서 `package.json`에 포함된 라이브러리들이 다운로드 됩니다.    

### Backend 서버 실행 ###
Gradle 빌드를 통해 WAR파일을 생성하여 직접 실행 가능하나 SpringBoot를 실행 할 수 있는 Gradle Task 명령으로 실행하여 서버를 기동할 수 있습니다.    
Gradle Wrapper가 소스에 포함되어 있으므로 별도의 설치 과정없이 아래와 같이 실행 가능합니다.        

```vim
$ ./gradlew bootRun
```

서버는 기본적으로 8080 포트로 접근 가능합니다.    

### ES6 소스 변환 및 Frontend Dev서버 실행 ###       
일반적으로 ES6를 지원하는 브라우저에서 실행하거나 babel을 통해 호환 가능한 소스로 빌드 후 실행할 수 있는데, 본 소스는 후자의 케이스로 실행하도록 샘플이 작성되어 있습니다.    
변환은 아래와 같이 `package.json`에 npm 명령을 통해 실행 할 수 있도록 정의되어 있습니다.    

```javascript
...
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "npm run build-js",
    "build-js": "./node_modules/.bin/webpack --config webpack.config.babel.js",
    "dev": "NODE_ENV='local' ./node_modules/.bin/webpack-dev-server"
  },
...
```    

변환 실행은 아래와 같이 실행가능합니다.    

```vim
$ npm run build
```

또한 빠른 개발을 위해 변경사항을 바로 반영하기 위해서 `webpack-dev-server`를 실행 할 수 있습니다.    
`webpack-dev-server`에 대한 정의는 `webpack.config.babel.js` 파일의 아래 부분에서 확인 가능하며 NODE_ENV 값이 'local' 일 경우에만 동작하도록 설정되어 있습니다.     

```javascript
...
    if (process.env.NODE_ENV == 'local') {
        let url = `localhost`,
            protocol = `http`,
            devPort = 8090,
            proxyPort = 8080,
            demoEntry = {
            };

        config.entry = Object.assign({}, demoEntry, config.entry);

        config.devtool = 'inline-source-map';
        config.devServer = {
            inline: true,
            hot: true,
            historyApiFallback: true,
            host: url,
            port: devPort,
            proxy: {
                "!/dist/js/**": `${protocol}://${url}:${proxyPort}`,
                secure: false,
                changeOrigin: true,
            }
        };

        Object.keys(config.entry).forEach(key => {
            config.entry[key].push(`react-hot-loader/patch`);
            config.entry[key].push(`webpack-dev-server/client?${protocol}://${url}:${devPort}`);
            config.entry[key].push('webpack/hot/only-dev-server');
        });

        config.plugins.push(new webpack.HotModuleReplacementPlugin());
    }
...    
```

아래 명령을 통해 실행 할 수 있습니다.    

```vim
$ npm run dev
```

`webpack-dev-server`를 사용하기 위해서는 8090 포트로 접근하여야 합니다.    

<http://localhost:8090> 으로 접속하면 아래와 같이 index 페이지를 볼 수 있으며 링크 클릭시 간단한 React 샘플 예제를 확인 할 수 있습니다.   

![index page](/assets/img/java/boilerplate-springboot-es6-react/1.png)      
![react sample](/assets/img/java/boilerplate-springboot-es6-react/2.png)      
