import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select } from 'antd';

const { Option } = Select;

const OrderProducts = ({ orderId }) => {
  const [orderProducts, setOrderProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [form] = Form.useForm();

  const showModal = (product) => {
    setCurrentProduct(product);
    form.setFieldsValue(product ? { product_id: product.product_id, count: product.count } : { product_id: '', count: 1 });
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (currentProduct) {
        setOrderProducts(orderProducts.map(prod => (prod.id === currentProduct.id ? { ...prod, ...values } : prod)));
      } else {
        setOrderProducts([...orderProducts, { id: Date.now(), orderId, ...values }]);
      }
      form.resetFields();
      setIsModalVisible(false);
      setCurrentProduct(null);
    });
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'O`chirishni tasdiqlaysizmi?',
      content: 'Bu mahsulotni O`chirishni xohlaysizmi?',
      onOk: () => {
        setOrderProducts(orderProducts.filter(prod => prod.id !== id));
      },
    });
  };

  return (
    <div style={{ marginTop: '16px' }}>
      <h3>Zakaz Mahsulotlari</h3>
      <Button type="primary" onClick={() => showModal(null)}>Mahsulot qo'shish</Button>
      <Table
        dataSource={orderProducts}
        columns={[
          { title: 'Mahsulot ID', dataIndex: 'product_id', key: 'product_id' },
          { title: 'Soni', dataIndex: 'count', key: 'count' },
          {
            title: 'Amallar',
            render: (_, record) => (
              <>
                <Button onClick={() => showModal(record)}>Tahrirlash</Button>
                <Button onClick={() => handleDelete(record.id)}>O`chirish</Button>
              </>
            ),
          },
        ]}
      />
      <Modal title="Mahsulot qo'shish/tahrirlash" visible={isModalVisible} onOk={handleOk} onCancel={() => setIsModalVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="product_id" label="Mahsulot ID" rules={[{ required: true, message: 'Iltimos, mahsulot ID ni kiriting!' }]}>
            <Select>
              <Option value={1}>Mahsulot 1</Option>
              <Option value={2}>Mahsulot 2</Option>
            </Select>
          </Form.Item>
          <Form.Item name="count" label="Soni" rules={[{ required: true, message: 'Iltimos, sonini kiriting!' }]}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrderProducts;