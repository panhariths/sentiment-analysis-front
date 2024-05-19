"use client";

import { ZodIssue, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getSentiment } from "@/app/api/get-sentiment";
import { useState } from "react";
import { Textarea } from "./ui/textarea";

export const formSchema = z.object({
  text: z.string().min(0).max(200),
});

interface IProps {
  updateResult: Function;
}

export default function FormBox({ updateResult }: IProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [noInputError, setNoInputError] = useState<boolean>(false);
  const [textError, setTextError] = useState<boolean>(false);
  const [serverError, setServerError] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    updateResult(undefined);
    setNoInputError(false);
    setTextError(false);
    setServerError(false);

    if (values.text.length === 0) {
      setNoInputError(true);
      return;
    } else {
      setNoInputError(false);
    }

    // Regular expression to match Khmer alphabets, digits, white space, special characters, and emojis
    const khmerPattern =
      /^(?=.*[\u1780-\u17FF])[\u1780-\u17FF\s\d!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\p{Emoji}]*$/u;

    // Show error message when regex test does not match
    if (!khmerPattern.test(values.text)) {
      setTextError(true);
      return;
    } else {
      setTextError(false);
    }

    // Reset values
    setIsLoading(true);
    updateResult(undefined);

    try {
      // Send request to server
      const response = await getSentiment({ text: values.text });

      // Update values
      if (response) {
        setIsLoading(false);
        updateResult(response.sentiments);
      }
    } catch (err) {
      setServerError(true);
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-regular text-gray-600">Input</FormLabel>
              <FormControl>
                <Textarea
                  className="focus-visible:ring-0"
                  placeholder="Enter your text here"
                  {...field}
                />
              </FormControl>
              {noInputError && (
                <p className="text-sm font-medium text-destructive">Please provide Khmer input</p>
              )}
              {textError && (
                <p className="text-sm font-medium text-destructive">
                  Please enter text in Khmer language only
                </p>
              )}
              {serverError && (
                <p className="text-sm font-medium text-destructive">
                  There was a problem retrieving the sentiment from the model API. Please try again.
                </p>
              )}
            </FormItem>
          )}
        />
        <Button className="bg-indigo-500 hover:bg-indigo-700" type="submit">
          {isLoading && (
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle
                className="opacity-10"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          Submit
        </Button>
      </form>
    </Form>
  );
}
