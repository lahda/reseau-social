pipeline {
    agent any

    stages {
        stage('Clone repository') {
            steps {
                git 'https://github.com/lahda/reseau-social.git'
            }
        }

        stage('Build Docker image') {
            steps {
                script {
                    docker.build("reseau social:${env.BUILD_NUMBER}")
                }
            }
        }

        stage('Push Docker image') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
                        docker.image("reseau social:${env.BUILD_NUMBER}").push()
                    }
                }
            }
        }

        stage('Deploy to AWS EC2') {
            steps {
                script {
                    sshagent(['clejenskins']) {
                        sh "scp -o StrictHostKeyChecking=no -i path/to/clejenskins.pem docker-compose.yml ssh -i "clejenskins.pem" ubuntu@ec2-13-39-51-55:/home/ubuntu/"
                        sh "ssh -o StrictHostKeyChecking=no -i path/to/clejenskins.pem ubuntu@ec2-13-39-51-55 'docker-compose up -d'"
                    }
                }
            }
        }
    }
}
