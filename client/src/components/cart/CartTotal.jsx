import { Button, message } from "antd"
import { ClearOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { deleteCart, increase, decrease, reset } from "../../redux/cartSlice";
import { useNavigate } from "react-router-dom";

const CartTotal = () => {
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    return (
        <div className="cart h-full max-h-[calc(100vh_-_90px)] flex flex-col">
            <h2 className="bg-blue-600 text-center py-4 text-white font-bold tracking-wide">
                Sepetteki Ürünler
            </h2>
            <ul className="card-items px-2 flex flex-col gap-y-3 pt-2 overflow-auto py-2 ">

                {cart.cartItems.length > 0 ? cart.cartItems.map((item) => (
                    <li className="cart-item flex justify-between" key={item._id}>
                        <div className="flex items-center">
                            <img src={item.img} alt="" className="w-16 h-16 object-cover cursor-pointer" onClick={() => {
                                dispatch(deleteCart(item));
                                message.success("Ürün Sepetten Silindi");
                            }} />
                            <div className="flex flex-col ml-2">
                                <b>{item.title}</b>
                                <span>{item.price}₺ x {item.quantity}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-x-1">
                            <Button type="primary" size="small" className="w-full  justify-center !rounded-full" icon={<MinusCircleOutlined />} onClick={() => {
                                if (item.quantity === 1) {
                                    if (window.confirm("Ürün Silinsin Mi?")) {
                                        dispatch(decrease(item));
                                        message.success("Ürün Sepetten Silindi");
                                    }
                                } if (item.quantity > 1) {
                                    dispatch(decrease(item));
                                }
                            }} />
                            <span className="font-bold  w-5 inline-block text-center">{item.quantity}</span>
                            <Button type="primary" size="small" className="w-full justify-center !rounded-full" icon={<PlusCircleOutlined />} onClick={() => dispatch(increase(item))} />
                        </div>

                    </li>
                )).reverse() : <span className="text-gray-400">"Sepette hiç ürün yok..."</span>}
            </ul>
            <div className="cart-totals mt-auto">
                <div className="border-t border-b">
                    <div className="flex justify-between p-2">
                        <b>Ara Toplam</b>
                        <span>{cart.total > 0 ? (cart.total).toFixed(2) : cart.total}₺</span>
                    </div>
                    <div className="flex justify-between p-2">
                        <b>KDV %{cart.tax}</b>
                        <span className="text-red-700">{cart.total > 0 ? `+ ${(cart.tax * cart.total / 100).toFixed(2)}` : cart.total}₺</span>
                    </div>
                </div>
                <div className="border-b mt-4">
                    <div className="flex justify-between p-2">
                        <b>Genel Toplam</b>
                        <span>{cart.total > 0 ? (cart.total + (cart.tax * cart.total / 100)).toFixed(2) : cart.total}₺</span>
                    </div>
                </div>
                <div className="py-4 px-2">
                    <Button 
                    type="primary" 
                    size="large" 
                    className="w-full" 
                    disabled={cart.cartItems.length===0 ? true: false }
                    onClick = {()=> navigate("/cart")}
                    >Sipariş Oluştur
                    </Button>

                    <Button type="primary" size="large" className="w-full mt-2" danger icon={<ClearOutlined />} onClick={() => {
                        if (window.confirm) { 
                            dispatch(reset());
                            message.success("Sepet Başarıyla Temizlendi");
                        }
                    }} disabled={cart.cartItems.length===0 ? true: false }>Temizle</Button>
                </div>
            </div>
        </div>
    )
}

export default CartTotal