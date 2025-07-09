import Button from '../UI/Button';
import { Link } from 'react-router-dom';

const CartSummary = ({ subtotal }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Summary</h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{subtotal} coм</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery</span>
          <span className="text-green-600">Free</span>
        </div>
        <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{subtotal} coм</span>
        </div>
      </div>
      <Button className="w-full mt-6">Checkout</Button>
      
    </div>
  );
};

export default CartSummary;