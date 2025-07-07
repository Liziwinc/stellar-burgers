import { FC, useMemo, useEffect } from 'react'; // Добавляем useEffect
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  clearNewOrder,
  createNewOrder
} from '../../services/slices/ordersSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const constructorItems = useSelector((state) => state.burgerConstructor);
  const { newOrder, status } = useSelector((state) => state.orders);
  const user = useSelector((state) => state.user.user);

  const orderRequest = status === 'loading';

  useEffect(() => {
    if (newOrder) {
      dispatch(clearConstructor());
    }
  }, [newOrder, dispatch]);

  const onOrderClick = () => {
    if (!constructorItems.bun) return;
    if (!user) {
      return navigate('/login');
    }

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.mains.map((ing) => ing._id)
    ];
    dispatch(createNewOrder(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(clearNewOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.mains.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={newOrder}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
