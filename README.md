
  

# Little Phil ICO

  

  

This project is implemented for the little Phil initial coin offer. We are using OpenZeppelin's framework with a custom crowdsale interface.

  

  

## Getting Started

  

  

Clone out Github repo and checkout a new branch. Initialise the NPM packages with ```npm init```. We are using Truffle for deployment and integrated testing. To use Truffle, make sure your environment config is updated with your credentials. If you want to deploy to a test net, make sure you have Geth downloaded. Else, you can locally run it with ```ganache-cli```.

  

  

### Prerequisites


  

  

* NPM

* Truffle, installed globally

* Ganache-cli, installed globally 


  

  

### Installing

  

  

To get your OSX or Unix environment up and running, follow the steps below.

  

  

```

cd ~ && npm install -g truffle;

npm install -g ganache-cli;

mkdir <dirname> && cd <dirname>;

git clone https://github.com/Little-Phil/erc20-crowdsale-token.git;

cd erc20-crowdsale-token;

npm install;

```

  

  

## Running the tests

  

  

We are using Truffle with Ganache for integrated testing. We are also using Travis-CI for continuous integration, which runs the testing suite on each pull request. To run the tests locally, run the following commands inside the project directory: 

```

ganache-cli;

npm test;

```



  

  

## Built With

  

  

* [OpenZeppelin](https://openzeppelin.org) - The ERC20 framework used

  

* [Truffle](http://truffleframework.com) - The Solidity deployment framework used



* [Ganache-CLI](https://www.npmjs.com/package/ganache-cli) - The local blockchain network used



* [Travis CI](https://travis-ci.org/) - The continuous integration testing framework used


  
  

  

## Authors

  

  

* **Mathew Sayed**

* **John Robertson**

* **Matthew Shipman**

  

See also the list of [contributors](https://github.com/Little-Phil/erc20-crowdsale-token/graphs/contributors) who participated in this project.

  
  
  

  

## Acknowledgments

  

  

* OpenZeppelin Community

  

* Truffle Community

  

* Ethereum Community