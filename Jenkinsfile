pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'GitHub Repository Connected Successfully'
            }
        }

        stage('Build') {
            steps {
                echo 'Building AstraMind Application'
            }
        }

        stage('Test') {
            steps {
                echo 'Running Application Tests'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deployment Completed Successfully'
            }
        }
    }

    post {
        success {
            echo 'AstraMind CI/CD Pipeline Success!'
        }
    }
}