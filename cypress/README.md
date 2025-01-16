# Cypress Automation Setup with Azure DevOps and Jira Integration

## Prerequisites
- Node.js (v16 or later)
- npm
- Cypress installed globally or locally
- Git installed

## Setup Instructions
1. download the code zip file  ---I do not have any git test account
2. cd <project-directory>


## Install dependencies
npm install

## Run the test
npx cypress run --env configFile=qa

## Azure DevOps: I do not have Azure DevOps test account but we can setup the Azure DevOps pipeline as below

trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

variables:
  JIRA_URL: $(JIRA_URL)
  JIRA_USER: $(JIRA_USER)
  JIRA_API_TOKEN: $(JIRA_API_TOKEN)

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '16.x'
      checkLatest: true

  - script: |
      npm install
      npx cypress verify
    displayName: 'Install Cypress Dependencies'

  - script: |
      npx cypress run --reporter cypress-mochawesome-reporter
    displayName: 'Run Cypress Tests'

  - task: PublishTestResults@2
    inputs:
      testResultsFiles: '**/cypress/results/*.xml'
      testRunTitle: 'Cypress Test Results'

  - task: PublishPipelineArtifact@1
    inputs:
      targetPath: 'cypress/results'
      artifactName: 'CypressReports'
      publishLocation: 'pipeline'

  - script: |
      node update-jira.js
    displayName: 'Sync Test Results to Jira'


## Update Cypress Results to Jira -- Sample code(update-to-jira.js)

const axios = require('axios');
const fs = require('fs');

const JIRA_URL = process.env.JIRA_URL;
const JIRA_USER = process.env.JIRA_USER;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

const resultsFile = './cypress/results/mochawesome.json';

async function updateJira() {
  const results = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));

  results.tests.forEach(async (test) => {
    const issueKey = test.title.find((t) => t.includes('[JIRA-'));
    if (issueKey) {
      const key = issueKey.match(/\[JIRA-(\d+)\]/)[1];
      const status = test.state === 'passed' ? 'Done' : 'To Do';

      await axios({
        method: 'PUT',
        url: `${JIRA_URL}/rest/api/3/issue/${key}`,
        auth: {
          username: JIRA_USER,
          password: JIRA_API_TOKEN,
        },
        data: {
          fields: {
            status: { name: status },
          },
        },
      });
      console.log(`Updated ${key} to ${status}`);
    }
  });
}

updateJira().catch(console.error);
