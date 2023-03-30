import React, { useState, useEffect } from "react";
import { Space, Table, Tag } from "antd";
import axios from "axios";
import "./ProductTable.css";

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
        key: "edit",
        render: (_, record) => {
            return (
                <Space size="middle">
                    <a className="edit-button">Edit</a>
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
        <Table columns={columns} dataSource={products} key={() => {
            return Math.random();
        }}/>
    );
}

export default ProductTable;