import { useDispatch } from 'react-redux';
import { incrementQuantity, decrementQuantity, removeItem } from '../../redux/cartSlice';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col sm:flex-row py-4 border-b border-gray-200">
      <div className="w-full sm:w-1/4 mb-4 sm:mb-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-auto rounded"
        />
      </div>
      <div className="w-full sm:w-3/4 sm:pl-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-medium">{item.name}</h3>
            <p className="text-gray-600">Size: {item.size}</p>
            <p className="text-lg font-semibold mt-2">{item.price} coм</p>
          </div>
          <button
            onClick={() => dispatch(removeItem({ id: item.id, size: item.size }))}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <div className="flex items-center mt-4">
          <button
            onClick={() => dispatch(decrementQuantity({ id: item.id, size: item.size }))}
            className="border border-gray-300 px-3 py-1 rounded-l"
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <span className="border-t border-b border-gray-300 px-4 py-1">
            {item.quantity}
          </span>
          <button
            onClick={() => dispatch(incrementQuantity({ id: item.id, size: item.size }))}
            className="border border-gray-300 px-3 py-1 rounded-r"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;