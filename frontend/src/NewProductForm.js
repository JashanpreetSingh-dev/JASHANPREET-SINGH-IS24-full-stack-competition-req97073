import React from "react";
import { Button, DatePicker, Form, Input, Radio } from 'antd';
import { useState } from "react";
import axios from "axios";

const URL = "http://localhost:3001/api/product";

const NewProductForm = () => {

    const [productName, setProductName] = useState("");
    const [productOwner, setProductOwner] = useState("");
    const [developers, setDevelopers] = useState([]);
    const [scrumMaster, setScrumMaster] = useState("");
    const [startDate, setStartDate] = useState("");
    const [methodology, setMethodology] = useState("Agile");
    const [form] = Form.useForm();

    const handleDevelopersChange = (e) => {
        const developersList = e.target.value.split(",").map(developer => developer.trim());
        setDevelopers(developersList);
    };

    const resetForm = () => {
        setProductName("");
        setProductOwner("");
        setDevelopers([]);
        setScrumMaster("");
        setStartDate("");
        setMethodology("Agile");
        form.resetFields();
    }

    const handleFormSubmit = async (values) => {

        axios.post(URL, {
            productName,
            productOwner,
            developers,
            scrumMaster,
            startDate,
            methodology
        }).then((response) => {
            if (response.status === 200) {
                alert("Product created successfully");
                resetForm();
            } else if (response.status === 400) {
                alert("Product already exists");
            }
            console.log(response.statusText);
        }).catch((error) => {
            console.log(error);
            alert("Product with the same name already exists");
            resetForm();
        });

        // try {
        //     const response = await axios.post(URL, {
        //         productName,
        //         productOwner,
        //         developers,
        //         scrumMaster,
        //         startDate,
        //         methodology
        //     });
        //     if (response.status === 200) {
        //         alert("Product created successfully");
        //         setProductName("");
        //         setProductOwner("");
        //         setDevelopers([]);
        //         setScrumMaster("");
        //         setStartDate("");
        //         setMethodology("Agile");
        //     } else if (response.status === 400) {
        //         alert("Product already exists");
        //     }
        //     console.log(response);
        // } catch (error) {
        //     console.error(error);
        // }
    };

    return (
        <>
            <h1 style={{
                textAlign: "center",
                margin: "auto",
                marginBottom: "20px",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "sans-serif",
            }}>Add new product</h1>
            <Form
                layout="horizontal"
                name="newProductForm"
                initialValues={{ methodology: "Agile" }}
                onFinish={handleFormSubmit}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
                style={{
                    margin: "auto",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                form={form}
                key={productName + productOwner + developers + scrumMaster + startDate + methodology}

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
                    }/>
                </Form.Item>

                <Form.Item label="Developers" name="developers" rules={[{ required: true, message: 'Please input developers' }]}>
                    <Input value={developers.join(", ")} onChange={
                            handleDevelopersChange
                    }/>
                </Form.Item>

                <Form.Item label="Scrum Master" name="scrumMaster" rules={[{ required: true, message: 'Please input scrum master' }]}>
                    <Input value={scrumMaster} onChange={
                        (e) => {
                            setScrumMaster(e.target.value);
                        }
                    }/>
                </Form.Item>

                <Form.Item label="Start Date" name="startDate" rules={[{ required: true, message: 'Please input start date' }]}>
                    <DatePicker value={startDate} onChange={
                        (date) => {
                            setStartDate(date.format("YYYY-MM-DD"));
                        }
                    }/>
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

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>

    )
}

export default NewProductForm;
