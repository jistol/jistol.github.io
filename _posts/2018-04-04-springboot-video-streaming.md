---
layout: post
title: HTML5(video) + Spring Boot(Tomcat)로 동영상 재생하기
category : Spring
tags : [spring,springboot,video]
---
HTML5의 video태그를 이용하여 파일 재생시 SpringBoot 에서 어떻게 설정해야하는지 간단한 방법이 있어 정리합니다.

샘플소스
----

기존 다른 방식들은 response에 파일을 직접 쓰도록 로직에 모두 구현을 했어야 하는데 `StreamingResponseBody`를 이용하여 아래와 같이 간단해집니다.

```java
...
    private final String DIR = "${FILE_DIR}/";

    @GetMapping("/download")
    public StreamingResponseBody stream(HttpServletRequest req, @RequestParam("fileName") String fileName) throws Exception {
        File file = new File(DIR + fileName);
        final InputStream is = new FileInputStream(file);
        return os -> {
            readAndWrite(is, os);
        };
    }

    private void readAndWrite(final InputStream is, OutputStream os) throws IOException {
        byte[] data = new byte[2048];
        int read = 0;
        while ((read = is.read(data)) > 0) {
            os.write(data, 0, read);
        }
        os.flush();
    }
...
```

HTML 소스에서는 아래와 같이 호출합니다.

```html
...
    <video controls src="/download?fileName=test.mp4">
        not use video
    </video>
...
```

원리
----
1. 위 방식은 Progressive Download방식으로 서버에서는 요청시마다 전체 파일을 보내주고 video 태그에서는 점진적으로 필요한 만큼씩 OutputStream에서 읽어가게 됩니다.
실제로 `readAndWrite` 메소드의 while구문에서 로그를 찍어보면 동영상을 재생하지 않을 경우 write를 중간에 멈춰 있는 것을 볼 수 있습니다.

2. `StreamingResponseBody` 클래스는 `TaskExecutor`을 이용하여 비동기 서블릿 실행을 지원해줍니다. Spring API 문서를 보면 아래와 같이 설명이 되어 있습니다.

```text
A controller method return value type for asynchronous request processing where the application can write directly to the response OutputStream without holding up the Servlet container thread.
Note: when using this option it is highly recommended to configure explicitly the TaskExecutor used in Spring MVC for executing asynchronous requests. Both the MVC Java config and the MVC namespaces provide options to configure asynchronous handling. If not using those, an application can set the taskExecutor property of RequestMappingHandlerAdapter.
```

3. 비동기이긴 하나 논블락킹은 아니기 때문에 별도 Thread를 계속 점유하고 있는 문제가 있습니다.
4. 동영상 플레이를 하지 않고 대기시 async timeout 설정을 별도로 하지 않으면 중간에 연결이 끊겨버리며 `DISPATCH_PENDING`에러를 발생시킵니다. 또한 video태그는 다시 동영상을 재생하기 위해 같은 URL을 또 호출하게 되고 서버는 처음부터 다시 파일을 보내게 됩니다.

참고
----
Streaming 기술 이해 : <http://linuxism.tistory.com/1267>
Spring API (StreamingResponseBody): <https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/servlet/mvc/method/annotation/StreamingResponseBody.html>
Itube - Spring Boot Streaming Response Body : <https://github.com/shazin/itube>

