"use client";
import { DefaultValues, SubmitHandler } from "react-hook-form";
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

const onSubmit: SubmitHandler<FormValues> = (values) => {
  console.log(`{
    name:                 ${values.name}
    age:                  ${values.age}  
    signUpForNewsletter:  ${values.signUpForNewsletter}
    email:                ${values.email}
  }`);
};

type Props = {
  defaultValues: DefaultValues<FormValues>;
};
