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

참고
----
[Apache Tomcat 8 - Clustering/Session Replication HOW-TO](http://tomcat.apache.org/tomcat-8.5-doc/cluster-howto.html)     
[Apache Tomcat 8 Configuration Reference - The Cluster object](http://tomcat.apache.org/tomcat-8.5-doc/config/cluster.html)  
[Tomcat Clustering Series Part 4 : Session Replication using Backup Manager](http://www.ramkitech.com/2012/12/tomcat-clustering-series-part-4-session.html)    
[Tomcat Session StandardManager](http://sarc.io/index.php/tomcat/249-tomcat-session-standardmanager)
