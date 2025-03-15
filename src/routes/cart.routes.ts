


import express from 'express'
import { Authenticate } from '../middlewares/authentication.middleware'
import { onlyUser } from '../@types/global.types'
import { clearCart, create, getCartByUserId, removeItemFromCart } from '../controllers/cart.controller'

const router = express.Router()


router.post('/add',Authenticate(onlyUser),create)

router.delete('/clear',Authenticate(onlyUser),clearCart)

router.get('/:userId',Authenticate(onlyUser),getCartByUserId)

router.delete('/remove/:productId',Authenticate(onlyUser),removeItemFromCart)

export default router


