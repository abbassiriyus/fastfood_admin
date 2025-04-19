import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input } from 'antd';

const Categories = () => {
  const [categories, setCategories] = useState([{}]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [form] = Form.useForm();

  const showModal = (category) => {
    setCurrentCategory(category);
    form.setFieldsValue(category ? { name: category.name } : { name: '' });
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (currentCategory) {
        setCategories(categories.map(cat => (cat.id === currentCategory.id ? { ...cat, name: values.name } : cat)));
      } else {
        setCategories([...categories, { id: Date.now(), name: values.name }]);
      }
      form.resetFields();
      setIsModalVisible(false);
      setCurrentCategory(null);
    });
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'O`chirishni tasdiqlaysizmi?',
      content: 'Bu kategoriyani O`chirishni xohlaysizmi?',
      onOk: () => {
        setCategories(categories.filter(cat => cat.id !== id));
      },
    });
  };

  return (
    <div>
      <Button type="primary" onClick={() => showModal(null)}>Kategoriyani qo'shish</Button>
      <Table
        dataSource={categories}
        columns={[
          { title: 'Nomi', dataIndex: 'name', key: 'name' },
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
      <Modal title="Kategoriyani qo'shish/tahrirlash" visible={isModalVisible} onOk={handleOk} onCancel={() => setIsModalVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Kategoriyaning nomi" rules={[{ required: true, message: 'Iltimos, nomni kiriting!' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;