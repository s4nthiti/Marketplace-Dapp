import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';

const Products = (props) => {
    //let filterText = "";
    return (
        <div className="container border p-3 mt-3">
            <h2>Buy products</h2>
            <input type="text" value={props.textFilter} placeholder="Search by keyword" onChange={(e) => props.setFilter(e.target.value)}/>
            <hr />
            <Table bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Price (ETH)</th>
                        <th>Image</th>
                        <th>Owner</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    { props.products.map((product, key) => {
                        return (
                            <tr key={key}>
                                <th>{product.id}</th>
                                <td>{product.name}</td>
                                <td>{product.price/1000000000000000000}</td>
                                <td><img src={product.imgPath} alt="img" width="100" height="100"/></td>
                                <td>{product.owner}</td>
                                <td>{product.purchased ? 
                                        <Badge pill variant="success">Sold</Badge> : 
                                        <Button size="sm" variant="primary" block
                                            name={product.id}
                                            value={product.price}
                                            onClick={(event) => {
                                            event.preventDefault();
                                            props.purchaseProduct(product.id, product.price, product.owner);
                                        }}>Buy</Button>
                                    }
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </div>
    );
}

export default Products;
