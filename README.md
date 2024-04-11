## Project "Task Management"

This project is an API for task management using AWS Lambda serverless functions, as well as DynamoDB and AWS DocumentDB databases. The project is written in TypeScript and utilizes the Serverless Framework for deploying infrastructure on AWS.

### Technology Stack

- **Node.js**: JavaScript runtime environment used for writing server-side code.
- **TypeScript**: Programming language adding static typing to JavaScript.
- **Serverless Framework**: Framework for developing, deploying, and managing serverless applications on AWS, Azure, Google Cloud, and other platforms.
- **Express.js**: Fast, unopinionated, minimalist web framework for Node.js used for handling HTTP requests and responses.
- **AWS (Amazon Web Services)**:
    - **AWS Lambda**: Serverless compute service for running code in response to events.
    - **AWS API Gateway**: Service for managing, publishing, securing, and monitoring API interfaces.
    - **AWS DocumentDB**: Fully managed database compatible with MongoDB.
    - **AWS Cognito**: Identity management service providing authentication, authorization, and user management for web and mobile apps.

### Deployment

1. Install Node.js and npm.
2. Install Serverless Framework globally: `npm install -g serverless`.
3. Install project dependencies: `npm install`.
4. Set up AWS credentials.
5. Provide necessary environment variables.
6. Deploy the project to AWS by running: `sls deploy`.

### Project Structure


```
src/
│
├──── functions/
│   ├──── auth/
│   │   ├──── login/ # Function for user authentication
│   │   ├──── register/ # Function for registering a new user
│   │   └──── ... # Other authentication and authorization functions
│   │
│   ├──── tasks/
│   │   ├──── create/ # Function for creating a new task
│   │   ├──── delete/ # Function for deleting a task
│   │   ├──── get/ # Function for retrieving a list of tasks
│   │   ├──── update/ # Function for updating a task
│   │   └──── ... # Other functions for managing tasks
│   │
│   └──── ... # Other project functions
│
├──── libs/ # Helper libraries and utilities
│   ├──── api-gateway.ts # Utilities for working with API Gateway
│   ├──── handler-resolver.ts # Utilities for resolving handler path
│   └──── ... # Other helper utilities
│
└──── infrastructure/ # Modules for working with infrastructure (databases, authentication, etc.)
├──── cognito.ts # Module for working with AWS Cognito
├──── database.ts # Module for working with databases (DynamoDB, AWS DocumentDB)
└──── ... # Other modules for working with infrastructure
```


### Other Mentioned Technologies and Practices

- **TDD (Test-Driven Development)**: Testing is employed in the project to ensure the correct functionality of functions and APIs.
- **DDD (Domain-Driven Design)**: While there is no direct mention of DDD in the project, its principles can be applied in designing and developing task management functionality.
- **Conventional Commits**: It is assumed that Conventional Commits-style commit message conventions are used to support automatic Changelog generation and version management.

This repository provides an example implementation of a RESTful API using AWS Lambda serverless functions, TypeScript, and a variety of other technologies that adhere to modern Node.js development standards.

### Running Tests

If the project includes test suites, you can provide instructions on how to run them. For example:

```bash
# Install development dependencies
npm install --dev

# Run tests
npm test
```

### Contributing

Contributions are welcome and encouraged! Here's how you can contribute:

1. Fork the repository and clone it to your local machine.
2. Create a new branch for your feature or bug fix: `git checkout -b feature/new-feature`.
3. Make your changes and ensure that the tests pass.
4. Commit your changes following the [Conventional Commits](https://www.conventionalcommits.org/) format.
5. Push your changes to your fork: `git push origin feature/new-feature`.
6. Submit a pull request to the `main` branch of the original repository.

Thank you for considering contributing to the project!
