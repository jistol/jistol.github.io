---
layout: post
title: Tomcat 8 Session Manager
category : Java
tags : [tomcat,clustering,session]
---
세션을 어떻게 복제/관리 할 지를 결정합니다.
Clustering에 사용되는 Manager는 `DeltaManager`, `BackupManager`, `PersistentManager`이며      
그 중 in-memory 방식은 `DeltaManager`, `BackupManager`를 사용해야합니다.    

StandardManager
----
tomcat에서 기본적으로 사용하는 Manager로 메모리에 세션을 가지고 있다가 tomcat이 중지될때 SESSIONS.ser라는 파일에 세션을 저장하고 재기동시 해당 파일의 내용을 메모리에 올리고 파일을 지웁니다.    
conf/context.xml의 pathname에 지정된 이름을 사용하며 파일을 생성하지 않으려면 `pathname=""`로 설정하면 됩니다.    

tomcat에 별도의 설정을 하지 않았을 경우 해당 Manager를 사용하게 됩니다.    

DeltaManager
----      
모든 노드에 동일한 세션을 복제합니다. 정보가 변경될때마다 복제하기 때문에 노드 개수가 많을 수록 네트워크 트래픽이 높아지고 메모리 소모가 심해집니다.    


BackupManager
----      
Primary Node와 Backup Node로 분리되어 모든 노드에 복제하지 않고 단 Backup Node에만 복제합니다. 하나의 노드에만 복제하기 때문에 DeltaManager의 단점을 커버할 수 있고 failover도 지원한다고 합니다.    
동작 방식은 아래 예를 참고하세요.   

- tomcat을 3대, 앞단 loadbalancer를 둔 상태로 session1이 접근합니다.
- session1이 tomcat1로 접속
- tomcat1은 정보저장(primary node)후 tomcat2에 정보전달(backup node)
- session1이 tomcat3으로 접속
- tomcat3은 session1의 정보가 없으므로 tomcat2에 정보 요청
- tomcat2는 tomcat3에게 정보 전달

PersistentManager
----
DB나 파일시스템을 이용하여 세션을 저장합니다. IO문제가 생기기 떄문에 실시간성이 떨어집니다.


각 Manager의 상세 옵션은 [Apache Tomcat 8 Configuration Reference - The Cluster object](http://tomcat.apache.org/tomcat-8.5-doc/config/cluster.html)에서 확인하세요.


참고
---
[Apache Tomcat 8 Configuration Reference - The Cluster object](http://tomcat.apache.org/tomcat-8.5-doc/config/cluster.html)  
[Tomcat Clustering Series Part 4 : Session Replication using Backup Manager](http://www.ramkitech.com/2012/12/tomcat-clustering-series-part-4-session.html)    
[Tomcat Session StandardManager](http://sarc.io/index.php/tomcat/249-tomcat-session-standardmanager)
