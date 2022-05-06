import React, { Component } from 'react';
import Web3 from 'web3';
import Marketplace from '../ethereum/build/Marketplace.json';
import Header from './HeaderComponent';
import Create from './CreateComponent';
import Products from './ListComponent';

class Main extends Component {

    async loadWeb3() {
        if (window.ethereum) {
            console.log("here")
            window.web3 = new Web3(window.ethereum);
        } else if (window.web3) {
            console.log("here1")
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            console.log("here2")
            window.alert('Non-Ethereum browser detected. Try using MetaMask!');
        }
    }

    async loadBlockchainData() {
        this.setState.loading = true;

        const web3 = window.web3;
        const accounts = await web3.eth.requestAccounts();
        const networkId = await web3.eth.net.getId();

        console.log(accounts);

        const marketplaceData = Marketplace.networks[networkId];

        if (marketplaceData) {
            const marketplace = new web3.eth.Contract(Marketplace.abi, marketplaceData.address);
            const productCount = await marketplace.methods.productCount().call();
            this.setState({ marketplace, productCount });

            for (let i=1; i<=this.state.productCount; i++) {
                const product = await marketplace.methods.products(i).call();
                //product.price = web3.utils.fromWei(product.price, 'ether');
                //console.log(product.price);
                this.setState({ products: [...this.state.products, product] });
            }
        } else {
            window.alert('Contract not deployed on given network!');
        }

        this.setState({ account: accounts[0], loading: false });
    }

    async componentDidMount() {
        await this.loadWeb3();
        await this.loadBlockchainData();
    }

    createProduct(name, price, link) {
        this.setState({ loading: true });
        
        this.state.marketplace.methods.createProduct(name, price, link)
            .send({ from: this.state.account })
            .once('receipt', (receipt) => {
                this.setState({ loading: false });
                window.location.reload();
            });
    }

    purchaseProduct(id, price, owner) {
        this.setState({ loading: true });

        if(owner === this.state.account){
            alert("Can't buy your own product");
            this.setState({ loading: false });
        }
        else{
            this.state.marketplace.methods.purchaseProduct(id)
            .send({ from: this.state.account, value: price })
            .once('receipt', (receipt) => {
                this.setState({ loading: false });
                window.location.reload();
            });
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            account: '0x0',
            marketplace: '',
            productCount: 0,
            products: [],
            loading: true,
            textFilter: '',
        };

        this.createProduct = this.createProduct.bind(this);
        this.purchaseProduct = this.purchaseProduct.bind(this);
        this.setFilter = this.setFilter.bind(this);
    }

    setFilter(value) {
        this.setState({textFilter: value});
    }

    render() {
        let filterProduct;

        if (this.state.loading) {
            filterProduct = [];
        } else {
            filterProduct = this.state.products;
        }

        if(this.state.textFilter){
            filterProduct = this.state.products.filter(element => element['name'].includes(this.state.textFilter));
        }

        console.log(this.state.products);

        return (
            <div>
                <Header account={this.state.account} />
                <Create createProduct={this.createProduct}/>
                <Products products={filterProduct} purchaseProduct={this.purchaseProduct} account={this.state.account} textFilter={this.state.textFilter} setFilter={this.setFilter}/>
            </div>
        )
    }
}

export default Main;
