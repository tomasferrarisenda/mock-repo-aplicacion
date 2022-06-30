pipeline {

    environment {
        APP_NAME = "demo-app"

        APP_REPOSITORY = "https://github.com/tomasferrarisenda/mock-repo-aplicacion.git"
        APP_REPO_DIRECTORY = "mock-repo-aplicacion"

        INFRA_REPOSITORY = "https://github.com/tomasferrarisenda/mock-repo-infra.git"
        INFRA_REPO_DIRECTORY = "/home/jenkins/agent/workspace/my-second-pipeline_main/mock-repo-infra"

        APP_TAG = "${BUILD_NUMBER}"

        DOCKER_USERNAME = "tferrari92"
        DOCKER_PASSWORD = "hirvyt-werrub-Wemso4"

        GIT_EMAIL = "tomas.ferrari@sendati.com"
        GIT_USERNAME = "tomasferrarisenda"
        GIT_REPO = "tomasferrarisenda/mock-repo-infra.git"
        GITHUB_CREDENTIALS_ID = "tomasferrarisendaGithubCredentials"
    }


// AQUI ESTARIA BUENO DEFINIR AL POD DE AGENTE

    agent {
      kubernetes {
        yaml """
apiVersion: "v1"
kind: "Pod"
metadata:
  labels:
    jenkins/jenkins-prueba-jenkins-agent: "true"
    jenkins/label-digest: "8ce0dddc0f3c2f1ca6c7dd739cb899616bd1f5fd"
  name: "jenkins-agent"
spec:
  containers:
  - args:
    - "eyJhbGciOiJSUzI1NiIsImtpZCI6IkhpZTRoZnl0RGc1b1lWNXhCYk90YWhRV1dlS1o4R0FGT0tKa1Y2VUdKQW8ifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJqZW5raW5zIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZWNyZXQubmFtZSI6ImplbmtpbnMtdG9rZW4taGxncjkiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoiamVua2lucyIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6ImQ5Mzk2ZDc1LWEzNjYtNGQ0NC1hZTcyLTZjODlmMjc3MzhiYyIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDpqZW5raW5zOmplbmtpbnMifQ.D2j6tGc_fDTCtm87IzFa_-A-x0dkm4UmfQlALNi3otzM0ShzYrifDqQPMh2sMaWaySXd5kWQcLl9GpqJzXrDmbdpyJYhfEWKOIx0G-6eNC1PlKi2i9FiXmpdIknDZLNNADBFVmWzCvAaswcjzN6uIUBLK6RpFqoWh92EwfQPpvjiy2vLJuzSlmGX6JISMiEekBvbJwY9RQuG8XOXB-xYYSaxZGOcS_uJgtVo2tYaQYfMbYf-T3AhJV7pVmQaIGAz7A7MkcBMLWsSWbouF7-CVJmL1VIFy4wotUtmtVQ-j6k7I0rwdLVDby5yx9QGn_6EZiSOWbY1kfa7YmkYAVM0pw%"
    - "default-9bg2l"
    env:
    - name: "JENKINS_SECRET"
      value: "eyJhbGciOiJSUzI1NiIsImtpZCI6IkhpZTRoZnl0RGc1b1lWNXhCYk90YWhRV1dlS1o4R0FGT0tKa1Y2VUdKQW8ifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJqZW5raW5zIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZWNyZXQubmFtZSI6ImplbmtpbnMtdG9rZW4taGxncjkiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoiamVua2lucyIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6ImQ5Mzk2ZDc1LWEzNjYtNGQ0NC1hZTcyLTZjODlmMjc3MzhiYyIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDpqZW5raW5zOmplbmtpbnMifQ.D2j6tGc_fDTCtm87IzFa_-A-x0dkm4UmfQlALNi3otzM0ShzYrifDqQPMh2sMaWaySXd5kWQcLl9GpqJzXrDmbdpyJYhfEWKOIx0G-6eNC1PlKi2i9FiXmpdIknDZLNNADBFVmWzCvAaswcjzN6uIUBLK6RpFqoWh92EwfQPpvjiy2vLJuzSlmGX6JISMiEekBvbJwY9RQuG8XOXB-xYYSaxZGOcS_uJgtVo2tYaQYfMbYf-T3AhJV7pVmQaIGAz7A7MkcBMLWsSWbouF7-CVJmL1VIFy4wotUtmtVQ-j6k7I0rwdLVDby5yx9QGn_6EZiSOWbY1kfa7YmkYAVM0pw%"
    - name: "JENKINS_TUNNEL"
      value: "jenkins-prueba-agent.jenkins.svc.cluster.local:50000"
    - name: "JENKINS_AGENT_NAME"
      value: "default-9bg2l"
    - name: "JENKINS_NAME"
      value: "default-9bg2l"
    - name: "JENKINS_AGENT_WORKDIR"
      value: "/home/jenkins/agent"
    - name: "JENKINS_URL"
      value: "http://jenkins-prueba.jenkins.svc.cluster.local:8080/"
    image: "tferrari92/jenkins-agent-docker-git-npm"
    imagePullPolicy: "IfNotPresent"
    name: "jnlp"
    resources:
      limits:
        memory: "512Mi"
        cpu: "512m"
      requests:
        memory: "512Mi"
        cpu: "512m"
    tty: false
    volumeMounts:
    - mountPath: "/var/run/docker.sock"
      name: "volume-0"
      readOnly: false
    - mountPath: "/home/jenkins/agent"
      name: "workspace-volume"
      readOnly: false
    workingDir: "/home/jenkins/agent"
  hostNetwork: false
  nodeSelector:
    kubernetes.io/os: "linux"
  restartPolicy: "Never"
  serviceAccountName: "default"
  volumes:
  - hostPath:
      path: "/var/run/docker.sock"
    name: "volume-0"
  - emptyDir:
      medium: ""
    name: "workspace-volume"
"""
       }
    }


    // agent {
    //     label 'kubepod'
    // }


    stages {

        
        stage('Clonar repo') {
            steps {
              sh 'git clone $APP_REPOSITORY'
              sh 'cd $APP_REPO_DIRECTORY'
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

