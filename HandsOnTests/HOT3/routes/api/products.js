import express from 'express'
import debug from 'debug';

const router = express.Router();
const debugProduct = debug('app:Products');

router.use(express.urlencoded({ extended: false }));
router.use(express.json());



export { router as productRouter }