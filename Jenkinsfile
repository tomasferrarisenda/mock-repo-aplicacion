pipeline {

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
              sh 'sleep 10000'
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
                    COPY    package.json .
                    RUN    npm install 
                    COPY    . . 
                    EXPOSE    5000 
                    CMD    "node" "server.js" \' > Dockerfile'''
            }
        }

        stage('Buildear la imagen') {
            steps {
                sh 'docker build . -t demo-app'
            }
        }

        stage('Pushear imagen a repo personal') {
            steps {
                sh 'docker login --username=tferrari92 --password=hirvyt-werrub-Wemso4'
                sh 'docker tag demo-app tferrari92/demo-app'
                sh 'docker push tferrari92/demo-app'
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

