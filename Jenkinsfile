pipeline {
    agent any

    stages {

        stage('Clone Repository') {
            steps {
                git 'https://github.com/vshetty26/AstraMind_DevOps.git'
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Docker Check') {
            steps {
                sh 'docker --version'
            }
        }
    }

    post {
        success {
            echo 'AstraMind CI/CD Pipeline Success!'
        }

        failure {
            echo 'Pipeline Failed!'
        }
    }
}
