import express from 'express';
const router = express.Router();

import debug from 'debug';
const debugProducts = debug('app:Products');

import { getProducts, getProductByName, getProductId } from '../../database.js';

router.get('', async (req, res) =>{
    try{
        const products = await getProducts();
    
        if(!products){
            res.status(404).json({message: 'Products not found'});
            return;
        } else{
            res.status(200).json(products)
        }
    } catch (error){
        console.error("Error loading products:", error);
        res.status(500).json({message: 'Error Loading Products'})
    }
    
})

router.get('/name/:productName', async (req, res) =>{
    try {
        const productName = req.params.productName
        const product = await getProductByName(productName)

        if(!product){
            res.status(404).json({message: 'Product not found'});
            return;
        } else{
            res.status(200).json(product)
        }

    } catch (error) {
        console.error("Error loading products:", error);
        res.status(500).json({message: 'Error Loading Products'})
    }
})

router.get('/name/:productId', async (req, res) =>{
    try{
        const productId = req.params.productId;
        const product = await getProductId(productId)

        if(!product){
            res.status(404).json({message: `Product ${productId} not found!`});
            return;
        } else{
            res.status(200).json({message: `Product ${productId} found`})
        }
    } catch (error){
        console.error("Error loading product:", error);
        res.status(500).json({message: 'Error Loading Product'})
    }
})

router.post('', async (req, res) =>{
    try {
        const newProduct = req.body
        if(!newProduct.name){
            res.status(400).json({message: 'Products Name is required'});
            return;
        }
        if(!newProduct.description){
            res.status(400).json({message: 'Products Description is required'});
            return;
        }
        if(!newProduct.category){
            res.status(400).json({message: 'Products Category is required'});
            return;
        }
        if(!newProduct.price){
            res.status(400).json({message: 'Products Price is required'});
            return;
        }
        const productToAdd = await addedProduct(newProduct.name, newProduct.description, newProduct.category, newProduct.price)
        debugProducts(productToAdd);

        if(productToAdd.insertedId){
            res.status(200).json({message: `Product ${newProduct.name} found`})
        } else{
            res.status(400).json({message: `Product not added`})
        }
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({message: 'Error Adding Product'})
    }
})

router.patch('', async (req, res) =>{
    
})

router.delete('', async (req, res) =>{
    
})



export { router as productRouter }