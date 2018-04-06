import React, { Component } from 'react';
import logo from './logo.svg';
import web3 from './web3';

import './App.css';
import lottery from './lottery';

class App extends Component {
  state = {
    balance: '',
    manager: '',
    message: '',
    players: [],
    value: '',
  };

  async componentDidMount() {
    const balance = await web3.eth.getBalance(lottery.options.address);
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();

    this.setState({ balance, manager, players });
  }

  onSubmit = async event => {
    event.preventDefault();
    const { value } = this.state;
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, 'ether'),
    });

    this.setState({
      message: 'You have been entered!',
    });
  };

  render() {
    const { balance, manager, message, players } = this.state;
    const etherPrize = web3.utils.fromWei(balance, 'ether');
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by: {manager}</p>
        <p>
          There are currently {this.state.players.length} people entered,
          competing to win {etherPrize} ether!
        </p>
        <hr />

        <h2>{message}</h2>

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luch?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              onChange={event =>
                this.setState({
                  value: event.target.value,
                })
              }
              value={this.state.value}
            />
          </div>

          <button>Enter</button>
        </form>
      </div>
    );
  }
}

export default App;
