"use client"
import React, { useState } from 'react'
import s from  "./ofitsant.module.css"
import { Table,Button, Modal } from 'antd';


export default function Ofitsant() {
    var [page,setpage]=useState(0)
    const [open, setOpen] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);

  const [loading, setLoading] = React.useState(true);
  const showLoading = () => {
    setOpen(true);
    setLoading(true);
    // Simple loading mock. You should add cleanup logic in real world.
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
    const columns = [
        { title: 'id', dataIndex: 'id', key: 'id' },
        { title: 'stol', dataIndex: 'stol', key: 'stol' },
        { title: 'price', dataIndex: 'price', key: 'price' },
        {
          title: 'Action',
          dataIndex: '',
          key: 'x',
          render: () => <a onClick={()=>{setOpen2(true)
            setLoading(true)
            setTimeout(() => {
                setLoading(false)
            }, 1000);
          }}>tugatish</a>,
        },
      ];
      const columns2 = [
        { title: 'id', dataIndex: 'id', key: 'id' },
        { title: 'stol', dataIndex: 'stol', key: 'stol' },
        { title: 'time', dataIndex: 'time', key: 'time' },
        {
          title: 'Action',
          dataIndex: '',
          key: 'x',
          render: () => <a onClick={showLoading} >qabul qilish</a>,
        },
      ];
      const columns3 = [
        { title: 'id', dataIndex: 'id', key: 'id' },
        { title: 'stol', dataIndex: 'stol', key: 'stol' },
        { title: 'time', dataIndex: 'time', key: 'time' },
        { title: 'price', dataIndex: 'price', key: 'price' },
      ];
      const data = [
        {
          key: 1,
          id: 234,
          stol: 32,
          time:'10:34 12.22.2025',
          price:122+"so`m",
          description:  <>  <table className={s.dataTable}>
          <thead className={s.dataTable__header}>
              <tr>
              <th className={s.dataTable__headerCell}>fastfood</th>
                  <th className={s.dataTable__headerCell}>product</th>
                  <th className={s.dataTable__headerCell}>count</th>
                  <th className={s.dataTable__headerCell}>price</th>
                  </tr>
          </thead>
          <tbody className={s.dataTable__body}>
              <tr className={s.dataTable__row}>
              <td className={s.dataTable__cell}>evos</td>
                  <td className={s.dataTable__cell}>somsa</td>
                  <td className={s.dataTable__cell}>1</td>
                  <td className={s.dataTable__cell}>1233</td>
    
              </tr>
              <tr className={s.dataTable__row}>
              <td className={s.dataTable__cell}>evos</td>
                  <td className={s.dataTable__cell}>shashlik</td>
                  <td className={s.dataTable__cell}>1</td>
                  <td className={s.dataTable__cell}>1233</td>
              </tr>
              <tr className={s.dataTable__row}>
              <td className={s.dataTable__cell}>evos</td>
                  <td className={s.dataTable__cell}> perashka</td>
                  <td className={s.dataTable__cell}>1</td>
                  <td className={s.dataTable__cell}>1233</td>
              </tr>
          </tbody>
      </table>
      <h5>Jami:</h5>
      </>
        },
        {
          key: 2,
          id: 234,
          stol: 42,
          time:'10:34 12.22.2025',
          price: 122+"so`m",
          description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
        },
        {
          key: 3,
          id: 345,
          stol: 29,
          time:'10:34 12.22.2025',
          price: 122+"so`m",
          description: 'This not expandable',
        },
        {
          key: 4,
          id: 55,
          stol: 32,
          time:'10:34 12.22.2025',
          price:122+"so`m",
          description: 'My name is Joe Black, I am 32 years old, living in Sydney No. 1 Lake Park.',
        },
      ];
    return (
    <div>
    <div className={s.tabs}>
        <div className={s.tabs__tab} style={page==0?{opacity:0.4}:{opacity:1}} onClick={()=>setpage(0)} id="new">Yangilar</div>
        <div className={s.tabs__tab} style={page==1?{opacity:0.4}:{opacity:1}} onClick={()=>setpage(1)} id="completed">Amalda</div>
        <div className={s.tabs__tab} style={page==2?{opacity:0.4}:{opacity:1}} onClick={()=>setpage(2)} id="today">Tarix</div>
    </div>
    {page==0?    
     <Table
     columns={columns2}
     dataSource={data}
   />
:<></>}
{page==1?   <Table
    columns={columns}
    expandable={{
      expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
      rowExpandable: record => record.name !== 'Not Expandable',
    }}
    dataSource={data}
  />
:""}
  {page==2?  
      <Table
      columns={columns3}
      dataSource={data}
    />
:""}

<Modal
        title={<p>Yangi buyurtma</p>}
        footer={
          <Button type="primary" onClick={()=>setOpen(false)}>
            qabul qilaman
          </Button>
        }
        loading={loading}
        open={open}
        onCancel={() => setOpen(false)}
      >
        <p>siz buyurtmani qabul qilmoqchimisiz</p>
      </Modal>
      <Modal
        title={<p>Tugatish</p>}
        footer={
          <Button type="primary" onClick={()=>setOpen2(false)}>
            tasdiqlayman
          </Button>
        }
        loading={loading}
        open={open2}
        onCancel={() => setOpen2(false)}
      >
        <p>Buyurtmani yugatganingizni tasdiqlang!</p>
        <p>Siz bajarilgan buyurtmani tarix bo`limida ko`rasiz</p>
      </Modal> 
    </div>
  )
}
