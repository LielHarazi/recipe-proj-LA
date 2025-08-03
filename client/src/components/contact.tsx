import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { contactSchema, type ContactFormData } from "@/lib/schemas";
import { contactAPI } from "@/lib/api";

export default function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const contactMutation = useMutation({
    mutationFn: contactAPI.sendMessage,
    onSuccess: () => {
      reset();
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await contactMutation.mutateAsync(data);
    } catch (error) {
      console.error("Contact form error:", error);
    }
  };

  return (
    <div>
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Contact Our Chefs</CardTitle>
          <CardDescription>
            We'd love to hear from you! Share your cooking questions, recipe
            requests, or feedback with our culinary team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {contactMutation.isSuccess ? (
            <div className="text-green-600 font-medium text-center py-8">
              Thank you for your message! Our chefs will get back to you with
              delicious insights soon.
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name *
                </label>
                <Input
                  {...register("name")}
                  id="name"
                  placeholder="Your name"
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email *
                </label>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message *
                </label>
                <textarea
                  {...register("message")}
                  id="message"
                  rows={4}
                  placeholder="Ask about recipes, cooking techniques, dietary restrictions, or anything culinary!"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.message.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={contactMutation.isPending}
              >
                {contactMutation.isPending
                  ? "Sending..."
                  : "Send Message to Chefs"}
              </Button>
              {contactMutation.isError && (
                <p className="text-red-600 mt-2 text-center">
                  Failed to send message. Please try again.
                </p>
              )}
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2">
          <span className="text-xs text-gray-400">
            L&A Recipe &copy; {new Date().getFullYear()}
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
