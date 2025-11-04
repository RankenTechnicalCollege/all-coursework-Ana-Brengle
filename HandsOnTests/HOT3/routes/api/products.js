import express from 'express';
const router = express.Router();

import debug from 'debug';
const debugProducts = debug('app:Products');

import { getProducts, getProductByName, getProductId, addedProduct, getUpdatedProduct, deletedProduct } from '../../database.js';
import { validate, validId } from '../../middleware/validator.js';
import { isAuthenticated } from '../../middleware/isAuthenticated.js';
import { hasRole } from '../../middleware/hasRole.js';
import { addProductSchema, updateProductSchema } from '../../validation/productsSchema.js';

router.get('', async (req, res) =>{
    try{
        const {keywords, category, maxPrice, minPrice, sortBy} = req.query;

        const pageNum = parseInt(req.query.pageNum) || 1;
        const pageSize = parseInt(req.query.pageSize) || 5;
        const skip = (pageNum - 1) * pageSize;

        const filter = {};

        if(keywords) filter.$text = {$search: keywords};
        if(category) filter.category = {$search: keywords};


        if(minPrice || maxPrice) {
            const priceFilter = {}

            if(minPrice) priceFilter.$gte = parseInt(minPrice);
            if(maxPrice) priceFilter.$lte = parseInt(maxPrice);
            debugProducts(priceFilter)
            filter.price = priceFilter

        }
        const sortOptions = {
            name: {name: 1},
            category: {category: 1, name: 1},
            lowestPrice: { price: 1, name: 1},
            newest: {createdAt: -1, name: 1}
        };

        const sort = sortOptions[sortBy] || sortOptions['name'];
        const products = await getProducts(filter, pageSize, skip, sort);
    
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

router.get('/name/:productName', isAuthenticated, async (req, res) =>{
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

router.get('/:productId', isAuthenticated,validId('productId'),async (req, res) =>{
    try{
        const productId = req.params.productId;
        const product = await getProductId(productId)

        if(!product){
            res.status(404).json({message: `Product ${productId} not found!`});
            return;
        } else{
            res.status(200).json(product)
        }
    } catch (error){
        console.error("Error loading product:", error);
        res.status(500).json({message: 'Error Loading Product'})
    }
})

router.post('', isAuthenticated, hasRole('admin'), validate(addProductSchema),async (req, res) =>{
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

        newProduct.createdAt = new Date();
        const productToAdd = await addedProduct(newProduct)
        debugProducts(productToAdd);

        if(productToAdd.insertedId){
            res.status(200).json({message: `Product ${newProduct.name} added`})
        } else{
            res.status(400).json({message: `Product not added`})
        }
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({message: 'Error Adding Product'})
    }
})

router.patch('/:productId', isAuthenticated, hasRole('admin'), validId('productId'), validate(updateProductSchema), async (req, res) =>{
    try {
        
        const productToUpdate = req.body;
        const productId = req.params.productId
        const oldProduct = await getProductId(productId)

        let name = null;
        let description = null;
        let category = null;
        let price = null;

        if(!oldProduct) {
            res.status(400).json({message: `Product ${productId} not found`});
            return;
        }
        
        if(!productToUpdate.name){
            name = oldProduct.name;
        } else{
            name = productToUpdate.name
        }
        if(!productToUpdate.description){
            description = oldProduct.description;
        } else{
            description = productToUpdate.description
        }
        if(!productToUpdate.category){
            category = oldProduct.category;
        } else{
            category = productToUpdate.category
        }
        if(!productToUpdate.price){
            price = oldProduct.price;
        } else{
            price = productToUpdate.price
        }

        const updatedProduct = await getUpdatedProduct(productId,name,description,category,price)
        debugProducts(updatedProduct)
        if(!updatedProduct){
            res.status(400).json({message: 'Error updating Product'})
            return;
        } else {
            res.status(200).json({message: `Product ${productId} updated successfully`})
        }

    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({message: 'Error Updating Product'})
    }
})

router.delete('/:productId', isAuthenticated, hasRole('admin'), validId('productId'), async (req, res) =>{
    try {
        const productId = req.params.productId;
        const deleteProduct = await deletedProduct(productId)

        if(deleteProduct.deletedCount === 1) {
            res.status(200).json({message: `Product ${productId} deleted successfully`});
            return;
        } else{
            res.status(404).json({message: `Product ${productId} not found.`});
        }
    } catch (error) {
         console.error("Error deleting product:", error);
        res.status(500).json({message: 'Error Deleting Product'})
    }
})



export { router as productRouter }