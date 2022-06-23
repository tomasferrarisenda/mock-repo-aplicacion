pipeline {

    agent {
        kubernetes {
            label 'agent'
            yaml """
            kind: Pod
            metadata:
              labels:
                jenkins/jenkins-test-jenkins-agent: true
                jenkins/label-digest: 8ce0dddc0f3c2f1ca6c7dd739cb899616bd1f5fd
                jenkins/label: kubepod
              name: agent
            spec:
              containers:
              - args:
                - 0200f3855153ba1887d173ac70445f42184f69a90cc6adadc5eb404f0ba555a7
                - agent
                env:
                - name: JENKINS_SECRET
                  value: 0200f3855153ba1887d173ac70445f42184f69a90cc6adadc5eb404f0ba555a7
                - name: JENKINS_TUNNEL
                  value: jenkins-test-agent.jenkins.svc.cluster.local:50000
                - name: JENKINS_AGENT_WORKDIR
                  value: /home/jenkins/agent
                - name: JENKINS_URL
                  value: http://jenkins-test.jenkins.svc.cluster.local:8080/
                image: tferrari92/jenkins-agent-docker-git-npm
                imagePullPolicy: IfNotPresent
                name: jnlp
                resources:
                  limits:
                    memory: 512Mi
                    cpu: 512m
                  requests:
                    memory: 512Mi
                    cpu: 512m
                tty: false
                volumeMounts:
                - mountPath: /var/run/docker.sock
                  name: volume-0
                  readOnly: false
                - mountPath: /home/jenkins/agent
                  name: workspace-volume
                  readOnly: false
                workingDir: /home/jenkins/agent
              hostNetwork: false
              nodeSelector:
                kubernetes.io/os: linux
              restartPolicy: Never
              serviceAccountName: default
              volumes:
              - hostPath:
                  path: /var/run/docker.sock
                name: volume-0
              - emptyDir:
                  medium: 
                name: workspace-volume
            """
        }
    }

    // agent {
    //     label 'kubepod'
    // }

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

