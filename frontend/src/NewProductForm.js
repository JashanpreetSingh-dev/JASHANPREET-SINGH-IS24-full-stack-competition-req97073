import React, { useEffect } from "react";
import { Button, DatePicker, Form, Input, Radio } from 'antd';
import { useState } from "react";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";

// The API Component's URL is defined here
const URL = "http://localhost:3000/api/product";

const NewProductForm = () => {

    // This is the state of the form
    const [productName, setProductName] = useState("");
    const [productOwner, setProductOwner] = useState("");
    const [developers, setDevelopers] = useState([]);
    const [scrumMaster, setScrumMaster] = useState("");
    const [startDate, setStartDate] = useState("");
    const [methodology, setMethodology] = useState("Agile");
    const [formAction, setFormAction] = useState("add");
    const [form] = Form.useForm();

    // Use effect hook to get the product details if the user is editing a product so that the form is pre-filled with the product details
    useEffect(() => {
        // Check if the user is editing a product
        if (window.location.pathname.includes("/editProduct/")) {
            setFormAction("edit");
            const productId = window.location.pathname.split("/")[2];

            // Get the product details from the backend
            axios.get(URL + "/" + productId).then((response) => {
                if (response.status === 200) {
                    setProductName(response.data.productName);
                    setProductOwner(response.data.productOwner);
                    setDevelopers(response.data.developers);
                    setScrumMaster(response.data.scrumMaster);
                    setStartDate(response.data.startDate);
                    setMethodology(response.data.methodology);

                    // Set the form fields with the product details
                    form.setFieldsValue({
                        productName: response.data.productName,
                        productOwner: response.data.productOwner,
                        developers: response.data.developers.join(", "),
                        scrumMaster: response.data.scrumMaster,
                        startDate: moment(response.data.startDate, "YYYY-MM-DD"),
                        methodology: response.data.methodology,
                    });
                }
            }).catch((error) => {
                console.log(error);
            });
        }
    }, [])

    // This function is called when the user changes the developers field. This is a helper function to split the developers string into an array of developers
    const handleDevelopersChange = (e) => {
        // Split the developers string into an array of developers
        const developersList = e.target.value.split(",").map(developer => developer.trim());
        // Set the developers state
        setDevelopers(developersList);
    };

    // This function is used to reset the form fields to their initial state which is empty
    const resetForm = () => {
        setProductName("");
        setProductOwner("");
        setDevelopers([]);
        setScrumMaster("");
        setStartDate("");
        setMethodology("Agile");
        form.resetFields();
    }

    // This function is called when the user clicks on the submit button. This function is used to add a new product to the database
    // Axios is used to make a POST request to the backend to add a new product
    // The response from the backend is checked to see if the product was added successfully or not
    // If the product was added successfully, the user is asked if they want to go back to the home page or stay on the same page
    // If the product was not added successfully, the user is alerted that the product already exists or some other error occurred
    const handleFormSubmit = async (values) => {

        // Make a POST request to the backend to add a new product
        axios.post(URL, {
            productName,
            productOwner,
            developers,
            scrumMaster,
            startDate,
            methodology
        }).then((response) => {
            // Check if the product was added successfully
            if (response.status === 200) {
                const confirmation = window.confirm("Product added successfully\nClick OK to go back to the home page, or click Cancel to stay on the same page")
                if (confirmation) {
                    window.location.href = "/";
                } else {
                    resetForm();
                }
            } else if (response.status === 400) {
                alert("Product already exists");
            }
            console.log(response.statusText);
        }).catch((error) => {
            console.log(error);
            alert("Product with the same name already exists");
            resetForm();
        });
    };

    // This function is called when the user clicks on the submit button. This function is used to edit a product in the database
    // Axios is used to make a PUT request to the backend to edit a product
    // The response from the backend is checked to see if the product was edited successfully or not
    // If the product was edited successfully, the user is asked if they want to go back to the home page or stay on the same page
    // If the product was not edited successfully, the user is alerted that the product already exists or some other error occurred
    const handleEditFormSubmit = async (values) => {
        // Getting the product id from the URL
        const productId = window.location.pathname.split("/")[2];

        // Make a PUT request to the backend to edit a product
        axios.put(URL + "/" + productId, {
            productName,
            productOwner,
            developers,
            scrumMaster,
            startDate,
            methodology
        }).then((response) => {
            if (response.status === 200) {
                let confirmation = window.confirm("Product updated successfully\nClick OK to go back to the home page, or click Cancel to stay on the same page")
                if (confirmation) {
                    window.location.href = "/";
                }
            } else if (response.status === 400) {
                alert("Product already exists");
            }
            console.log(response.statusText);
        }).catch((error) => {
            console.log(error);
            const errorResponse = "Something wrong with the Schema, please check if more than 5 developers are added\n" + error.response.data;
            alert(errorResponse);
        });
    }

    // The component returns a form which is used to add a new product or edit an existing product
    return (
        <>
            <div className="goBackButton">
                <Button type="primary" style={{
                    margin: "10px",
                    backgroundColor: "#d6691c",
                    color: "#000",
                    border: "none",
                    borderRadius: "5px",
                }}>
                    <Link to="/">Go Back</Link>
                </Button>
            </div>

            <h1 style={{
                textAlign: "center",
                margin: "auto",
                marginBottom: "20px",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "sans-serif",
            }}>
                {formAction === "edit" ? "Edit Product" : "Add a new Product"}
            </h1>

            <Form
                layout="horizontal"
                name="newProductForm"
                initialValues={{ methodology: "Agile" }}
                onFinish={formAction === "edit" ? handleEditFormSubmit : handleFormSubmit}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
                style={{
                    margin: "auto",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                form={form}
            >
                <Form.Item label="Product Name" name="productName" rules={[{ required: true, message: 'Please input product name' }]}>
                    <Input value={productName} onChange={
                        (e) => {
                            setProductName(e.target.value);
                        }
                    } />
                </Form.Item>

                <Form.Item label="Product Owner" name="productOwner" rules={[{ required: true, message: 'Please input product owner' }]}>
                    <Input value={productOwner} onChange={
                        (e) => {
                            setProductOwner(e.target.value);
                        }
                    } />
                </Form.Item>

                <Form.Item label="Developers" name="developers" rules={[{ required: true, message: 'Please input developers' }]}>
                    <Input value={developers.join(", ")} onChange={
                        handleDevelopersChange
                    } />
                </Form.Item>

                <Form.Item label="Scrum Master" name="scrumMaster" rules={[{ required: true, message: 'Please input scrum master' }]}>
                    <Input value={scrumMaster} onChange={
                        (e) => {
                            setScrumMaster(e.target.value);
                        }
                    } />
                </Form.Item>

                <Form.Item label="Start Date" name="startDate" rules={[{ required: true, message: 'Please input start date' }]}>
                    <DatePicker value={moment(startDate, "YYYY-MM-DD")} onChange={
                        (date) => {
                            setStartDate(date.format("YYYY-MM-DD"));
                        }
                    } />
                </Form.Item>

                <Form.Item label="Methodology" name="methodology" rules={[{ required: true, message: 'Please input methodology' }]}>
                    <Radio.Group value={methodology} onChange={
                        (e) => {
                            setMethodology(e.target.value);
                        }
                    }>
                        <Radio value="Agile">Agile</Radio>
                        <Radio value="Waterfall">Waterfall</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item style={{
                    textAlign: "center",
                    marginTop: "50px",
                }}>
                    <Button type="primary" htmlType="submit">
                        {
                            formAction === "edit" ? "Edit Product" : "Add Product"
                        }
                    </Button>
                </Form.Item>
            </Form>
        </>

    )
}

export default NewProductForm;
