import { Button, Card, Form, Input, message, Modal, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { reset } from "../../redux/cartSlice";

const CreateBill = ({ isModalOpen, setIsModalOpen }) => {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const navigate = useNavigate();


    const onFinish = async (values) => {
        try {
            const res = await fetch(process.env.REACT_APP_SERVER_URL+"/api/bills/add-bill", {
                method: "POST",
                body: JSON.stringify(
                    {
                        ...values,
                        subTotal: cart.total,
                        tax: (cart.tax * cart.total / 100).toFixed(2),
                        totalAmount: (cart.total + (cart.tax * cart.total / 100)).toFixed(2),
                        cartItems:cart.cartItems
                    }),
                    headers: {"Content-type": "application/json; charset=UTF-8" }
            })
            if(res.status === 200){
                message.success("Fatura Başarıyla Oluşturuldu");
                dispatch(reset());
                navigate("/bills");
            }
        } catch (error) {
            message.danger("Bir şeyler yanlış gitti !?");
            console.log(error)
        }
    };
    return (
        <Modal
            title="Fatura Oluştur"
            open={isModalOpen}
            footer={false}
            onCancel={() => setIsModalOpen(false)}

        >
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item label="Müşteri Adı" name="customerName" rules={[{ required: true, message: "Müşteri Adı Boş Bırakılamaz", }]}>
                    <Input placeholder="Bir Müşteri Adı Yazınız"></Input>
                </Form.Item>
                <Form.Item label="Tel No" name="customerPhoneNumber" rules={[{ required: true, message: "Telefon Numarası Boş Bırakılamaz", }]}>
                    <Input placeholder="Bir Telefon Numarası Yazınız" maxLength={11}></Input>
                </Form.Item>
                <Form.Item label="Ödeme Yöntemi" name="paymentMode" rules={[{ required: true, message: "Ödeme Yöntemi Boş Bırakılamaz", }]}>
                    <Select placeholder="Ödeme Yöntemi Seçiniz">
                        <Select.Option value="Nakit">Nakit</Select.Option>
                        <Select.Option value="Kredi Kartı">Kredi Kartı</Select.Option>
                    </Select>
                </Form.Item>

                
                <Card>
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
                    <div className="flex justify-end">
                        <Button 
                        className='mt-4' 
                        type="primary" 
                        onClick={() => setIsModalOpen(true)} 
                        htmlType="submit"
                        disabled={cart.cartItems.length === 0}
                        > Sipariş Oluştur </Button>
                    </div>
                </Card>
            </Form>



        </Modal>
    )
}

export default CreateBill;