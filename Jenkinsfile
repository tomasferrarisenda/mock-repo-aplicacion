pipeline {

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
                    COPY    package.json 
                    RUN    npm install 
                    COPY    .. 
                    EXPOSE    5000 
                    CMD    "node" "server.js" \' > Dockerfile'''
            }
        }

        stage('Buildear la imagen') {
            steps {
                sh 'sudo docker build -t mock-app'
            }
        }

        stage('Pushear imagen a Harbor') {
            steps {
                sh 'docker login registry.sanatorioallende.com'
                sh 'sendati'
                sh 'Sendati123'
                sh 'docker tag mock-prueba:1.0 registry.sanatorioallende.com/infra/mock-prueba:1.0'
                sh 'docker push registry.sanatorioallende.com/infra/mock-prueba:1.0'
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

