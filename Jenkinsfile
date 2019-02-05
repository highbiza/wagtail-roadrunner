#!/usr/bin/env groovy

pipeline {
    agent any
    options { disableConcurrentBuilds() }

    stages {
        stage('Build') {
            steps {
                withPythonEnv('System-CPython-3.6') {
                    echo 'building...'
                }
            }
        }
        stage('Lint') {
            steps {
                withPythonEnv('System-CPython-3.6') {
                    pysh "make lint"
                }
            }
        }
        stage('Test') {
            steps {
                withPythonEnv('System-CPython-3.6') {
                    pysh "make test"
                }
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: '**/nosetests.xml'
                }
                success {
                    step([
                        $class: 'CoberturaPublisher',
                        coberturaReportFile: '**/coverage.xml',
                    ])
                }
            }
        }
    }
    post {
        always {
            echo 'This will always run'
        }
        success {
            echo 'This will run only if successful'
            withPythonEnv('System-CPython-3.6') {
                echo 'This will run only if successful'
                pysh "version --plugin=wheel -B${env.BUILD_NUMBER} --skip-build"
                sh "which git"
                sh "git push --tags"
            }
        }
        failure {
            emailext body: "<p>${buildStatus}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p><p>Check console output at &QUOT;<a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a>&QUOT;</p>", recipientProviders: [[$class: 'CulpritsRecipientProvider']], subject: "JENKINS-NOTIFICATION: ${buildStatus}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'"
        }
        unstable {
            echo 'This will run only if the run was marked as unstable'
        }
        changed {
            echo 'This will run only if the state of the Pipeline has changed'
            echo 'For example, if the Pipeline was previously failing but is now successful'
        }
    }
}
