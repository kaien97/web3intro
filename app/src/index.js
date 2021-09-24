import Web3 from "web3";
import volcanoCoinArtifact from "../../build/contracts/VolcanoCoin.json";

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = volcanoCoinArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        volcanoCoinArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

      this.refreshBalance();

      this.meta.events.Transfer()
      .on('data', event => this.notify());
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  notify: async function() {
    const currBal = document.getElementsByClassName("balance")[0].innerHTML;
    const { balanceOf } = this.meta.methods;
    const newBal = await balanceOf(this.account).call();

    const balanceElement = document.getElementsByClassName("balance")[0];
    balanceElement.innerHTML = newBal;

    const change = newBal - currBal;
    console.log(change);

    const alertElement = document.getElementsByClassName("alert")[0];
    const close = "<span class=\"closebtn\" onclick=\"this.parentElement.style.display='none';\">&times;</span>";
    if (change < 0) {
      alertElement.innerHTML = close + change + " tokens has been sent."
    } else {
      alertElement.innerHTML = close + "You have received " +  change + " tokens."
    }
    alertElement.style.display = "";
  },

  refreshBalance: async function() {
    const { balanceOf } = this.meta.methods;
    const balance = await balanceOf(this.account).call();

    const balanceElement = document.getElementsByClassName("balance")[0];
    balanceElement.innerHTML = balance;
  },

  sendCoin: async function() {
    const amount = parseInt(document.getElementById("amount").value);
    const receiver = document.getElementById("receiver").value;

    this.setStatus("Initiating transaction... (please wait)");

    const { transfer } = this.meta.methods;
    await transfer(receiver, amount).send({ from: this.account });

    this.setStatus("Transaction complete!");
    //this.refreshBalance();
  },

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  App.start();
});
