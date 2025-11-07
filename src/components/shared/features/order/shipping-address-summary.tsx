import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShippingAddressType } from "@/types/user/shipping-address-type";
import { MapPin, Pencil} from "lucide-react"
import Link from "next/link";

export default function ShippingAddressSummary({
  shippingAddress,
  canEdit = true,
}: {
  shippingAddress: ShippingAddressType;
  canEdit?: boolean;
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-start gap-2"><MapPin className="w-4 h-4" /> Shipping Address Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {shippingAddress.fullName && (
          <div className="flex justify-between items-center">
            <span className="font-medium">Full Name</span>
            <span>{shippingAddress.fullName}</span>
          </div>
        )}
        {shippingAddress.phone && (
          <div className="flex justify-between items-center">
            <span className="font-medium">Phone</span>
            <span>{shippingAddress.phone}</span>
          </div>
        )}
        {(shippingAddress.country || shippingAddress.state || shippingAddress.city || shippingAddress.zip) && (
          <div className="flex justify-between items-center">
            <span className="font-medium">Address</span>
            <span>
              {shippingAddress.country}
              {shippingAddress.state ? ' ' + shippingAddress.state : ''}
              {shippingAddress.city ? ' ' + shippingAddress.city : ''}
              {shippingAddress.zip ? ' ' + shippingAddress.zip : ''}
            </span>
          </div>
        )}
        {shippingAddress.latitude && (
          <div className="flex justify-between items-center">
            <span className="font-medium">Latitude</span>
            <span>{shippingAddress.latitude}</span>
          </div>
        )}
        {shippingAddress.longitude && (
          <div className="flex justify-between items-center">
            <span className="font-medium">Longitude</span>
            <span>{shippingAddress.longitude}</span>
          </div>
        )}
      </CardContent>
      {canEdit && (
      <CardFooter>
        <Button asChild variant="outline" className="w-fit">
            <Link href="/shipping-address">
                <Pencil className="w-4 h-4" /> Edit Address
            </Link>
        </Button>
      </CardFooter>
      )}
    </Card>
  );
}
