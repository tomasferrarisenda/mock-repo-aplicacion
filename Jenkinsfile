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
                sh 'mvn -B -DskipTests clean package'
            }
            steps {
                sh 'mvn -B -DskipTests clean package'
            }
            steps {
                sh 'mvn -B -DskipTests clean package'
            }
            steps {
                sh 'mvn -B -DskipTests clean package'
            }
            steps {
                sh 'mvn -B -DskipTests clean package'
            }
            steps {
                sh 'mvn -B -DskipTests clean package'
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

        stage('Correr npm install') {
            steps {
                sh 'mvn -B -DskipTests clean package'
            }
        }

    }













    post {

    // Email Ext plugin:
    success {

      emailext (
          subject: "SUCCESSFUL: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
          body: """<p>SUCCESSFUL: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
            <p>Check console output at &QUOT;<a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a>&QUOT;</p>""",
          to: "${emailRecipient}",
          from: "buildNotifications@emailaddress.com"
        )
    }

    failure {

      emailext (
          subject: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
          body: """<p>FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
            <p>Check console output at &QUOT;<a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a>&QUOT;</p>""",
          to: "${emailRecipient}",
          from: "buildNotifications@emailaddress.com"
        )
    }
  }
}