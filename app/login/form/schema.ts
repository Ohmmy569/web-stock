import z from 'zod';

export const loginSchema = z.object({
  username: z.string().nonempty({ message: 'กรุณากรอกชื่อผู้ใช้งาน' }),
  password: z
    .string()
    .nonempty({ message: 'กรุณากรอกรหัสผ่าน' })
    .min(6, { message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
