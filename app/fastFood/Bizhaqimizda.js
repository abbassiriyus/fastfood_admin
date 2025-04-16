import React, { useState } from 'react';
import { Button, Modal, Form, Upload, Card, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const AdminPanel = () => {
  const [images, setImages] = useState(['https://i.ytimg.com/vi/7YRmInbiUHw/maxresdefault.jpg','https://i.ytimg.com/vi/7YRmInbiUHw/maxresdefault.jpg']);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      const newImage = values.image[0].url; // Rasmingizni URL sifatida saqlash
      setImages([...images, newImage]);
      form.resetFields();
      setIsModalVisible(false);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const deleteImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  return (
    <div>
      <Button type="primary" onClick={showModal} icon={<PlusOutlined />}>
        Rasm qo'shish
      </Button>
      <Row gutter={16} style={{ marginTop: '16px' }}>
        {images.map((item, index) => (
          <Col span={8} key={index}>
            <Card
              hoverable
              cover={<img alt="Uploaded" src={item} style={{ height: '200px', objectFit: 'cover' }} />}
              actions={[
                <Button type="link" onClick={() => deleteImage(index)}>O'chirish</Button>,
              ]}
            >
              <Card.Meta title={`Rasm ${index + 1}`} />
            </Card>
          </Col>
        ))}
      </Row>
      <Modal title="Rasm qo'shish" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout="vertical">
          <Form.Item
            name="image"
            label="Rasm yuklash"
            rules={[{ required: true, message: 'Rasmni yuklang!' }]}
          >
            <Upload
              listType="picture"
              beforeUpload={() => false}
              onChange={({ file }) => {
                if (file.status === 'done') {
                  file.url = URL.createObjectURL(file.originFileObj);
                }
              }}
              maxCount={1}
            >
              <Button>Rasm yuklash</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPanel;