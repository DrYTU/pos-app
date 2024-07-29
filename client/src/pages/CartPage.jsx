import { Button, Card, Table, message, Popconfirm,  Input, Space } from 'antd';
import Header from '../components/header/Header';
import { useRef, useState } from 'react';
import CreateBill from '../components/cart/CreateBill';
import { useDispatch, useSelector } from "react-redux";
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { increase, decrease, deleteCart } from "../redux/cartSlice";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const CartPage = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cart = useSelector((state) => state.cart)

  //for filtering
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });


  const columns = [
    {
      title: 'Ürün Görseli',
      dataIndex: 'img',
      key: 'img',
      width: "125px",
      render: (text) => {
        return (<img alt='' src={text} className='w-full h-20' />)
      }
    },
    {
      title: 'Ürün Adı',
      dataIndex: 'title',
      key: 'title',
      ...getColumnSearchProps('title'),
    },
    {
      title: 'Kategori',
      dataIndex: 'category',
      key: 'category',
      ...getColumnSearchProps('category'),
    },
    {
      title: 'Ürün Fiyatı',
      dataIndex: 'price',
      key: 'price',
      render: (text, record) => {
        return (
          record.price
        )
      },
      sorter: (a, b) => a.price - b.price
    },
    {
      title: 'Ürün Adedi',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text, record) => {
        return (
          <>
            <Button
              type="primary"
              size="small"
              className="w-full  justify-center !rounded-full"
              icon={<MinusCircleOutlined />}
              onClick={() => {
                if (record.quantity === 1) {
                  if (window.confirm("Ürün Silinsin Mi?")) {
                    dispatch(decrease(record));
                    message.success("Ürün Sepetten Silindi");
                  }
                } if (record.quantity > 1) {
                  dispatch(decrease(record));
                }
              }} />
            <span className="font-bold  w-5 inline-block text-center">{record.quantity}</span>
            <Button type="primary" size="small" className="w-full justify-center !rounded-full" icon={<PlusCircleOutlined />} onClick={() => dispatch(increase(record))} />
          </>
        )
      }
    },
    {
      title: 'Toplam Fiyat',
      dataIndex: 'total',
      key: 'total',
      render: (text, record) => {
        return (
          <span>{(record.price * record.quantity).toFixed(2)}</span>
        )
      }
    },
    {
      title: 'Actions',
      dataIndex: 'total',
      key: 'total',
      render: (_, record) => {
        return (
          <Popconfirm
            title="Ürünü Sepetten Sil"
            description="Ürünü Silmek İstediğinize Emin Misiniz?"
            onConfirm={() => {
              dispatch(deleteCart(record));
              message.success("Ürün Sepetten Silindi");
            }}
            onCancel={() => { }}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button type='link' danger >Sil</Button>
          </Popconfirm>
        )
      }
    },
  ];
  return (
    <>
      <Header />
      <div className='px-6 '>
        <Table
          dataSource={cart.cartItems}
          columns={columns}
          bordered
          pagination={false}
          rowKey={"_id"}
          scroll={{
            x: 1200,
            y: 400
          }}
        />
        <div className="cart-total flex justify-end mt-4">
          <Card className='w-72'>
            <div className='flex justify-between'>
              <span>Ara Toplam:</span>
              <span>{cart.total > 0 ? (cart.total).toFixed(2) : cart.total}₺</span>
            </div>
            <div className='flex justify-between my-2'>
              <span>KDV %{cart.tax}</span>
              <span className='text-red-600'>{cart.total > 0 ? `+ ${(cart.tax * cart.total / 100).toFixed(2)}` : cart.total}₺</span>
            </div>
            <div className='flex justify-between'>
              <b>Toplam:</b>
              <b>{cart.total > 0 ? (cart.total + (cart.tax * cart.total / 100)).toFixed(2) : cart.total}₺</b>
            </div>
            <Button className='mt-4 w-full' size="large" type="primary" onClick={() => setIsModalOpen(true)}
              disabled={cart.cartItems.length === 0}
            > Sipariş Oluştur </Button>
          </Card>
        </div>
        <CreateBill
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        ></CreateBill>


      </div>

    </>
  )
}

export default CartPage;