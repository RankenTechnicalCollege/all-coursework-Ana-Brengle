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
        <div className="container">
            <span className="">Shopping Cart</span>
            <span className="">{itemCount}</span>
            <button className="" onClick={() => setItems({...items, {id: nanoid(), name: '', quantity:1}})}>Add Item</button>
            {items.map(item => 
                <div className="" key={item.id}>
                    <div className="">
                        <input type="text"  className="" value={item.name} onChange={(evt) => onNameChange(evt, item)}/>
                    </div>
                    <div className="">
                        <span className="">Qty: {item.quantity}</span>
                    </div>
                    <div className="">
                        <button className="" onClick={() => onSubtractQuantity(evt, item)}>-</button>
                        <button className="" onClick={() => onAddQuantity(evt, item)}>+</button>
                    </div>
                </div>
            )}
        </div>
        </>
    )
}