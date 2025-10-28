"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { User } from "@/generated/prisma";
import { updateShippingAddressServerAction } from "@/lib/actions/user/user-actions";
import { ShippingAddressType } from "@/types/user/shipping-address-type";
import { shippingAddressValidation, defaultShippingAddress } from "@/validations/user/shipping-address-validation";
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner";
import * as z from "zod"

export default function ShippingAddressForm({user}: {user: User}) {
    //creating the form
  const form = useForm<z.infer<typeof shippingAddressValidation>>({
    resolver: zodResolver(shippingAddressValidation),
    defaultValues: user.address as ShippingAddressType || defaultShippingAddress,
    mode: "onChange",
  })

  async function onSubmit(data: ShippingAddressType) {
    // Do something with the form values.
    const response = await updateShippingAddressServerAction(data);
    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  }

  function handleReset() {
    form.reset(user.address as ShippingAddressType || defaultShippingAddress)
  }

  return (
    <Card className="w-full sm:max-w-md mx-auto">
    <CardHeader className="flex-center flex-col gap-2">
        <CardTitle className="h4-bold">Shipping Address</CardTitle>
      <CardDescription>
        Enter your shipping address information.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form id="shipping-address-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
            {/* start of full name field */}
          <Controller
            name="fullName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="fullName">
                  Full Name
                </FieldLabel>
                <Input
                  {...field}
                  id="fullName"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your full name"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {/* end of full name field */}
          {/* start of phone field */}
          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="phone">
                  Phone
                </FieldLabel>
                <Input
                  {...field}
                  id="phone"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your phone number"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
       
        {/* end of phone field */}
        {/* start of address field */}
        <Controller
          name="address"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="address">
                Address
              </FieldLabel>
              <Input
                {...field}
                id="address"
                aria-invalid={fieldState.invalid}
                placeholder="Enter your address"
                autoComplete="off"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        {/* end of address field */}
        {/* start of city field */}
        <Controller
            name="city"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="city">
                  City
                </FieldLabel>
                <Input
                  {...field}
                  id="city"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your city"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        {/* end of city field */}
        {/* start of state field */}
        <Controller
            name="state"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="state">
                  state
                </FieldLabel>
                <Input
                  {...field}
                  id="state"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your state number"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        {/* end of state field */}

        {/* start of zip field */}
        <Controller
            name="zip"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="zip">
                  Zip
                </FieldLabel>
                <Input
                  {...field}
                  id="zip"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your zip code"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        {/* end of zip field */}

        {/* start of country field */}
        <Controller
            name="country"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="country">
                  Country
                </FieldLabel>
                <Input
                  {...field}
                  id="country"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your country"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        {/* end of country field */}

        {/* start of latitude field */}
        <Controller
            name="latitude"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="latitude">
                  Latitude
                </FieldLabel>
                <Input
                  {...field}
                  id="latitude"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your latitude"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        {/* end of latitude field */}

        {/* start of longitude field */}
        <Controller
            name="longitude"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="longitude">
                  Longitude
                </FieldLabel>
                <Input
                  {...field}
                  id="longitude"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your longitude"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        {/* end of longitude field */}
        </FieldGroup>
      </form>
    </CardContent>
    <CardFooter>
      <Field orientation="horizontal" className="w-full flex-center gap-2">
        <Button type="button" variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button type="submit" onClick={() => form.handleSubmit(onSubmit)} form="shipping-address-form" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (<><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>): "Save address"}
        </Button>
      </Field>
    </CardFooter>
  </Card>
  );
}