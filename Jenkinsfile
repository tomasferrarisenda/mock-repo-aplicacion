pipeline {

    agent {
        kubernetes {
        yaml """
    kind: Pod
    metadata:
  annotations:
    cni.projectcalico.org/containerID: ead5692f4fb202d93c330d207f60c380ce9751699a5bfd357b1cc32466a1662f
    cni.projectcalico.org/podIP: 10.42.2.164/32
    cni.projectcalico.org/podIPs: 10.42.2.164/32
  creationTimestamp: "2022-06-23T16:05:59Z"
  labels:
    jenkins/jenkins-test-jenkins-agent: "true"
    jenkins/label: kubepod
    jenkins/label-digest: 8ce0dddc0f3c2f1ca6c7dd739cb899616bd1f5fd
  name: default-fbgsp
  namespace: jenkins
  resourceVersion: "12876578"
  uid: 5c674432-17bb-4800-8b7b-d33767c116d7
spec:
  containers:
  - args:
    - 7e119e7216aee7ca9c90b8ea0522aece33c72ba4a33a1706e002a1ede4671f48
    - default-fbgsp
    env:
    - name: JENKINS_SECRET
      value: 7e119e7216aee7ca9c90b8ea0522aece33c72ba4a33a1706e002a1ede4671f48
    - name: JENKINS_TUNNEL
      value: jenkins-test-agent.jenkins.svc.cluster.local:50000
    - name: JENKINS_AGENT_NAME
      value: default-fbgsp
    - name: JENKINS_NAME
      value: default-fbgsp
    - name: JENKINS_AGENT_WORKDIR
      value: /home/jenkins/agent
    - name: JENKINS_URL
      value: http://jenkins-test.jenkins.svc.cluster.local:8080/
    image: tferrari92/jenkins-agent-docker-git-npm
    imagePullPolicy: IfNotPresent
    name: jnlp
    resources:
      limits:
        cpu: 512m
        memory: 512Mi
      requests:
        cpu: 512m
        memory: 512Mi
    terminationMessagePath: /dev/termination-log
    terminationMessagePolicy: File
    volumeMounts:
    - mountPath: /home/jenkins/agent
      name: workspace-volume
    - mountPath: /var/run/secrets/kubernetes.io/serviceaccount
      name: kube-api-access-rrf6n
      readOnly: true
    workingDir: /home/jenkins/agent
  dnsPolicy: ClusterFirst
  enableServiceLinks: true
  nodeName: k8s-infra-node3
  nodeSelector:
    kubernetes.io/os: linux
  preemptionPolicy: PreemptLowerPriority
  priority: 0
  restartPolicy: Never
  schedulerName: default-scheduler
  securityContext: {}
  serviceAccount: default
  serviceAccountName: default
  terminationGracePeriodSeconds: 30
  tolerations:
  - effect: NoExecute
    key: node.kubernetes.io/not-ready
    operator: Exists
    tolerationSeconds: 300
  - effect: NoExecute
    key: node.kubernetes.io/unreachable
    operator: Exists
    tolerationSeconds: 300
  volumes:
  - emptyDir: {}
    name: workspace-volume
  - name: kube-api-access-rrf6n
    projected:
      defaultMode: 420
      sources:
      - serviceAccountToken:
          expirationSeconds: 3607
          path: token
      - configMap:
          items:
          - key: ca.crt
            path: ca.crt
          name: kube-root-ca.crt
      - downwardAPI:
          items:
          - fieldRef:
              apiVersion: v1
              fieldPath: metadata.namespace
            path: namespace
    """
        }
    }

    stages {

        
        stage('Clonar repo y moverse al directorio') {
            steps {
              sh 'git clone https://github.com/tomasferrarisenda/mock-repo-aplicacion.git'
              sh 'cd mock-repo-aplicacion'
            }
        }

        stage('Correr npm install') {
            steps {
                sh 'npm install'
            }
        }

        stage('Crear Dockerfile') {
            steps {
              sh '''echo  \'FROM    node
                    WORKDIR    user/src/app 
                    COPY    package.json 
                    RUN    npm install 
                    COPY    .. 
                    EXPOSE    5000 
                    CMD    "node" "server.js" \' > Dockerfile'''
            }
        }

        stage('Buildear la imagen') {
            steps {
               // sh 'dockerd'
                sh 'docker build . -t demo-app'
            }
        }

        stage('Pushear imagen a repo personal') {
            steps {
                sh 'docker login docker login --username=tferrari92 --email=tferrari.92@gmail.com'
                sh 'hirvyt-werrub-Wemso4'
                sh 'docker tag demo-app:1.0 tferrari92/demo-app:1.0'
                sh 'docker push tferrari92/demo-app:1.0'
            }
        }

        stage('Salir de directorio, descargar repo de infra y modificar chart') {
            steps {
                sh 'cd ..'
                sh 'git clone https://github.com/tomasferrarisenda/mock-repo-infra.git'
                sh 'aca hay q hacer que modifique el chart '
            }
        }

        stage('Pushear los cambios al repo de infra') {
            steps {
                sh 'git add .'
                sh 'git commit -m "Actualizacion de imagen"'
                sh 'git push'
                sh 'introducir usuario'
                sh 'introducir token'
            }
        }
    }
}

