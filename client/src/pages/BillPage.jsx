import { Button, Table, Input, Space, Spin } from 'antd';
import Header from '../components/header/Header';
import { useEffect, useState, useRef } from 'react';
import PrintBill from '../components/bills/PrintBill';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const BillPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [billItems, setBillItems] = useState();
    const [customer, setCustomer] = useState();

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


    useEffect(() => {
        const getBills = async () => {
            try {
                const res = await fetch(process.env.REACT_APP_SERVER_URL+"/api/bills/get-all");
                const data = await res.json();
                setBillItems(data);
            } catch (error) {
                console.log(error);
            }
        }
        getBills();
    }, []);


    const columns = [
        {
            title: 'Müşteri Adı',
            dataIndex: 'customerName',
            key: 'customerName',
            ...getColumnSearchProps("customerName")
        },
        {
            title: 'Telefon Numarası',
            dataIndex: 'customerPhoneNumber',
            key: 'customerPhoneNumber',
            ...getColumnSearchProps("customerPhoneNumber")
        },
        {
            title: 'Oluşturma Tarihi',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => {
                return <span>{text.substring(0, 10)}</span>
            }
        },
        {
            title: 'Ödeme Yöntemi',
            dataIndex: 'paymentMode',
            key: 'paymentMode',
        },
        {
            title: 'Toplam Fiyat',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (text) => {
                return <span>{text}₺</span>
            },
            sorter: (a, b) => a.totalAmount - b.totalAmount
        },
        {
            title: 'Actions',
            dataIndex: 'action',
            key: 'actions',
            render: (text, record) => {
                return <Button type='link' className='pl-0' onClick={() => {
                    setIsModalOpen(true);
                    setCustomer(record);
                }}>Yazdır</Button>
            }
        }

    ];
    return (
        <>
            <Header />
            {billItems ? (
                <div className='px-6 '>
                <h1 className='text-4xl font-bold text-center mb-4'> Faturalar </h1>
                <Table dataSource={billItems} columns={columns} bordered pagination={false} rowKey={"_id"} scroll={{
                    x: 1000, y: 300
                }} />

                <PrintBill
                    customer={customer}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                ></PrintBill>


            </div>): <Spin size="large" className='absolute top-1/2 w-screen flex item-center justify-center' />}

        </>
    )
}

export default BillPage;