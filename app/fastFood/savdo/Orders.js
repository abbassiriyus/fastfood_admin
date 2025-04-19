import React, { useState } from 'react';
import { Table, Button, Modal, Form, Select } from 'antd';
import OrderProducts from './OrderProducts'; // OrderProducts komponentini import qilish

const { Option } = Select;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [form] = Form.useForm();
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const showModal = (order) => {
    setCurrentOrder(order);
    form.setFieldsValue(order ? { user_id: order.user_id, status: order.status } : { user_id: '', status: 0 });
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (currentOrder) {
        setOrders(orders.map(ord => (ord.id === currentOrder.id ? { ...ord, ...values } : ord)));
      } else {
        setOrders([...orders, { id: Date.now(), ...values }]);
      }
      form.resetFields();
      setIsModalVisible(false);
      setCurrentOrder(null);
    });
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'O`chirishni tasdiqlaysizmi?',
      content: 'Bu zakazni O`chirishni xohlaysizmi?',
      onOk: () => {
        setOrders(orders.filter(ord => ord.id !== id));
      },
    });
  };

  const showOrderProducts = (orderId) => {
    setSelectedOrderId(orderId);
  };

  return (
    <div>
      <Button type="primary" onClick={() => showModal(null)}>Zakaz qo'shish</Button>
      <Table
        dataSource={orders}
        columns={[
          { title: 'Foydalanuvchi ID', dataIndex: 'user_id', key: 'user_id' },
          { title: 'Holat', dataIndex: 'status', key: 'status', render: text => text === 0 ? 'Yangi' : 'Bajarilgan' },
          {
            title: 'Amallar',
            render: (_, record) => (
              <>
                <Button onClick={() => showModal(record)}>Tahrirlash</Button>
                <Button onClick={() => handleDelete(record.id)}>O`chirish</Button>
                <Button onClick={() => showOrderProducts(record.id)}>Mahsulotlarni ko'rish</Button>
              </>
            ),
          },
        ]}
      />
      <Modal title="Zakaz qo'shish/tahrirlash" visible={isModalVisible} onOk={handleOk} onCancel={() => setIsModalVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="user_id" label="Foydalanuvchi ID" rules={[{ required: true, message: 'Iltimos, foydalanuvchi ID ni kiriting!' }]}>
            <Select>
              <Option value={1}>Foydalanuvchi 1</Option>
              <Option value={2}>Foydalanuvchi 2</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Holat" rules={[{ required: true, message: 'Iltimos, holatni tanlang!' }]}>
            <Select>
              <Option value={0}>Yangi</Option>
              <Option value={1}>Bajarilgan</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {selectedOrderId && <OrderProducts orderId={selectedOrderId} />}
    </div>
  );
};

export default Orders;