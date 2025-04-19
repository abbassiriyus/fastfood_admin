import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Upload, Select } from 'antd';

const { Option } = Select;

const Products = ({ categories }) => {
  const [products, setProducts] = useState([{}]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [form] = Form.useForm();

  const showModal = (product) => {
    setCurrentProduct(product);
    form.setFieldsValue(product ? { name: product.name, image: product.image, desc: product.desc, price: product.price, category_id: product.category_id } : { name: '', image: '', desc: '', price: '', category_id: '' });
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (currentProduct) {
        setProducts(products.map(prod => (prod.id === currentProduct.id ? { ...prod, ...values } : prod)));
      } else {
        setProducts([...products, { id: Date.now(), ...values }]);
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
        setProducts(products.filter(prod => prod.id !== id));
      },
    });
  };

  return (
    <div>
      <Button type="primary" onClick={() => showModal(null)}>Mahsulot qo'shish</Button>
      <Table
        dataSource={products}
        columns={[
          { title: 'Nomi', dataIndex: 'name', key: 'name' },
          { title: 'Kategoriya', dataIndex: 'category_id', render: (text) => categories.find(cat => cat.id === text)?.name },
          { title: 'Narxi', dataIndex: 'price', key: 'price' },
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
          <Form.Item name="name" label="Mahsulot nomi" rules={[{ required: true, message: 'Iltimos, nomni kiriting!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category_id" label="Kategoriya" rules={[{ required: true, message: 'Iltimos, kategoriya tanlang!' }]}>
            <Select>
              {categories.map(cat => <Option key={cat.id} value={cat.id}>{cat.name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="image" label="Rasmi" rules={[{ required: true, message: 'Iltimos, rasm yuklang!' }]}>
            <Upload beforeUpload={() => false} onChange={({ file }) => {
              if (file.status === 'done') {
                file.url = URL.createObjectURL(file.originFileObj);
              }
            }}>
              <Button>Rasm yuklash</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="desc" label="Tavsifi" rules={[{ required: true, message: 'Iltimos, tavsif kiriting!' }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="price" label="Narxi" rules={[{ required: true, message: 'Iltimos, narxni kiriting!' }]}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;