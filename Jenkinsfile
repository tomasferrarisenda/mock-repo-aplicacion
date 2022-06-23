pipeline {

    // agent {
    //     kubernetes {
    //         defaultContainer 'agent'
    //         yaml '''
    //         kind: Pod
    //         spec:
    //         containers:
    //         - name: agent
    //             image: tferrari92/jenkins-agent-docker-git-npm
    //         '''
    //     }
    // }

    agent {
        label 'kubepod'
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
                    COPY    package.json .
                    RUN    npm install 
                    COPY    . . 
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
                sh 'docker login'
                sh 'tferrari92'
                sh 'hirvyt-werrub-Wemso4'
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

