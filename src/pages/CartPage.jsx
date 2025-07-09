import { useSelector, useDispatch } from 'react-redux';
import { incrementQuantity, decrementQuantity, removeItem } from '../redux/cartSlice';
import Button from '../components/UI/Button';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg mb-4">Your cart is empty</p>
          <Link to="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
         
          <div className="w-full lg:w-2/3">
            {items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="border-b border-gray-200 py-6 flex flex-col sm:flex-row">
                <div className="w-full sm:w-1/4 mb-4 sm:mb-0 flex flex-col">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-auto rounded mb-2"
                  />
                 
                  <div className="flex ml-10 items-center justify-center sm:justify-start">
                    <button
                      onClick={() => dispatch(decrementQuantity({ id: item.id, size: item.size }))}
                      className="border border-gray-300 px-3 py-1 rounded-l hover:bg-gray-100"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="border-t border-b border-gray-300 px-4 py-1">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => dispatch(incrementQuantity({ id: item.id, size: item.size }))}
                      className="border border-gray-300 px-3 py-1 rounded-r hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="w-full sm:w-3/4 sm:pl-6">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{item.name}</h3>
                      <p className="text-gray-600">{item.description}</p>
                      <p className="text-gray-600">Size: {item.size}</p>
                      <p className="text-lg font-semibold mt-2">{item.price} coм</p>
                    </div>
                    <button
                      onClick={() => dispatch(removeItem({ id: item.id, size: item.size }))}
                      className="text-gray-400 hover:text-gray-600 h-6"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="w-full lg:w-1/3">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
              <h2 className="text-xl font-bold mb-4">Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{subtotal} coм</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="text-black">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{subtotal} coм</span>
                </div>
              </div>
              <Button 
                className="w-full mt-6 py-3 text-lg"
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;