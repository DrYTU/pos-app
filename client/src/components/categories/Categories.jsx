import "./style.css";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import Add from "./Add";
import Edit from "./Edit";

const Categories = ({ categories, setCategories, setFiltered, products }) => {

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [categoryTitle, setCategoryTitle] = useState("Tümü");

    useEffect(()=>{
        if(categoryTitle === "Tümü"){
            setFiltered(products);
        }else{
            setFiltered(products.filter((product)=> product.category === categoryTitle));
        }
        
    },[products, setFiltered, categoryTitle])
    
    return (
        <ul className="flex gap-4  text-xl md:flex-col">
            {categories.map((item) => (
                <li className={`category-item select-none ${item.title === categoryTitle && "!bg-pink-700"}`} key={item._id} onClick={()=> setCategoryTitle(item.title)}>
                    <span>{item.title}</span>
                </li>
            ))}

            <li className="category-item !bg-purple-800 hover:opacity-80" onClick={() => setIsAddModalOpen(true)}>
                <PlusOutlined className="md:text-2xl"></PlusOutlined>
            </li>
            <li className="category-item !bg-orange-800 hover:opacity-80" onClick={() => setIsEditModalOpen(true)}>
                <EditOutlined className="md:text-2xl"></EditOutlined>
            </li>

            <Add
            isAddModalOpen={isAddModalOpen} 
            setIsAddModalOpen={setIsAddModalOpen}
            categories={categories} 
            setCategories={setCategories}/>
            <Edit
            isEditModalOpen={isEditModalOpen} 
            setIsEditModalOpen={setIsEditModalOpen}
            categories={categories}
            setCategories={setCategories}/>
        </ul>
    )
}

export default Categories;