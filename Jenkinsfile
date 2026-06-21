pipeline {
    agent any

    stages {

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

        stage('Verify Docker') {
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
            echo 'AstraMind CI/CD Pipeline Failed!'
        }
    }
}