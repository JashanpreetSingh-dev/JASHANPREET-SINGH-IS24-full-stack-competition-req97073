import React, { useState, useEffect } from "react";
import { Button, Space, Table, Tag } from "antd";
import axios from "axios";
import "./ProductTable.css";
import { Link } from "react-router-dom";

const URL = "http://localhost:3001/api/products";

const columns = [
    {
        title: "Product Number",
        dataIndex: "productNumber",
        key: "productNumber",
        // render: (text) => <a>{text}</a>,
    },
    {
        title: "Product Name",
        dataIndex: "productName",
        key: "productName",
    },
    {
        title: "Product Owner",
        dataIndex: "productOwner",
        key: "productOwner",
    },
    {
        title: "Developers",
        dataIndex: "developers",
        key: "developers",
        render: (_, { developers }) => (
            <>
                {developers.map((developer) => {
                    return (
                        <Tag color="blue" key={developer}>
                            {developer}
                        </Tag>
                    );
                })}
            </>
        )
    },
    {
        title: "Scrum Master",
        dataIndex: "scrumMaster",
        key: "scrumMaster",
    },
    {
        title: "Start Date",
        dataIndex: "startDate",
        key: "startDate",
    },
    {
        title: "Methodology",
        dataIndex: "methodology",
        key: "methodology",
        render: (_, { methodology }) => {
            let color = "volcano";
            if (methodology === "Agile") {
                color = "green";
            }
            return (
                <Tag color={color} key={methodology}>
                    {methodology}
                </Tag>
            );
        }
    },
    {
        title: "Actions (Edit/Delete)",
        key: "edit",
        render: (_, record) => {
            return (
                <Space size="middle" style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"

                }}>
                    <a className="edit-button">
                        <Link to={{
                            pathname: "/editProduct/" + record.productNumber,
                            state: {
                                productNumber: record.productNumber,
                                productName: record.productName,
                                productOwner: record.productOwner,
                                developers: record.developers,
                                scrumMaster: record.scrumMaster,
                                startDate: record.startDate,
                                methodology: record.methodology
                            },

                        }}>Edit</Link>
                        </a>
                    <a className="delete-button">Delete</a>
                </Space>
            );
        }
    }
];

const ProductTable = () => {
    const [products, setProducts] = useState([]);


    useEffect(() => {
        axios.get(URL)
            .then((response) => {
                setProducts(response.data);
                const data = response.data;
                data.forEach((product) => {
                    product.key = product.productNumber;
                    return product;
                });
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            });
        console.log(products);
    }, []);

    return (
        <div style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <h1 style={{
                textAlign: "center",
                fontSize: "1.3rem",
                fontWeight: "bold",
                color: "#1890ff"
            }}>IMB Products in Development</h1>
            <Button type="primary" style={{
                marginBottom: "1rem"
            }}>
                <Link to="/addProduct">Add Product</Link>
            </Button>
            <Table pagination={{
                    position: ["bottomCenter"],
                    defaultPageSize: 8,
                    showSizeChanger: true,
                    pageSizeOptions: ["8", "12", "16", products.length.toString()]

                }} columns={columns} dataSource={products} key={() => {
                return Math.random();
            }} />
        </div>

    );
}

export default ProductTable;