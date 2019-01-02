import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";
import ipfs from './ipfs';

import "./App.css";

class App extends Component {

    state = { storageValue: 0, web3: null, accounts: null, contract: null, buffer:null, ipfsHash:'' };



  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,

      );


      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    const tx = await contract.methods.set(5).send({ from: accounts[0] });
    console.log('tx',tx);


    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();


    // Update state with the result.
    this.setState({ storageValue: response });
  };
  onSubmit = async(event) => {
    event.preventDefault();
    ipfs.files.add(this.state.buffer , (error, ipfsHash) => {
      console.log(error, ipfsHash);
      if(error){
        console.error();
      }
      else{
        this.setState({ipfsHash:ipfsHash[0].hash});
        console.log('ipfshash',ipfsHash);
      }

    });
    console.log('in on Subit handler');
  }
  captureFile = async(event) => {
    event.preventDefault();
    const file = event.target.files[0];
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () =>{
      this.setState({buffer:Buffer(reader.result)});
      console.log('buffer value',this.state.buffer);
    }
    console.log('in captureFile handler');
  }
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Your Image to upload in IPFS and Ethereum blockchain!</h1>
        <img src= {`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt=''/>
        <form onSubmit={this.onSubmit}>
          <input type='file' onChange={this.captureFile}/>
          <input type='submit'/>
        </form>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );
  }
}
//https://ipfs.io/ipfs/QmZmsiQ4Sw4JTtdXaFxQWYJFLAGEXmREa8j3nRbQXReEYG
export default App;
