import { useState } from "react"
import { nanoid } from "nanoid"

export default function CartList(){
    
    const [items, setItems] = useState([
        {id:nanoid(), name: 'Hat', quantity: 2}
    ]);
    return(
        <>

        </>
    )
}