import HomeLayout from "@/layout/HomeLayout"
import { ChevronLeft } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Link, router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldError,
} from "@/components/ui/field"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useForm, Controller } from "react-hook-form"
import axios from "../../../bootstrap"
import { toast } from "sonner"
import { useState, useEffect } from "react"

export default function EditProduct({ product }) {
  const { register, handleSubmit, control, setValue, formState: { isSubmitting, errors } } = useForm()
  const [preview, setPreview] = useState(null)

  // Set default values
  useEffect(() => {
    if (product) {
      setValue("product_name", product.product_name)
      setValue("product_description", product.description)
      setValue("product_price", product.price)
      setValue("product_type", product.type)
      setPreview(product.image_url) // show existing image
    }
  }, [product, setValue])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
    } else {
      setPreview(product.image_url)
    }
  }

  const onSubmit = async (data) => {
    try {
      const formData = new FormData()
      formData.append("product_name", data.product_name)
      formData.append("product_description", data.product_description)
      formData.append("product_price", data.product_price)
      formData.append("product_type", data.product_type)

      if (data.product_picture?.[0]) {
        formData.append("product_picture", data.product_picture[0])
      }

      await axios.post(`/owner/menu/update/${product.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      toast.success("Product updated successfully!")
      router.visit("/owner/menu")
    } catch (error) {
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (errors) {
          
          Object.values(errors).forEach((messages) => {
            toast.error(messages[0]);
          });
        } else {
          toast.error("Validation failed. Please check your inputs.");
        }
      } 
      
      else if (error.response?.status >= 500) {
        toast.error("Server error occurred. Please try again later.");
      } 
      
      else {
        toast.error("Failed to update product.");
      }
    }
  }

  return (
    <>
      <div className="py-5 text-3xl lato-bold-italic text-[var(--dark-green)] flex items-center">
        <Link href={"/owner/menu"}>
          <ChevronLeft className="mr-5 h-full" />
        </Link>
        <span>Edit Product</span>
      </div>

      <div className="py-5 text-xl text-[var(--dark-green)] flex flex-col items-center w-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-xl border-[var(--dark-green)] rounded-xl p-6 bg-white shadow-md"
          encType="multipart/form-data"
        >
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel className="text-2xl text-[var(--dark-green)]">
                  Product Picture
                </FieldLabel>
                <Input
                  type="file"
                  accept="image/*"
                  disabled={isSubmitting}
                  className="size-16 !text-lg"
                  {...register("product_picture")}
                  onChange={handleImageChange}
                />
                <FieldDescription className="text-gray-500 text-base mt-2">
                  Upload a clear photo of your product.
                </FieldDescription>
                {errors.product_picture && (<FieldError>{errors.product_picture}</FieldError>)}

                {/* Image Preview */}
                {preview && (
                  <div className="mt-5 flex justify-center">
                    <img
                      src={preview}
                      alt="Product Preview"
                      className="max-h-64 rounded-2xl shadow-md border border-gray-200 object-cover"
                    />
                  </div>
                )}
              </Field>

              <Separator className="my-3" />

              <Field>
                <FieldLabel className="text-2xl text-[var(--dark-green)]">
                  Product Name
                </FieldLabel>
                <Input
                  type="text"
                  disabled={isSubmitting}
                  className="size-16 !text-xl"
                  placeholder="Enter product name"
                  {...register("product_name", { required: true })}
                />
                {errors.product_name && (<FieldError>{errors.product_name}</FieldError>)}
              </Field>

              <Field>
                <FieldLabel className="text-2xl text-[var(--dark-green)]">
                  Product Description
                </FieldLabel>
                <Input
                  type="text"
                  disabled={isSubmitting}
                  className="size-16 !text-xl"
                  placeholder="Enter product description"
                  {...register("product_description", { required: true })}
                />
                {errors.product_description && (<FieldError>{errors.product_description}</FieldError>)}
              </Field>

              <Field>
                <FieldLabel className="text-2xl text-[var(--dark-green)]">
                  Product Price
                </FieldLabel>
                <Input
                  type="number"
                  step="0.01"
                  className="size-16 !text-xl"
                  disabled={isSubmitting}
                  placeholder="Enter price"
                  {...register("product_price", { required: true })}
                />
                {errors.product_price && (<FieldError>{errors.product_price}</FieldError>)}
              </Field>

              <Field>
                  <FieldLabel  className={"text-2xl text-[var(--dark-green)]"}>Type</FieldLabel>
                  <Controller
                      name="product_type"
                      control={control}
                      defaultValue={product.type || ""}
                      rules={{ required: true }}
                      render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="w-full !h-16 !text-xl">
                                  <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                  <SelectItem className={"!h-16 !text-xl"} value="Salad">Salad</SelectItem>
                                  <SelectItem className={"!h-16 !text-xl"} value="Rolls">Rolls</SelectItem>
                                  <SelectItem className={"!h-16 !text-xl"} value="Platter">Platter</SelectItem>
                                  <SelectItem className={"!h-16 !text-xl"} value="Extras">Extras</SelectItem>
                              </SelectContent>
                          </Select>
                      )}
                  />
                </Field>
                {errors.product_type && (<FieldError>{errors.product_type}</FieldError>)}
            </FieldGroup>

            <Separator className="my-5" />

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-[var(--forest-green)] text-white px-6 py-2 rounded-full w-40 h-14"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </FieldSet>
        </form>
      </div>
    </>
  )
}

EditProduct.layout = page => <HomeLayout children={page} />
