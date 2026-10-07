import { z } from "zod";

export const reviewSchema = z.object({
  author: z.string().min(1),
  quote: z.string().min(1),
  date: z.string().optional(),
});

export const locationSchema = z
  .object({
    slug: z.string().min(1),
    name: z.string().min(1),
    address: z.string(),
    phone: z.string(),
    hours: z.array(z.object({ days: z.string(), time: z.string() })),
    orderUrl: z.string(),
    comingSoon: z.boolean(),
    reviews: z.array(reviewSchema),
    intro: z.string().optional(),
    closing: z.string().optional(),
  })
  .refine((loc) => loc.comingSoon || loc.address.length > 0, {
    message: "Open locations must have an address",
    path: ["address"],
  });

export const menuItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive().nullable(),
  tags: z.array(z.enum(["vegetarian", "seafood", "spicy", "kids"])),
  needsCopyReview: z.boolean(),
});

export const menuCategorySchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  items: z.array(menuItemSchema).min(1),
});

export const inquiryTypeSchema = z.enum(["general", "catering", "event", "notify-ofallon"]);

export const inquirySchema = z.object({
  type: inquiryTypeSchema,
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  location: z.string().optional(),
  message: z.string().min(1, "Message is required"),
  eventDate: z.string().optional(),
  guestCount: z.coerce.number().int().positive().optional(),
});

export type Location = z.infer<typeof locationSchema>;
export type MenuCategory = z.infer<typeof menuCategorySchema>;
export type MenuItem = z.infer<typeof menuItemSchema>;
export type Inquiry = z.infer<typeof inquirySchema>;
export type InquiryType = z.infer<typeof inquiryTypeSchema>;
