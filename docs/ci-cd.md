# CI/CD

## GitHub Actions

The PR workflow installs with `npm ci`, validates source/workflows, installs Chromium, executes
smoke/API/accessibility checks, evaluates the release gate, and uploads evidence even on failure.
Concurrency cancels superseded PR runs.

Nightly execution uses a three-browser by three-shard matrix. Authentication setup runs before each
shard, then `--no-deps` prevents setup from being sharded accidentally.

## Jenkins

```groovy
pipeline {
  agent { dockerfile true }
  environment {
    CI = 'true'
    TEST_ENV = 'qa'
    TEST_USERNAME = credentials('qe-demo-username')
    TEST_PASSWORD = credentials('qe-demo-password')
  }
  stages {
    stage('Validate') { steps { sh 'npm run validate' } }
    stage('Test') { steps { sh 'npm run test:smoke && npm run test:api' } }
    stage('Gate') { steps { sh 'npm run quality-gate' } }
  }
  post { always { archiveArtifacts artifacts: 'playwright-report/**,test-results/**' } }
}
```

## Azure DevOps

```yaml
steps:
  - task: NodeTool@0
    inputs:
      versionSpec: 22.x
  - script: npm ci
  - script: npx playwright install --with-deps chromium
  - script: npm run validate
  - script: npm run test:smoke
    env:
      TEST_USERNAME: $(TEST_USERNAME)
      TEST_PASSWORD: $(TEST_PASSWORD)
  - task: PublishTestResults@2
    inputs:
      testResultsFiles: test-results/junit.xml
  - task: PublishPipelineArtifact@1
    inputs:
      targetPath: playwright-report
      artifact: playwright-report
```

Use protected variable groups/secret stores. Do not put credentials in pipeline YAML. For large
suites, allocate one agent per shard and merge blob reports before applying the final gate.
