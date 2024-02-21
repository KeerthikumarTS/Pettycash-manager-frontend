import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { Form, Input, message, Modal, Select, Table, DatePicker } from "antd";
import axios from "axios";
import moment from "moment";
import Spinner from "../components/Spinner";
import {
  UnorderedListOutlined,
  AreaChartOutlined,
  EditOutlined,
  DeleteOutlined,
  TableOutlined,
} from "@ant-design/icons";
import Analytics from "../components/Analytics";
import { API } from "../components/api";
const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [selectedDate, setSelectedate] = useState([]);
  const [type, setType] = useState("all");
  const [viewData, setViewData] = useState("table");
  const [editable, setEditable] = useState(null);

  const colums = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Reference",
      dataIndex: "reference",
    },
    {
      title: "Actions",
      render: (text, record) => (
        <div>
          <EditOutlined
            onClick={() => {
              setEditable(record);
              setShowModal(true);
            }}
          />
          <DeleteOutlined
            className="mx-2"
            onClick={() => {
              handleDelete(record);
            }}
          />
        </div>
      ),
    },
  ];



  useEffect(() => {
    const getAllTransaction = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        setLoading(true);
        const res = await axios.post(
          `${API}/transactions/get-transaction`,
          {
            userid: user._id,
            frequency,
            selectedDate,
            type,
          }
        );
        setLoading(false);
        setAllTransaction(res.data);
      } catch (error) {
        message.error("Fetch issue with transaction");
      }
    };

    getAllTransaction();
  }, [frequency, selectedDate, type]);


  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post(
        `${API}/transactions/delete-transaction`,
        { transacationId: record._id }
      );
      setLoading(false);
      message.success("transaction Deleted");
      window.location.href = "/";
    } catch (error) {
      setLoading(false);
      message.error("unable to delete");
    }
  };


  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      if (editable) {
        await axios.post(
          `${API}/transactions/edit-transaction`,
          {
            payload: {
              ...values,
              userid: user._id,
            },
            transacationId: editable._id,
          }
        );
        setLoading(false);
        message.success("Transaction Updated Successfully");
        window.location.href = "/";
      } else {
        await axios.post(
          `${API}/transactions/add-transaction`,
          {
            ...values,
            userid: user._id,
          }
        );
        setLoading(false);
        message.success("Transaction Added Successfully");
        window.location.href = "/";
      }
      setShowModal(false);
      setEditable(null);
    } catch (error) {
      setLoading(false);
      message.error("Failed to add transaction");
    }
  };
  return (
    <Layout>
      {loading && <Spinner />}
      <div className="filters">
        <div>
          <h5>Select Frequency</h5>
          <Select style={{ width: '150px' }}value={frequency} onChange={(values) => setFrequency(values)}>
            <Select.Option value="7">Last 1 Week</Select.Option>
            <Select.Option value="30">Last 1 Month</Select.Option>
            <Select.Option value="365">Last 1 Year</Select.Option>
            <Select.Option value="custom">custom</Select.Option>
          </Select>
          {frequency === "custom" && (
            <RangePicker
              value={selectedDate}
              onChange={(values) => setSelectedate(values)}
            />
          )}
        </div>
        <div>
          <h5>Select Type</h5>
          <Select style={{ width: '80px' }} value={type} onChange={(values) => setType(values)}>
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="income">Income</Select.Option>
            <Select.Option value="expense">Expense</Select.Option>
          </Select>
          {frequency === "custom" && (
            <RangePicker
              value={selectedDate}
              onChange={(values) => setSelectedate(values)}
            />
          )}
        </div>

        <div className="switch-icons">
          <TableOutlined
            title="table analytics"
            className={`mx-2 ${
              viewData === "table" ? "active-icons" : "inactive-icon"
            }`}
            onClick={() => setViewData("table")}
          />
          <AreaChartOutlined
            title="charts analytics"
            className={`mx-2 ${
              viewData === "analytics" ? "active-icons" : "inactive-icon"
            }`}
            onClick={() => setViewData("analytics")}
          />
        </div>
        <button className="btn btn-primary mt-30" onClick={() => setShowModal(true)}>
          Add Transaction
        </button>
      </div>
      <div className="content">
        {viewData === "table" ? (
          <Table columns={colums} dataSource={allTransaction} />
        ) : (
          <Analytics allTransaction={allTransaction} />
        )}
      </div>

      <Modal
        title={editable ? "Edit Transaction" : "Add Transaction"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={false}
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={editable}
        >
          <Form.Item label="Amount" name="amount">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Type" name="type">
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="tip">Tip</Select.Option>
              <Select.Option value="project">Project</Select.Option>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="movie">Movie</Select.Option>
              <Select.Option value="bills">Bills</Select.Option>
              <Select.Option value="school">School</Select.Option>
              <Select.Option value="college">College</Select.Option>
              <Select.Option value="fee">Fee</Select.Option>
              <Select.Option value="tax">Tax</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date" name="date">
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Reference" name="reference">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input type="text" />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              SAVE{" "}
            </button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
