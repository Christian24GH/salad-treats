import HomeLayout from "@/layout/HomeLayout"
import { ChevronLeft } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Link } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"

import { useForm } from "react-hook-form"
import axios from "../../../bootstrap"
import { toast } from "sonner"
import { useState } from "react"
export default function EditProduct() {
    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm()
    const [preview, setPreview] = useState(null)
    
    const onSubmit = async (data) => {
        try {
            const formData = new FormData()
            formData.append("product_picture", data.product_picture[0])
            formData.append("product_name", data.product_name)
            formData.append("product_description", data.product_description)
            formData.append("production_price", data.production_price)

            // timestamps can be handled by backend, but you can include if required
            formData.append("created_at", new Date().toISOString())
            formData.append("updated_at", new Date().toISOString())

            await axios.post("/owner/menu/store", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })

            toast.success("Product created successfully!")
            reset()
        } catch (error) {
            console.error(error)
            toast.error("Failed to create product.")
        }
    }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
    } else {
      setPreview(null)
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
                <FieldLabel className="text-2xl text-[var(--dark-green)]">Product Picture</FieldLabel>
                <Input
                  type="file"
                  accept="image/*"
                  className="size-16 !text-lg"
                  placeholder="Choose a file"
                  {...register("product_picture", { required: true })}
                  onChange={handleImageChange}
                />
                <FieldDescription className="text-gray-500 text-base mt-2">
                  Upload a clear photo of your product.
                </FieldDescription>

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
                <FieldLabel className={"text-2xl text-[var(--dark-green)]"}>Product Name</FieldLabel>
                <Input type="text" className="size-16 !text-xl" placeholder="Enter product name" {...register("product_name", { required: true })} />
              </Field>

              <Field>
                <FieldLabel  className={"text-2xl text-[var(--dark-green)]"}>Product Description</FieldLabel>
                <Input type="text" className="size-16 !text-xl" placeholder="Enter product description" {...register("product_description", { required: true })} />
              </Field>

              <Field>
                <FieldLabel  className={"text-2xl text-[var(--dark-green)]"}>Product Price</FieldLabel>
                <Input type="number" className="size-16 !text-xl" step="0.01" placeholder="Enter price" {...register("production_price", { required: true })} />
              </Field>
            </FieldGroup>

            <Separator className="my-5" />

            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-[var(--forest-green)] text-white px-6 py-2 rounded-full w-40 h-14"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Create Product"}
              </Button>
            </div>
          </FieldSet>
        </form>
      </div>
    </>
  )
}

EditProduct.layout = page => <HomeLayout children={page} />
