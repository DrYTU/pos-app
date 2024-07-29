import { Button, Form, Input, Modal, Table, message } from 'antd';
import React, { useState } from 'react';

const Edit = ({ isEditModalOpen, setIsEditModalOpen, categories, setCategories }) => {

  const [editingRow, setEditingRow] = useState({});

  const deleteCategory = (id) => {
    if (window.confirm("Emin misiniz?")) {
      try {
        fetch(process.env.REACT_APP_SERVER_URL+"/api/categories/delete-category", {
          method: "DELETE",
          body: JSON.stringify({ categoryId: id }),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });
        message.success("Kategori başarıyla silindi.");
        setCategories(
          categories.filter((item) => item._id !== id)
        )
      } catch (error) {
        message.error("Bir şeyler yanlış gitti.")
        console.log(error);
      }
    }
  };

  const onFinish = (values) => {
    try {

      fetch(process.env.REACT_APP_SERVER_URL+"/api/categories/update-category", {
        method: "PUT",
        body: JSON.stringify({ ...values, categoryId: editingRow._id }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });

      message.success("Kategori başarıyla güncellendi.");
      setCategories(
        categories.map((item) => {
          if (item._id === editingRow._id) {
            return { ...item, title: values.title };
          }
          return item;
        })
      );
    } catch (error) {
      message.error("Bir şeyler yanlış gitti.")
      console.log(error);
    }
  }

  const columns = [
    {
      title: "Category Title",
      dataIndex: "title",
      render: (_, record) => {
        if (record._id === editingRow._id) {
          return (
            <Form.Item className='mb-0' name="title">
              <Input defaultValue={record.title} />
            </Form.Item>
          );
        } else {
          return <p>{record.title}</p>
        }

      }
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div>
            <Button type="link" className='pl-0' onClick={() => setEditingRow(record)}>Düzenle</Button>
            <Button type="link" className='custom-save-button' htmlType='submit' >Kaydet</Button>
            <Button type="link" danger
              onClick={() => deleteCategory(record._id)}>Sil</Button>
          </div>
        )
      }
    }
  ]

  return (
    <Modal
      open={isEditModalOpen}
      title="Kategori İşlemleri"
      footer={false}
      onCancel={() => setIsEditModalOpen(false)}
    >
      <Form onFinish={onFinish}>
        <Table bordered dataSource={categories} columns={columns} rowKey={"_id"}></Table>
      </Form>
    </Modal>
  )
};

export default Edit;