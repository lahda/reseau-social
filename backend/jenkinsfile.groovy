pipeline {
    agent any

    environment {
        DOCKER_REGISTRY_URL = 'https://hub.docker.com/repository/create?namespace=alphonsine'
        DOCKER_IMAGE_NAME = 'votre_image_docker'
        AWS_ACCESS_KEY_ID = credentials('aws-access-key-id')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
        AWS_DEFAULT_REGION = 'paris'
        DOCKER_COMPOSE_FILE = 'docker-compose.production.yml'
        SSH_PRIVATE_KEY = credentials('votre_cle_ssh')
        EC2_USER = 'ubuntu'
        EC2_HOST = 'votre_adresse_ip'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                script {
                    sh "docker build -t $DOCKER_REGISTRY_URL/$DOCKER_IMAGE_NAME:${BUILD_NUMBER} ."
                    sh "docker push $DOCKER_REGISTRY_URL/$DOCKER_IMAGE_NAME:${BUILD_NUMBER}"
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                // Étape pour déployer l'application sur EC2
                script {
                    // Utilisez SSH pour vous connecter à votre instance EC2 et effectuer le déploiement
                    sshagent(['votre_cle_ssh']) {
                        sh "ssh -o StrictHostKeyChecking=no -i votre_cle_ssh ec2-user@votre_adresse_ip 'docker pull $DOCKER_REGISTRY_URL/$DOCKER_IMAGE_NAME:$BUILD_NUMBER && docker-compose -f docker-compose.production.yml up -d'"
                    }
                        }
                    } else {
                        error "Le fichier $DOCKER_COMPOSE_FILE est introuvable à la racine du projet."
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}

def fileExists(filename) {
    def file = new File(filename)
    return file.exists()
}
