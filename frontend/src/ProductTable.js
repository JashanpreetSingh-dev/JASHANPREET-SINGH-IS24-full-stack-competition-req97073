import React, { useState, useEffect, useRef } from "react";
import { Button, Space, Table, Tag, Input } from "antd";
import axios from "axios";
import "./ProductTable.css";
import { Link } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

// The API Component's URL is defined here
const URL = "http://localhost:3000/api/products";


const ProductTable = () => {

    // The state of the component is defined here

    // The products state stores the products that are fetched from the API
    const [products, setProducts] = useState([]);

    // The developers state stores the developers that are parsed from the products
    const [developers, setDevelopers] = useState([]);

    // The searchText state stores the text that is searched for in the table
    const [searchText, setSearchText] = useState("");

    // The searchedColumn state stores the column that is searched for in the table
    const [searchedColumn, setSearchedColumn] = useState("");

    // The connectionError state stores whether or not there is a connection error
    const [connectionError, setConnectionError] = useState(false);

    const searchInput = useRef(null);

    // This is a helper function that is used to search for text in the table
    // Reference: https://ant.design/components/table/#components-table-demo-head
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    // This is a helper function that is used to reset the search in the table
    // Reference: https://ant.design/components/table/#components-table-demo-head
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };

    // This is a helper function that is used to search for text in the table
    // Reference: https://ant.design/components/table/#components-table-demo-head
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

    // The columns is a list of objects that define the columns of the table.
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

    // UseEffect is used to fetch the data from the API.
    // The data is then stored in the products state.
    // The developers state is used to store the developers of the products.
    useEffect(() => {
        async function getProducts() {

            // Gettting the data from the API.
            axios.get(URL)
                .then((response) => {

                    // Setting the connection error to false.
                    setConnectionError(false);

                    // Setting the products state to the data from the API.
                    setProducts(response.data);
                    const data = response.data;
                    const developers = [];

                    // Setting the key of the data to the product number. PS: This is needed for the table to work.
                    // Ref: https://ant.design/components/table/#components-table-demo-edit-row
                    // Setting the developers state to the developers of the products.
                    data.forEach((product) => {
                        product.key = product.productNumber;
                        product.developers.forEach((developer) => {
                            if (!developers.includes(developer)) {
                                developers.push(developer);
                            }
                        });
                    });
                    setDevelopers(developers);
                })
                .catch((error) => {
                    console.log(error);
                    setConnectionError(true);

                });
        }
        getProducts();
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