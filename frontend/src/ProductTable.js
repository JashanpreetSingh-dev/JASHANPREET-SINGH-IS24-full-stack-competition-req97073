import React, { useState, useEffect, useRef } from "react";
import { Button, Space, Table, Tag, Input } from "antd";
import axios from "axios";
import "./ProductTable.css";
import { Link } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";


const URL = "http://localhost:3000/api/products";



const ProductTable = () => {
    const [products, setProducts] = useState([]);
    const [developers, setDevelopers] = useState([]);

    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [connectionError, setConnectionError] = useState(false);
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{
                padding: 8
            }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: "block" }} />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}>
                        Search
                    </Button>
                    <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                    <Button type="link" size="small" onClick={() => {
                        confirm({ closeDropdown: false });
                        setSearchText(selectedKeys[0]);
                        setSearchedColumn(dataIndex);
                    }}>
                        Filter
                    </Button>
                    <Button type="link" size="small" onClick={() => {
                        close();
                    }}>
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>

            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            )
    });
    const getDeveloperSet = () => {
        let developerSet = [];
        products.forEach((product) => {
            developerSet.concat(...product.developers)
        });

        return new Set(developerSet);
    }

    const columns = [
        {
            title: "Product Number",
            dataIndex: "productNumber",
            key: "productNumber",
            defaultSortOrder: "ascend",
            sorter: (a, b) => a.productNumber - b.productNumber,
            sortDirections: ["ascend", "descend"],
            ...getColumnSearchProps("productNumber"),
        },
        {
            title: "Product Name",
            dataIndex: "productName",
            key: "productName",
            ...getColumnSearchProps("productName"),
        },
        {
            title: "Product Owner",
            dataIndex: "productOwner",
            key: "productOwner",
            ...getColumnSearchProps("productOwner"),
        },
        {
            title: "Developers",
            dataIndex: "developers",
            key: "developers",
            render: (_, { developers }) => (
                <>
                    {developers.map((developer) => {
                        return (
                            <Tag style={{
                                border: "none",
                                fontSize: "14px",
                            }} key={developer}>
                                {developer}
                            </Tag>
                        );
                    })}
                </>
            ),
            filters: developers.map((developer) => {
                return {
                    text: developer,
                    value: developer,
                };
            }),
            onFilter: (value, record) => record.developers.includes(value),
            filterSearch: true,

            // ...getColumnSearchProps("developers"),
        },
        {
            title: "Scrum Master",
            dataIndex: "scrumMaster",
            key: "scrumMaster",
            ...getColumnSearchProps("scrumMaster"),
        },
        {
            title: "Start Date",
            dataIndex: "startDate",
            key: "startDate",
            ...getColumnSearchProps("startDate"),
            sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
            sortDirections: ["ascend", "descend"],
        },
        {
            title: "Methodology",
            dataIndex: "methodology",
            key: "methodology",
            filters: [
                {
                    text: "Agile",
                    value: "Agile",
                },
                {
                    text: "Waterfall",
                    value: "Waterfall",
                }
            ],
            onFilter: (value, record) => record.methodology.indexOf(value) === 0,
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
            },
            // ...getColumnSearchProps("methodology"),
        },
        {
            title: "Actions (Edit)",
            key: "edit",
            render: (_, record) => {
                return (
                    <Space size="middle" style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"

                    }}>
                        <Button className="edit-button">
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
                        </Button>
                    </Space>
                );
            }
        }
    ];




    useEffect(() => {
        async function getProducts() {
            axios.get(URL)
                .then((response) => {
                    setConnectionError(false);
                    setProducts(response.data);
                    const data = response.data;
                    const developers = [];
                    data.forEach((product) => {
                        product.key = product.productNumber;
                        product.developers.forEach((developer) => {
                            if (!developers.includes(developer)) {
                                developers.push(developer);
                            }
                        });
                        // return product;
                    });
                    setDevelopers(developers);
                    console.log("-----------------DEVELOPERS-----------------");
                    console.log(developers);
                    console.log(data);
                })
                .catch((error) => {
                    console.log(error);
                    setConnectionError(true);

                });
        }
        getProducts();
        //  axios.get(URL)
        //     .then((response) => {
        //         setProducts(response.data);
        //         const data = response.data;
        //         data.forEach((product) => {
        //             product.key = product.productNumber;
        //             return product;
        //         });
        //         // setDevelopers(getDeveloperSet(products));
        //         // console.log("-----------------DEVELOPERS-----------------");
        //         // console.log(developers);
        //         // console.log(data);
        //     })
        //     .then(() => {
        //         setDevelopers(getDeveloperSet(products));
        //         console.log("-----------------DEVELOPERS-----------------");
        //         console.log(developers);
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     });
        // console.log(products);
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
                pageSizeOptions: ["8", "12", "16", products.length.toString()],
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,

            }} columns={columns} dataSource={products} key={() => {
                return Math.random();
            }} />

            {
                connectionError ? <h1 style={{
                    color: "red",
                    fontSize: "1.2rem",
                    fontWeight: "bold"
                }}>Connection Error, Contact Administrator !
                </h1> : null
            }
        </div>

    );
}

export default ProductTable;