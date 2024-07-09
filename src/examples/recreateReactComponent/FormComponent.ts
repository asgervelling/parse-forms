"use client";
// Example from the masters themselves:
// https://www.react-hook-form.com/api/useform/control/
// Specifically https://codesandbox.io/s/react-hook-form-v6-controller-ts-jwyzw

import { DefaultValues, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

// Let's say this is the form we are generating code for:
const formJson = JSON.stringify({
  name: "text",
  age: "number",
  signUpForNewsletter: "checkbox",
  email: "email",
});

// Then let's see what code we need to generate:
const FormSchema = z.object({
  name: z.string().min(1),
  age: z.coerce.number().nonnegative().max(122), // Jeanne Calment, the oldest person ever, lived to be 122 years old.
  signUpForNewsletter: z.boolean(),
  email: z.string().email(),
});

type FormValues = z.infer<typeof FormSchema>;

const defaultValues: DefaultValues<FormValues> = {
  signUpForNewsletter: false,
  // The other fields are not really made for having defaults,
  // but we'll leave that decision to the user
};

const onSubmit: SubmitHandler<FormValues> = (data) => {
  console.log(JSON.stringify(data, null, 2));
};
