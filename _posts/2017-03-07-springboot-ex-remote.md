---
layout: post
title: (SpringBoot) Remoting 예제 (RMI, HTTP)
category : Java
tags : [springboot,rmi,remote,http]
---
Spring에서 RMI사용 예제는 많은데 SpringBoot에서 XML없이 사용하는 예제는 찾기 힘들더군요.   
[Annotation을 Customizing해서 사용하는 예제](https://earldouglas.com/posts/spring-remoting-annotation.html)를 찾았는데 조금 쓰기 편하게 고쳐봤습니다.   

구조
----
Spring에서 지원하는 Remoting 중 HTTP/RMI 통신 예제만 작성하였습니다    
Bean등록방식은 `@Bean`어노테이션을 사용하는 방법과 `@Service`로 등록한 Bean 객체를 커스텀 어노테이션을 적용하여 등록하는 방식으로 구현하였습니다.


실제 서비스할 객체는 `DefaultService`인터페이스와 , `DefaultServiceImpl`구현 객체로 아래와 같습니다.

    {% highlight java %}
    public interface DefaultService
    {
         String say(String prefix);
    }

    @Service("defaultService")
    public class DefaultServiceImpl implements DefaultService
    {
        @Override
        public String say(String prefix) {
            return "Hello " + prefix;
        }
    }
    {% endhighlight %}



@Bean 어노테이션 사용방식
----
RMI의 경우 ServiceName과 Port정보를 직접등록하나 HTTP는 Bean이름과 컨테이너의 포트정보를 그대로 사용합니다.

아래 예제의 경우 다음과 같은 주소로 lookup됩니다.

- RMI : rmi://127.0.0.1:1099/DefaultServiceRmiRemoteBean
- HTTP : http://127.0.0.1:{server.port}/DefaultServiceHttpRemoteBean    


    {% highlight java %}
    @Configuration
    public class RemoteConfiguration implements BeanPostProcessor
    {
        ......

        @Bean
        public RmiServiceExporter regRmiService()
        {
            RmiServiceExporter rmiServiceExporter = new RmiServiceExporter();
            rmiServiceExporter.setServiceName("DefaultServiceRmiRemoteBean");
            rmiServiceExporter.setService(new DefaultServiceImpl());
            rmiServiceExporter.setServiceInterface(DefaultService.class);
            rmiServiceExporter.setRegistryPort(1099);

            return rmiServiceExporter;
        }

        @Bean("/DefaultServiceHttpRemoteBean")
        public HttpInvokerServiceExporter regHttpService()
        {
            HttpInvokerServiceExporter httpInvokerServiceExporter = new HttpInvokerServiceExporter();
            httpInvokerServiceExporter.setServiceInterface(DefaultService.class);
            httpInvokerServiceExporter.setService(new DefaultServiceImpl());
            httpInvokerServiceExporter.afterPropertiesSet();
            return httpInvokerServiceExporter;
        }
    }
    {% endhighlight %}


커스터마이징 어노테이션 사용방식
----
아래와 같이 Remoting 객체를 표시할 어노테이션을 생성합니다.


    {% highlight java %}
    @Retention(RetentionPolicy.RUNTIME)
    @Target({ ElementType.TYPE })
    public @interface RemoteType
    {
        Protocol protocol() default Protocol.HTTP;

        int port() default -1;

        @Required
        Class<?> serviceInterface();
    }
    {% endhighlight %}


통신 프로토콜및 ServiceExporter를 구현하는 enum객체를 만듭니다.


    {% highlight java %}
    public enum Protocol
    {
    HTTP {
        @Override
        public Object getServiceExporter(Object bean, String beanName, RemoteType remoteType) {
            HttpInvokerServiceExporter httpInvokerServiceExporter = new HttpInvokerServiceExporter();
            httpInvokerServiceExporter.setServiceInterface(remoteType.serviceInterface());
            httpInvokerServiceExporter.setService(bean);
            httpInvokerServiceExporter.afterPropertiesSet();
            return httpInvokerServiceExporter;
        }
    },

    RMI {
        @Override
        public Object getServiceExporter(Object bean, String beanName, RemoteType remoteType) {
            RmiServiceExporter rmiServiceExporter = new RmiServiceExporter();
            rmiServiceExporter.setServiceInterface(remoteType.serviceInterface());
            rmiServiceExporter.setService(bean);
            rmiServiceExporter.setServiceName(beanName);
            if (remoteType.port() != -1)
            {
                rmiServiceExporter.setServicePort(remoteType.port());
            }
            try
            {
                rmiServiceExporter.afterPropertiesSet();
            }
            catch (RemoteException e)
            {
                throw new FatalBeanException("Exception initializing RmiServiceExporter", e);
            }
            return rmiServiceExporter;
        }
    };

    abstract public Object getServiceExporter(Object bean, String beanName, RemoteType remoteType);
    }
    {% endhighlight %}


그 다음 `@RemoteType`어노테이션으로 다음과 같이 Service객체를 정의합니다.

    {% highlight java %}
    @Service("/DefaultServiceHttpRemote")
    @RemoteType(protocol = Protocol.HTTP, serviceInterface = DefaultService.class)
    public class DefaultServiceHttpRemoteImpl extends DefaultServiceImpl {}

    @Service("DefaultServiceRmiRemote")
    @RemoteType(protocol = Protocol.RMI, serviceInterface = DefaultService.class)
    public class DefaultServiceRmiRemoteImpl extends DefaultServiceImpl
    {% endhighlight %}

서비스하는 객체인 `DefaultServiceImpl`이나 `DefaultService`인터페이스에 정의하지 않고 상속받은 객체를 만드는 이유는 SpringBoot에서 해당 서비스를 직접 사용할 수 있도록 하기 위함입니다.

Bean생성시 `BeanPostProcessor`를 이용하여 위 두 Remoting객체를 ServiceExporter객체로 변경해줍니다.    

    {% highlight java %}
    @Configuration
    public class RemoteConfiguration implements BeanPostProcessor
    {
        ......

        @Override
        public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException
        {
            RemoteType remoteType = AnnotationUtils.findAnnotation(bean.getClass(), RemoteType.class);
            return (remoteType == null)? bean : remoteType.protocol().getServiceExporter(bean, beanName, remoteType);
        }

        ......
    }
    {% endhighlight %}

그 외 구현사항
----
동작 확인을 위해 호출 가능한 Controller를 아래와 같이 구현해 두었습니다.

`io.jistol.sample.remote.controller.HttpController`    
`io.jistol.sample.remote.controller.RmiController`
- http://127.0.0.1:${server.port}/${protocol}/service : DefaultServiceImpl을 직접 호출
- http://127.0.0.1:${server.port}/${protocol}/bean : @Bean 어노테이션으로 구현한 객체를 이용하여 통신
- http://127.0.0.1:${server.port}/${protocol}/extend : 커스터마이징 어노테이션으로 구현한 객체를 이용하여 통신

위 Controller를 호출하여 Test하는 단위테스트는 아래에 구현되어 있습니다.

`io.jistol.sample.remote.test.SampleSpringbootRemoteApplicationTests`

소스 링크
----
[ex-springboot-remote](https://github.com/jistol/sample/tree/master/ex-springboot-remote)

참고
----
[Custom annotation configuration for Spring Remoting](https://earldouglas.com/posts/spring-remoting-annotation.html)    
