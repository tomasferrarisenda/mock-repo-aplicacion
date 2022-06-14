pipeline {

    agent any

    stages {
        stage('Instalar git, descargar repo y moverse al directorio') {
            steps {
              sh 'sudo apt-get update'
            }
            steps {
                sh 'sudo apt-get install git'
            }
            steps {
                sh 'git clone https://github.com/tomasferrarisenda/mock-repo-aplicacion.git'
            }
            steps {
                sh 'cd mock-repo-aplicacion'
            } 
        }

        stage('Correr npm install') {
            steps {
                sh 'npm install'
            }
        }

        stage('Instalar docker') {
            steps {
                sh 'sudo apt-get remove docker docker-engine docker.io containerd runc'
            }
            steps {
                sh 'sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin'
            }
        }

        stage('Crear Dockerfile') {
            steps {
              sh 'echo "FROM    node
                  > WORKDIR    user/src/app
                  > COPY    package.json
                  > RUN    npm install
                  > COPY    ..
                  > EXPOSE    5000
                  > CMD    “node” “server.js”
                  > " > Dockerfile
                  '
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
            }
            steps {
                sh 'sendati'
            }
            steps {
                sh 'Sendati123'
            }
            steps {
                sh 'docker tag mock-prueba:1.0 registry.sanatorioallende.com/infra/mock-prueba:1.0'
            }
            steps {
                sh 'docker push registry.sanatorioallende.com/infra/mock-prueba:1.0'
            }
        }

        stage('Salir de directorio, descargar repo de infra y modificar chart') {
            steps {
                sh 'cd ..'
            }
            steps {
                sh 'git clone https://github.com/tomasferrarisenda/mock-repo-infra.git'
            }
            steps {
                sh 'aca hay q hacer que modifique el chart '
            }
            
        }

        stage('Pushear los cambios al repo de infra') {
            steps {
                sh 'git add .'
            }
            steps {
                sh 'git commit -m "Actualizacion de imagen"'
            }
            steps {
                sh 'git push'
            }
            steps {
                sh 'introducir usuario'
            }
            steps {
                sh 'introducir token'
            }
        }

    }













//     post {

//     // Email Ext plugin:
//     success {

//       emailext (
//           subject: "SUCCESSFUL: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
//           body: """<p>SUCCESSFUL: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
//             <p>Check console output at &QUOT;<a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a>&QUOT;</p>""",
//           to: "${emailRecipient}",
//           from: "buildNotifications@emailaddress.com"
//         )
//     }

//     failure {

//       emailext (
//           subject: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
//           body: """<p>FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
//             <p>Check console output at &QUOT;<a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a>&QUOT;</p>""",
//           to: "${emailRecipient}",
//           from: "buildNotifications@emailaddress.com"
//         )
//     }
//   }
}