---
layout: post
title: Tomcat 8 세션 클러스터링 하기
category : Java
tags : [tomcat,clustering,nginx,session]
---
WAS간 세션 공유해야하는 일이 생겨서 Tomcat Clustering을 한 내용을 정리해봅니다.    

설정하기
----
[Apache Tomcat 8 - Clustering/Session Replication HOW-TO](http://tomcat.apache.org/tomcat-8.5-doc/cluster-howto.html) 문서를 보면 정말 간단합니다.   

```xml
<!-- server.xml -->
<Cluster className="org.apache.catalina.ha.tcp.SimpleTcpCluster"/>
```

설치 후 기본으로 포함되어 있는 server.xml 파일에서 위 라인의 주석만 제거해주면 설정 끝.
그 다음에 `WEB-INF/web.xml` 파일에 아래와 같이 한 줄 넣어주면 됩니다.    

```xml
<!-- web.xml -->
<distributable/>
```

위와 같이 작성하면 기본적으로 아래와 같이 동작합니다.

1. multicast 방식으로 동작하며 address는 '228.0.0.4', port는 '45564'를 사용하고 서버 IP는 `java.net.InetAddress.getLocalHost().getHostAddress()`로 얻어진 IP 값으로 송출됩니다.
2. 먼저 구동되는 서버부터 4000 ~ 4100 사이의 TCP port를 통해 reqplication message를 listening합니다.
3. Listener는 `ClusterSessionListener`, interceptor는 `TcpFailureDetector`와 `MessageDispatchInterceptor`가 설정됩니다.

아래와 같이 설정되었다고 보면됩니다.

```xml
<Cluster className="org.apache.catalina.ha.tcp.SimpleTcpCluster" channelSendOptions="8">

    <Manager className="org.apache.catalina.ha.session.DeltaManager" expireSessionsOnShutdown="false" notifyListenersOnReplication="true"/>

    <Channel className="org.apache.catalina.tribes.group.GroupChannel">
        <Membership className="org.apache.catalina.tribes.membership.McastService"
                    address="228.0.0.4"
                    port="45564"
                    frequency="500"
                    dropTime="3000"/>
        <Receiver className="org.apache.catalina.tribes.transport.nio.NioReceiver"
                  address="auto"
                  port="4000"
                  autoBind="100"
                  selectorTimeout="5000"
                  maxThreads="6"/>

        <Sender className="org.apache.catalina.tribes.transport.ReplicationTransmitter">
            <Transport className="org.apache.catalina.tribes.transport.nio.PooledParallelSender"/>
        </Sender>
        <Interceptor className="org.apache.catalina.tribes.group.interceptors.TcpFailureDetector"/>
        <Interceptor className="org.apache.catalina.tribes.group.interceptors.MessageDispatchInterceptor"/>
    </Channel>

    <Valve className="org.apache.catalina.ha.tcp.ReplicationValve" filter=""/>
    <Valve className="org.apache.catalina.ha.session.JvmRouteBinderValve"/>

    <Deployer className="org.apache.catalina.ha.deploy.FarmWarDeployer"
            tempDir="/tmp/war-temp/"
            deployDir="/tmp/war-deploy/"
            watchDir="/tmp/war-listen/"
            watchEnabled="false"/>

    <ClusterListener className="org.apache.catalina.ha.session.ClusterSessionListener"/>
</Cluster>
```

Manager
----
세션을 어떻게 복제할지를 책임지는 객체로 Clustering시 사용되는 매니저는 아래와 같이 3가지 입니다.

1. DeltaManager      
모든 노드에 동일한 세션을 복제합니다. 정보가 변경될때마다 복제하기 때문에 노드 개수가 많을 수록 네트워크 트래픽이 높아지고 메모리 소모가 심해집니다.    

- notifyListenersOnReplication : 다른 tomcat에서 세션이 생성/소멸시 알림을 받을지 여부입니다.
- expireSessionsOnShutdown : tomcat서버가 shutdown될 때 모든 노드의 모든 세션들을 expire할지 여부로 default는 false입니다. 

2. BackupManager      
Primary Node와 Backup Node로 분리되어 모든 노드에 복제하지 않고 단 Backup Node에만 복제합니다. 하나의 노드에만 복제하기 때문에 DeltaManager의 단점을 커버할 수 있고 failover도 지원한다고 합니다.    

3. PersistentManager
DB나 파일시스템을 이용하여 세션을 저장합니다. IO문제가 생기기 떄문에 실시간성이 떨어집니다.   

참고 : [The ClusterManager object](http://tomcat.apache.org/tomcat-8.5-doc/config/cluster-manager.html)

Channel
----
서로 다른 tomcat간의 메시지 송수신에 관련된 하위 Component를 그룹핑합니다.    
하위 Component로는 `Membership`, `Sender`, `Sender/Transport`, `Receiver`, `Interceptor`가 있고 현재 Channel구현체는 `org.apache.catalina.tribes.group.GroupChannel`가 유일합니다.    

참고 : [The Cluster Channel object](http://tomcat.apache.org/tomcat-8.5-doc/config/cluster-channel.html)     

Channel/Membership
----
Cluster안의 노드들을 동적으로 분별하는데 multicast IP/PORT를 통해 `frequency`에 설정된 간격으로 각 노드들이 UDP packet을 날려 heartbeat 확인합니다.    
`dropTime`에 설정된 시간동안 heartbeat가 없을 경우 장애로 판단하고 각 노드에 알리게 됩니다.     

참고 : [The Cluster Membership object](http://tomcat.apache.org/tomcat-8.5-doc/config/cluster-membership.html)

Channel/Sender, Channel/Sender/Transport
----
Sender는 노드에서 Cluster로 메시지를 보내는 역활을 합니다. 사실상 빈 껍데기로 상세 역확을 Transport에서 정의됩니다.     
Transport는 기본적으로 `org.apache.catalina.tribes.transport.nio.PooledParallelSender`를 사용하는데 non-blocking 방식으로 동시에 여러 노드로 메시지를 보낼수도, 하나의 노드에 여러 메시지를 동시에 보낼수도 있습니다.
`org.apache.catalina.tribes.transport.bio.PooledMultiSender`는 blocking 방식을 사용합니다.      

참고 : [The Cluster Sender object](http://tomcat.apache.org/tomcat-8.5-doc/config/cluster-sender.html)

Channel/Receiver
----
Cluster로부터 메시지를 수신하는 역활을 하며 blocking방식 `org.apache.catalina.tribes.transport.bio.BioReceiver`와 non-blocking방식인 `org.apache.catalina.tribes.transport.nio.NioReceiver`을 지원합니다.     
tomcat에서는 non-blocking방식을 추천하며 노드수가 많아져서 제한된 thread를 통해 많은 메시지를 받아들일 수 있다고 합니다. 기본적으로 노드당 1개의 thread를 할당합니다.    

참고 : [The Cluster Receiver object](http://tomcat.apache.org/tomcat-8.5-doc/config/cluster-receiver.html)

Channel/Interceptor
----
Membership 알림 또는 메시지를 가로챌수 있고, documentation에도 각 interceptor에 대한 자세한 설명은 안나왔지만 각 클래스 명으로 역활 구분이 가능한 수준인것 같습니다.    

참고 : [The Channel Interceptor object](http://tomcat.apache.org/tomcat-8.5-doc/config/cluster-interceptor.html)   


Valve
----
`org.apache.catalina.ha.ClusterValve`를 구현한 객체로 일반적인 [Tomcat Valve](http://tomcat.apache.org/tomcat-8.5-doc/config/valve.html)처럼 HTTP Request processing에 관여하는 역활을 하는데 clustering시 중간 interceptor역활을 합니다.    
예를 들어 `org.apache.catalina.ha.tcp.ReplicationValve`의 경우 HTTP Request가 끝나는 시점에 다른 복제를 해야할지 말아야 할지 cluster에 알리는 역활을 합니다.    
`org.apache.catalina.ha.session.JvmRouteBinderValve`의 경우 mod_jk를 사용중 failover시 session에 저장한 jvmWorker속성을 변경하여 다음 request부터는 해당 노드에 고정시킵니다.     

참고 : [The Cluster Valve object](http://tomcat.apache.org/tomcat-8.5-doc/config/cluster-valve.html)

Deployer
----
WAR배포시 cluster안의 다른 노드에도 같이 배포해줍니다.     

참고:[The Cluster Deployer object](http://tomcat.apache.org/tomcat-8.5-doc/config/cluster-deployer.html)

ClusterListener
----
Cluster내 다른 노드의 메시지를 받습니다.
DeltaManager를 사용할 경우 Manager는 ClusterSessionListener를 통해 메시지를 받게 됩니다.    

참고:[The ClusterListener object](http://tomcat.apache.org/tomcat-8.5-doc/config/cluster-listener.html)

기타
----
AWS를 포함한 모든 클라우드 서비스는 multicast를 지원하지 않고 있어 tomcat clustering 방식을 사용할 수 없습니다.    


참고
----
[Apache Tomcat 8 - Clustering/Session Replication HOW-TO](http://tomcat.apache.org/tomcat-8.5-doc/cluster-howto.html)     
[Apache Tomcat 8 Configuration Reference - The Cluster object](http://tomcat.apache.org/tomcat-8.5-doc/config/cluster.html)  
[Tomcat Clustering Series Part 4 : Session Replication using Backup Manager](http://www.ramkitech.com/2012/12/tomcat-clustering-series-part-4-session.html)    
[Tomcat Session StandardManager](http://sarc.io/index.php/tomcat/249-tomcat-session-standardmanager)
