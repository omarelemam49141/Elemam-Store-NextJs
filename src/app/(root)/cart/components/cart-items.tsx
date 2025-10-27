import { CartItemType } from "@/types/cart/cart-item.type";
import CartItemDetails from "./cart-item-details";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function CartItems({ cartItems }: { cartItems: CartItemType[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>

      {cartItems.map((cartItem) => (
        <TableRow key={cartItem.productId}>
          <CartItemDetails cartItem={cartItem} />
        </TableRow>
      ))}
      </TableBody>
    </Table>
  );
}