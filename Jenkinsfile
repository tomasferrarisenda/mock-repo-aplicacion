pipeline {
    agent any

    tools {
        nodejs 'NodeJS 14.16.0'
    }

    stages {
        
        
        stage('Checkout Repo') {
            
            steps {
                slackSend(channel: "bot-jenkins-dev", color: "#6699ee", message: "----------------------Empezo una compilacion en " + "${env.JOB_NAME}" + "----------------------")
                cleanWs()
                git credentialsId: '2f442321-3555-4a7a-9c7e-b8b950dbe26e', 
                url: 'https://Edg_Super@bitbucket.org/sallende_desarrollo/sanatorioallende.app.git', 
                branch: "desarrollo"
            }
        }

        stage('Instalar Dependencias, actualizar version') {
            steps {
               dir("${env.WORKSPACE}/Front2"){
                    sh "npm install"
                }
            
            }
            post {
                failure{
                    slackSend(channel: "bot-jenkins-dev", color: "#f54b42", message: "${env.JOB_NAME}" + " Instalar Dependencias - Failure")
                }
            }
        }

        stage('Precompilar Librerias Base - Material') {
            steps {
               dir("${env.WORKSPACE}/Front2"){
                    sh "npm run ng build --project materialCommon"
                }
            
            }
             post {
                failure{
                    slackSend(channel: "bot-jenkins-dev", color: "#f54b42", message: "${env.JOB_NAME}" + " Precompilar Librerias Base - Material - Failure")
                }
            }
        }

         stage('Precompilar Librerias Base - UICommon') {
            steps {
               dir("${env.WORKSPACE}/Front2"){
                    sh "npm run ng build --project uiCommon"
                }
            
            }
            post {
                failure{
                    slackSend(channel: "bot-jenkins-dev", color: "#f54b42", message: "${env.JOB_NAME}" + " Precompilar Librerias Base - UICommon - Failure")
                }
            }
        }

         stage('Precompilar Librerias Base') {
            steps {
               dir("${env.WORKSPACE}/Front2"){
                    sh "npm run prebuild"
                }
            }
             post {
                failure{
                    slackSend(channel: "bot-jenkins-dev", color: "#f54b42", message: "${env.JOB_NAME}" + " Precompilar Librerias Base - Failure")
                }
            }
        }

        stage('Compilacion App V2') {
            steps {
            
               dir("${env.WORKSPACE}/Front2"){
                    sh "npm run build:dev"
                }
            }
            post {
                failure{
                    slackSend(channel: "bot-jenkins-dev", color: "#f54b42", message: "${env.JOB_NAME}" + " Compilacion App V2 - Failure")
                }
            }
        }

        stage('Compilacion Auth Project') {
            steps {
               dir("${env.WORKSPACE}/Front2"){
                    sh "npm run build_auth:dev"
                }
            }
            post {
                failure{
                    slackSend(channel: "bot-jenkins-dev", color: "#f54b42", message: "${env.JOB_NAME}" + " Compilacion Auth Project - Failure")
                }
            }
    
        }


     stage('Instalar bower, grunt, karma, etc') {
            steps {
                nodejs(nodeJSInstallationName: 'NodeJs 8.11.3') {
                    dir("${env.WORKSPACE}/Front"){
                        sh "npm install -g bower"
                        sh "npm install -g grunt@1.0.3 grunt-cli@1.3.2"
                        sh "npm install -g karma karma-cli"
                        sh "npm install -g typescript@2.3.3"
                        sh "npm install -g webpack@3.7.1"
                        sh "npm install -g webpack-dev-server@2.9.1"
                    }
                }
            }
             post {
                failure{
                    slackSend(channel: "bot-jenkins-dev", color: "#f54b42", message: "${env.JOB_NAME}" + "Instalar bower, grunt, karma, etc - Failure")
                }
            }
        }

        stage('Instalar Dependencias V1') {
            steps {
                nodejs(nodeJSInstallationName: 'NodeJs 8.11.3') {
                    dir("${env.WORKSPACE}/Front"){
                        sh "npm install"
                        sh "npm rebuild node-sass"
                    }
                }
                
            }
             post {
                failure{
                    slackSend(channel: "bot-jenkins-dev", color: "#f54b42", message: "${env.JOB_NAME}" + "Compilacion App V1 - Failure")
                }
            }
        }

    

        stage('Compilacion App V1') {
            steps {
                nodejs(nodeJSInstallationName: 'NodeJs 8.11.3') {
                    dir("${env.WORKSPACE}/Front"){
                        sh "node -v"
                        sh "bower -v"
                        sh "webpack -v"
                        sh "webpack-dev-server -v"
                        sh "npm run build:dev"
                    }
                }
            }
             post {
                failure{
                    slackSend(channel: "bot-jenkins-dev", color: "#f54b42", message: "${env.JOB_NAME}" + "Compilacion App V1 - Failure")
                }
            }
        }


 
    }


    post {
    
        success {

            dir("${env.WORKSPACE}/Front2"){
           
                sh "rm -rf deploy/v1"
                sh "rm -rf deploy/v2"
                sh "rm -rf deploy/auth"
                
                sh "mkdir deploy/v1"
                sh "mkdir deploy/v2"
                sh "mkdir deploy/auth"
               
            }

           //tengo que copiar los htaccess 
            sh "cp -r ${env.WORKSPACE}/Front2/projects/auth/src/.htaccess ${env.WORKSPACE}/Front2/dist/auth/"
            sh "cp -r ${env.WORKSPACE}/Front2/src/.htaccess ${env.WORKSPACE}/Front2/dist/app2/"

            dir("${env.WORKSPACE}/Front2/dist"){
                sh "mv app2/* ${env.WORKSPACE}/Front2/deploy/v2/"
                sh "mv auth/* ${env.WORKSPACE}/Front2/deploy/auth/"

                sh "mv app2/.htaccess ${env.WORKSPACE}/Front2/deploy/v2/"
                sh "mv auth/.htaccess ${env.WORKSPACE}/Front2/deploy/auth/"
            }

             dir("${env.WORKSPACE}/Front"){
                sh "mv dist/* ${env.WORKSPACE}/Front2/deploy/v1/"
            }

            sh "mv ${env.WORKSPACE}/Front2/deploy/app/favicon.ico ${env.WORKSPACE}/Front2/deploy/"
            sh "mv ${env.WORKSPACE}/Front2/deploy/app/index.html ${env.WORKSPACE}/Front2/deploy/"

            sh "rm -rf ${env.WORKSPACE}/Front2/deploy/app"
            sh "rm -rf ${env.WORKSPACE}/Front2/deploy/portal"

            dir("${env.WORKSPACE}/Front2/deploy"){
                 sh "sudo zip -r appdev.zip ./"
            }
            
            sh "sudo scp ${env.WORKSPACE}/Front2/deploy/appdev.zip root@172.16.17.22:/var/www/html/deploy/"

            slackSend(channel: "bot-jenkins-dev", color: "#6699ee", message: "----------------------Termino la compilacion en " + "${env.JOB_NAME}" + "----------------------") 
        }
    }
}
