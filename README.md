
# Project Title

  

This project is implemented for the little Phil initial coin offer. We are using Openzeppelin's framework with a custom crowdsale interface.

  

## Getting Started

  

Clone out Github repo and checkout a new branch. Initialise the NPM packages with ```npm init```. We are using Truffle for deployment and integrated testing. To use Truffle, make sure your environment config is updated with your credentials. If you want to deploy to a test net, make sure you have Geth downloaded. Else, you can locally run it with ```truffle deployer```. 

  

### Prerequisites

  

What things you need to install the software and how to install them

  

```

NPM 
Truffle, installed globally
Geth, for main and test nets: ```geth --rinkeby --rpc --rpcapi db,eth,net,web3,personal --unlock="<account_wallet>"

```

  

### Installing

  

To get your osx or unix environment up and running, follow the steps below. 

  
  

```

cd ~ && npm install -g truffle;
mkdir <dirname> && cd <dirname>;
git clone git@github.com:Little-Phil/erc20-crowdsale-token.git;
cd erc20-crowdsale-token;
git checkout -b <branchname>;
npm install;

```

  

## Running the tests

  

Explain how to run the automated tests for this system

  

### Break down into end to end tests

  

Explain what these tests test and why

  

```

Give an example

```

  

### And coding style tests

  

Explain what these tests test and why

  

```

Give an example

```

  

## Deployment

  

Add additional notes about how to deploy this on a live system

  

## Built With

  

* [Openzeppelin](https://openzeppelin.org) - The ERC20 framework used

* [Truffle](http://truffleframework.com) - The Solidity deployment framework used

  

## Contributing

  

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.


  

## Authors

  

* **Mathew Sayed**
* **John Robertson**
* **Matthew Shipman**
  

See also the list of [contributors](https://github.com/Little-Phil/erc20-crowdsale-token/graphs/contributors) who participated in this project.



  

## Acknowledgments

  

* Openzeppelin Community 

* Truffle Community

* Ethereum Community