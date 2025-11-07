import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CartItemType } from "@/types/cart/cart-item-type";
import Image from "next/image";

export default function CartItemsSummary({ cartItems }: { cartItems: CartItemType[] }) {
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
            {cartItems?.map((cartItem) => (
                <TableRow key={cartItem.productId}>
                    <TableCell className="flex items-center gap-2">
                        <Image src={cartItem.image} alt={cartItem.name} width={64} height={64} />
                        <span className="text-sm font-medium">{cartItem.name}</span>
                    </TableCell>
                    <TableCell>
                        {cartItem.quantity}
                    </TableCell>
                    <TableCell>
                        ${cartItem.price.toFixed(2)}
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
  );
}