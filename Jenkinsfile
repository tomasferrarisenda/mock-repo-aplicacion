pipeline {

    environment {
        APP_NAME = "demo-app"

        APP_REPOSITORY = "https://github.com/tomasferrarisenda/mock-repo-aplicacion.git"
        APP_REPO_DIRECTORY = "${WORKSPACE}/mock-repo-aplicacion"

        INFRA_REPOSITORY = "https://github.com/tomasferrarisenda/mock-repo-infra.git"
        INFRA_REPO_DIRECTORY = "${WORKSPACE}/mock-repo-infra"

        APP_TAG = "${BUILD_NUMBER}"

        DOCKER_USERNAME = "tferrari92"
        DOCKER_PASSWORD = "hirvyt-werrub-Wemso4"

        GIT_EMAIL = "tomas.ferrari@sendati.com"
        GIT_USERNAME = "tomasferrarisenda"
        GIT_REPO = "tomasferrarisenda/mock-repo-infra.git"
        GITHUB_CREDENTIALS_ID = "tomasferrarisendaGithubCredentials"
    }


// Uses Declarative syntax to run commands inside a container.
    agent {
        kubernetes {
            // Rather than inline YAML, in a multibranch Pipeline you could use: yamlFile 'jenkins-pod.yaml'
            // Or, to avoid YAML:
            // containerTemplate {
            //     name 'shell'
            //     image 'ubuntu'
            //     command 'sleep'
            //     args 'infinity'
            // }
            yaml '''
apiVersion: v1
kind: Pod
metadata:
  labels:
    jenkins: slave
  name: agent-pod
spec:
  containers:
  - name: jnlp
    image: tferrari92/jenkins-agent-docker-git-npm
    command:
    - sleep
    args:
    - "99"
    env:
    - name: http_proxy
      value: "http://192.168.0.9:8080/"
    - name: no_proxy
      value: "jenkins-bitnami.sandbox4.svc.cluster.local, 172.30.45.126"
    - name: JENKINS_TUNNEL
      value: ":50000"
    - name: NO_PROXY
      value: "jenkins-bitnami.sandbox4.svc.cluster.local, 172.30.45.126"
    - name: JENKINS_AGENT_NAME
      value: "jenkins-agent-31cw8"
    - name: https_proxy
      value: "http://192.168.0.9:8080/"
    - name: HTTPS_PROXY
      value: "http://192.168.0.9:8080/"
    - name: JENKINS_NAME
      value: "jenkins-agent-31cw8"
    - name: JENKINS_AGENT_WORKDIR
      value: "/home/jenkins/agent"
    - name: HTTP_PROXY
      value: "http://192.168.0.9:8080/"
    - name: JENKINS_URL
      value: "http://jenkins-bitnami.sandbox4.svc.cluster.local/"
    resources:
      limits: {}
      requests:
        memory: "256Mi"
        cpu: "100m"
    volumeMounts:
    - mountPath: /home/jenkins/agent
      name: workspace-volume
      readOnly: false
  hostNetwork: false
  nodeSelector:
    kubernetes.io/os: "linux"
  restartPolicy: Never
  volumes:
  - emptyDir:
      medium: ""
    name: workspace-volume

'''
            // Can also wrap individual steps:
            // container('shell') {
            //     sh 'hostname'
            // }
            defaultContainer 'jnlp'
        }
    }

  
    stages {

        stage('Clonar repo') {
            steps {
              sh 'git clone $APP_REPOSITORY'
            }
        }

        // stage('Correr npm install') {
        //     steps {
        //         sh 'npm install'
        //     }
        // }

        stage('Correr npm install') {
           steps {  
                dir("${APP_REPO_DIRECTORY}") {
                    sh 'npm install'
                }
            }
        }


        stage('Crear Dockerfile') {
            steps {
              sh '''echo  \'FROM    node
WORKDIR    user/src/app 
COPY    package.json .
RUN    npm install 
COPY    . . 
EXPOSE    5000 
CMD    "node" "server.js" \' > Dockerfile'''
              sh 'cat Dockerfile'
            }
        }

        stage('Buildear la imagen') {
            steps {
                sh 'docker build . -t $APP_NAME'
            }
        }

        stage('Pushear imagen a repo personal') {
            steps {
                sh 'docker login --username=$DOCKER_USERNAME --password=$DOCKER_PASSWORD'
                sh 'docker tag $APP_NAME $DOCKER_USERNAME/$APP_NAME:$APP_TAG'
                sh 'docker push $DOCKER_USERNAME/$APP_NAME:$APP_TAG'
            }
        }

        stage('Descargar repo de infra') {
            steps {
                sh 'git clone $INFRA_REPOSITORY'
            }
        }


        stage('Modificar deployment') {
           steps {  
                dir("${INFRA_REPO_DIRECTORY}") {
                    sh 'rm dev/deployment.yaml'
                    sh '''echo  \"apiVersion: apps/v1
kind: Deployment
metadata: 
  name: $APP_NAME-deployment
spec:
  selector:
    matchLabels:
      app: $APP_NAME
  replicas: 2
  template: 
    metadata:
      labels: 
        app: $APP_NAME
    spec: 
      containers:
      - name: $APP_NAME
        image: $DOCKER_USERNAME/$APP_NAME:$APP_TAG
        ports:
        - containerPort: 8080 \" > dev/deployment.yaml'''
                }
            }
        }


        stage('Pushear los cambios al repo de infra') {
           steps {  
                dir("${INFRA_REPO_DIRECTORY}") {
                    sh 'git config --global user.email "$GIT_EMAIL"'
                    sh 'git config --global user.name "$GIT_USERNAME"'
                    sh 'git add .'
                    sh 'git commit -m "Actualizacion de imagen"'
                    withCredentials([usernamePassword(credentialsId: "${GITHUB_CREDENTIALS_ID}", passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                        sh('git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/${GIT_REPO}')
                    }
                }
            }
        }
    }
}

