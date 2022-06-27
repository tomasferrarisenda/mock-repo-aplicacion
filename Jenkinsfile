pipeline {

    environment {
        APP_NAME = "demo-app"

        APP_REPOSITORY = "https://github.com/tomasferrarisenda/mock-repo-aplicacion.git"
        APP_REPO_DIRECTORY = "mock-repo-aplicacion"

        INFRA_REPOSITORY = "https://github.com/tomasferrarisenda/mock-repo-infra.git"
        INFRA_REPO_DIRECTORY = "/home/jenkins/agent/workspace/my-second-pipeline_main/mock-repo-infra"
        INFRA_REPO_SSH = "git@github.com:tomasferrarisenda/mock-repo-infra.git"

        APP_TAG = "${BUILD_NUMBER}"

        DOCKER_LOGIN = "tferrari92"
        DOCKER_PASSWORD = "hirvyt-werrub-Wemso4"

        GIT_EMAIL = "tomas.ferrari@sendati.com"
        GIT_USERNAME = "tomasferrarisenda"
    }


// AQUI ESTARIA BUENO DEFINIR AL POD DE AGENTE

    // agent {
    //     kubernetes {
    //         label 'agent'
    //         yaml """
    //         apiVersion: v1
    //         kind: Pod
    //         metadata:
    //           name: agent
    //         spec:
    //           containers:
    //             image: tferrari92/jenkins-agent-docker-git-npm
    //             name: jnlp
    //             volumeMounts:
    //             - mountPath: /var/run/docker.sock
    //               name: volume-0
    //               readOnly: false
    //             - mountPath: /home/jenkins/agent
    //               name: workspace-volume
    //               readOnly: false
    //             workingDir: /home/jenkins/agent
    //           volumes:
    //           - hostPath:
    //               path: /var/run/docker.sock
    //             name: volume-0
    //           - emptyDir:
    //               medium: 
    //             name: workspace-volume
    //         """
    //     }
    // }

    // agent {
    //     kubernetes {
    //         label 'agent'
    //         yaml """
    //         apiVersion: v1
    //         kind: Pod
    //         metadata:
    //           name: agent
    //         spec:
    //           containers:
    //           - args:
    //             - eyJhbGciOiJSUzI1NiIsImtpZCI6IkhpZTRoZnl0RGc1b1lWNXhCYk90YWhRV1dlS1o4R0FGT0tKa1Y2VUdKQW8ifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJqZW5raW5zIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZWNyZXQubmFtZSI6ImplbmtpbnMtdG9rZW4taGxncjkiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoiamVua2lucyIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6ImQ5Mzk2ZDc1LWEzNjYtNGQ0NC1hZTcyLTZjODlmMjc3MzhiYyIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDpqZW5raW5zOmplbmtpbnMifQ.D2j6tGc_fDTCtm87IzFa_-A-x0dkm4UmfQlALNi3otzM0ShzYrifDqQPMh2sMaWaySXd5kWQcLl9GpqJzXrDmbdpyJYhfEWKOIx0G-6eNC1PlKi2i9FiXmpdIknDZLNNADBFVmWzCvAaswcjzN6uIUBLK6RpFqoWh92EwfQPpvjiy2vLJuzSlmGX6JISMiEekBvbJwY9RQuG8XOXB-xYYSaxZGOcS_uJgtVo2tYaQYfMbYf-T3AhJV7pVmQaIGAz7A7MkcBMLWsSWbouF7-CVJmL1VIFy4wotUtmtVQ-j6k7I0rwdLVDby5yx9QGn_6EZiSOWbY1kfa7YmkYAVM0pw%
    //             - agent
    //             env:
    //             - name: JENKINS_SECRET
    //               value: eyJhbGciOiJSUzI1NiIsImtpZCI6IkhpZTRoZnl0RGc1b1lWNXhCYk90YWhRV1dlS1o4R0FGT0tKa1Y2VUdKQW8ifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJqZW5raW5zIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZWNyZXQubmFtZSI6ImplbmtpbnMtdG9rZW4taGxncjkiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoiamVua2lucyIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6ImQ5Mzk2ZDc1LWEzNjYtNGQ0NC1hZTcyLTZjODlmMjc3MzhiYyIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDpqZW5raW5zOmplbmtpbnMifQ.D2j6tGc_fDTCtm87IzFa_-A-x0dkm4UmfQlALNi3otzM0ShzYrifDqQPMh2sMaWaySXd5kWQcLl9GpqJzXrDmbdpyJYhfEWKOIx0G-6eNC1PlKi2i9FiXmpdIknDZLNNADBFVmWzCvAaswcjzN6uIUBLK6RpFqoWh92EwfQPpvjiy2vLJuzSlmGX6JISMiEekBvbJwY9RQuG8XOXB-xYYSaxZGOcS_uJgtVo2tYaQYfMbYf-T3AhJV7pVmQaIGAz7A7MkcBMLWsSWbouF7-CVJmL1VIFy4wotUtmtVQ-j6k7I0rwdLVDby5yx9QGn_6EZiSOWbY1kfa7YmkYAVM0pw%
    //             - name: JENKINS_TUNNEL
    //               value: jenkins-test-agent.jenkins.svc.cluster.local:50000
    //             - name: JENKINS_AGENT_WORKDIR
    //               value: /home/jenkins/agent
    //             - name: JENKINS_URL
    //               value: http://jenkins-test.jenkins.svc.cluster.local:8080/
    //             image: tferrari92/jenkins-agent-docker-git-npm
    //             name: jnlp
    //             volumeMounts:
    //             - mountPath: /var/run/docker.sock
    //               name: volume-0
    //               readOnly: false
    //             - mountPath: /home/jenkins/agent
    //               name: workspace-volume
    //               readOnly: false
    //             workingDir: /home/jenkins/agent
    //           hostNetwork: false
    //           serviceAccountName: default
    //           volumes:
    //           - hostPath:
    //               path: /var/run/docker.sock
    //             name: volume-0
    //           - emptyDir:
    //               medium: 
    //             name: workspace-volume
    //         """
    //     }
    // }

    agent {
        label 'kubepod'
    }


    stages {

        
        stage('Clonar repo y moverse al directorio') {
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
                sh 'docker login --username=$DOCKER_LOGIN --password=$DOCKER_PASSWORD'
                sh 'docker tag $APP_NAME $DOCKER_LOGIN/$APP_NAME:$APP_TAG'
                sh 'docker push $DOCKER_LOGIN/$APP_NAME:$APP_TAG'
            }
        }

        stage('Descargar repo de infra') {
            steps {
                sh 'git clone $INFRA_REPOSITORY'
            }
        }


//  ESTE SIGUIENTE PASO HAY QUE HACERLO DE ALGUNA OTRA FORMA PORQUE CADA VEZ QUE SE COMMITEA, GITHUB DETECTA LAS CREDENCIALES EXPUESTAS EN EL COMMIT Y TE LAS ANULA Y HAY QUE IR MANUALMENTE A LAS SETTINGS DE GITHUB Y RE-APROBARLAS
        stage('Configuraciones de credenciales para GitHub') {
            steps {
                sh 'mkdir /root/.ssh'
                sh '''echo  \"-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACAqSC80J3acoVdGXXl6IP9BOPXXp6vrn9QyuWG5qPLisQAAAKAcJs6zHCbO
swAAAAtzc2gtZWQyNTUxOQAAACAqSC80J3acoVdGXXl6IP9BOPXXp6vrn9QyuWG5qPLisQ
AAAEA6s9CA4mRDmcjkUSrBTiYIq+025XLs/p/OyQEyAWbFTipILzQndpyhV0ZdeXog/0E4
9denq+uf1DK5Ybmo8uKxAAAAGXRvbWFzLmZlcnJhcmlAc2VuZGF0aS5jb20BAgME
-----END OPENSSH PRIVATE KEY-----" > /root/.ssh/id_ed25519'''
                sh 'echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICpILzQndpyhV0ZdeXog/0E49denq+uf1DK5Ybmo8uKx tomas.ferrari@sendati.com" > /root/.ssh/id_ed25519.pub'
                sh 'rm $INFRA_REPO_DIRECTORY/.git/config'              
                sh '''echo  \'[core]
	repositoryformatversion = 0
	filemode = true
	bare = false
	logallrefupdates = true
[remote "origin"]
	url = $INFRA_REPO_SSH
	fetch = +refs/heads/*:refs/remotes/origin/*
[branch "main"]
	remote = origin
	merge = refs/heads/main' > $INFRA_REPO_DIRECTORY/.git/config'''   
                dir(${INFRA_REPO_DIRECTORY}) {
                    sh 'git config --global user.email "$GIT_EMAIL"'
                    sh 'git config --global user.name "$GIT_USERNAME"'
                }
                sh '''echo  \"github.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl
github.com ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAq2A7hRGmdnm9tUDbO9IDSwBK6TbQa+PXYPCPy6rbTrTtw7PHkccKrpp0yVhp5HdEIcKr6pLlVDBfOLX9QUsyCOV0wzfjIJNlGEYsdlLJizHhbn2mUjvSAHQqZETYP81eFzLQNnPHt4EVVUh7VfDESU84KezmD5QlWpXLmvU31/yMf+Se8xhHTvKSCZIFImWwoG6mbUoWf9nzpIoaSjB+weqqUUmpaaasXVal72J+UX2B+2RPW3RcT0eOzQgqlJL3RKrTJvdsjE3JEAvGq3lGHSZXy28G3skua2SmVi/w4yCE6gbODqnTWlg7+wC604ydGXA8VJiS5ap43JXiUFFAaQ==
github.com ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBEmKSENjQEezOmxkZMy7opKgwFB9nkt5YRrYMjNuG5N87uRgg6CLrbo5wAdT/y6v0mKV0U2w0WZ2YB/++Tpockg=" > ~/.ssh/known_hosts'''
                sh 'chmod 600 /root/.ssh/id_ed25519' // ESTO VA PORQUE SINO TIRA UN ERROR LINUX DE AUTORIZACIONES
            }
        }

        stage('Cambiar directorio y modificar deployment.yaml') {
           steps {  
                dir(${INFRA_REPO_DIRECTORY}'/dev') {
                    sh 'rm deployment.yaml'
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
        - containerPort: 8080 \" > deployment.yaml'''
                }
            }
        }


        stage('Pushear los cambios al repo de infra') {
           steps {  
                dir('$INFRA_REPO_DIRECTORY') {
                    sh 'git add .'
                    sh 'git commit -m "Actualizacion de imagen"'
                    sh 'git push'
                }
            }
        }


    }
}

