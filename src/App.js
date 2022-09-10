import React, { Component } from 'react';
import Web3 from 'web3';

class App extends Component {
  
  state = { 
    web3: null,
    accounts: null,
    contract: '0x809257312750ebb56df43b82308c79ecc9b88c42',
    contracts: [
      {
        "name": "8/8 POAP",
        "address": "0x809257312750ebb56df43b82308c79ecc9b88c42",
        "balanceOf": 0
      },
      {
        "name": "Web3 Demo",
        "address": "0x4c75c69156c97d5f606553fcefa55e98e6f85020",
        "balanceOf": 0
      },
      {
        "name": "Text Apes",
        "address": "0x8Fac2e25DFF0B248A19A66Ae8D530613c8Ff670B",
        "balanceOf": 0
      },
    ],
    balanceOfAbi: [{"inputs":[{"internalType": "address","name": "owner","type": "address"}],"name": "balanceOf","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"}] 
  };

  componentDidMount = async () => {
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum); 
        this.setState({ web3 });
      }
    } catch (error) {
      console.error(error);
    }
  };

  doWalletConnect = async () => {
    const { web3, contracts, balanceOfAbi } = this.state;
    try {
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();
      
      // LOOP THROUGH CONTRACTS 
      for (let i = 0; i < contracts.length; i++) {
        // CREATE NEW CONTRACT FOR EACH CONTRACT ADDRESS
        let instance = new web3.eth.Contract(balanceOfAbi, contracts[i].address);
        // CHECK WALLET BALANCE OF EACH CONTRACT && UPDATE BALANCE OF
        contracts[i].balanceOf = await instance.methods.balanceOf(accounts[0]).call();
      }

      console.log(contracts);
      
      // UPDATE STATE
      this.setState({ web3, accounts, contracts });
    } catch (error) {
      alert('Failed to load web3 or accounts.');
      console.error(error);
    }
  };

  render() {
    const self = this;
    return (
      <div>
        <h2>Web3 Test</h2>
        <p>Iterate through known contracts & display balance</p>
        {!this.state.web3 &&
          <div>
            <h3>No Wallet Detected</h3>
          </div>
        }
        {!this.state.accounts && this.state.web3 &&
          <div>
            <button onClick={this.doWalletConnect}>
              Connect Your Wallet
            </button>
          </div>
        }
        {this.state.accounts &&
          <div>
            <h4>NFT Count</h4>
            <ul>
              {this.state.contracts.map(contract => {
                  return (
                    <li key={contract.address}>
                      <a href={"https://testnets.opensea.io/assets?search[query]=" + contract.address} target="_blank">{contract.name}</a>: {contract.balanceOf}
                    </li>
                  );
                })
              }
            </ul>
          </div>
        }
      </div>
    );
  }
}

export default App;
