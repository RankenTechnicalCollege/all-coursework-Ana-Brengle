import { useState } from "react"
import { nanoid } from "nanoid"

export default function CartList(){
    
    const [items, setItems] = useState([
        {id:nanoid(), name: 'Hat', quantity: 2},
        {id:nanoid(), name: 'Shirt', quantity: 1},
        {id:nanoid(), name: 'Pants', quantity: 3}
    ]);

    let itemCount = 0;
    for (const item of items) {
        if (item && item.quantity) {
            itemCount += item.quantity
        }
    }

    function onNameChange(evt, item) {
        const newItems =  [...items];
        const index = items.indexOf(item);
        newItems[index].name = evt.target.value;
        setItems(newItems);
    }

    function onAddQuantity(evt, item) {
        const newQuantity = item.quantity + 1;
        if (newQuantity <= 10) {
            const newItems = [...items];
            const index = items.indexOf(item);
            newItems[index].quantity++;
            setItems(newItems)
        }
        
    }

    function onSubtractQuantity(evt, item) {
        const newQuantity = item.quantity - 1;
        if (newQuantity > 0) {
            const newItems = [...items];
            const index = items.indexOf(item);
            newItems[index].quantity--;
            setItems(newItems)
        }
        else {
            setItems(items.filter(i => i.id !== item.id))
        }
        
    }
    return(
        <>
        <div className="flex flex-col p-4 border-4 border-blue-400 rounded-lg bg-stone-100">
            <div className="flex font-bold text-3xl flex-items-center justify-between mb-5">
                <span className="">Shopping Cart</span>
                <span className="">{itemCount > 0 ? itemCount : 'Add Items To Cart'}</span>
            <div className="flex mb-5">
                <button className="px-4 py-2 mr-2 bg-blue-600 text-white rounded-full hover:bg-blue-700" onClick={() => setItems([...items, { id: nanoid(), name: '', quantity: 1 }])}>Add Item</button>
                {items.length === 0 && (
                    <div className="text-red-600 font-extrabold m-auto text-lg"> Your cart is empty! Add some items to it.</div>
                )}
            </div>
            </div>
            {items.map(item => 
                <div className="grid grid-cols-3 mb-5" key={item.id}>
                    <div className="col-span-1">
                        <input type="text"  className="border-6 border-stone-900 rounded-sm px-1 bg-stone-50" value={item.name} onChange={(evt) => onNameChange(evt, item)}/>
                    </div>
                    <div className="">
                        <span className="">Qty: {item.quantity}</span>
                    </div>
                    <div className="">
                        <button className="px-4 py-2 m-3 bg-blue-600 text-white rounded-full hover:bg-blue-700" disabled={item.quantity <=0 ? true:false} onClick={evt => onSubtractQuantity(evt, item)}>-</button>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700" disabled={item.quantity >=10 ? true:false} onClick={evt => onAddQuantity(evt, item)}>+</button>
                    </div>
                </div>
            )}
        </div>
        </>
    )
}