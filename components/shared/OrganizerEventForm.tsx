"use client"
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { IOrganizer } from '@/lib/database/models/organizer.model';

const formSchema = z.object({
  name: z.string().min(1, 'Họ và tên là bắt buộc'),
  phoneNumber: z.string().min(1, 'Số điện thoại là bắt buộc'),
  email: z.string().email('Email không hợp lệ'),
  eventTitle: z.string().min(1, 'Tên sự kiện là bắt buộc'),
  description: z.string().min(1, 'Mô tả là bắt buộc'),
  location: z.string().min(1, 'Địa điểm là bắt buộc'),
  startDateTime: z.date(),
  endDateTime: z.date(),
  eventType: z.string().min(1, 'Hình thức là bắt buộc'),
  price: z.number().min(0, 'Giá không được âm'),
  participantLimit: z.number().min(1, 'Số người tham dự phải lớn hơn 0'),
});

const OrganizerEventForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phoneNumber: '',
      email: '',
      eventTitle: '',
      description: '',
      location: '',
      startDateTime: new Date(),
      endDateTime: new Date(),
      eventType: '',
      price: 0,
      participantLimit: 1,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch('/api/createOrganizerEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Event created:', data);
        alert('Sự kiện đã được gửi và đang chờ duyệt');
        form.reset();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create event');
      }
    } catch (error) {
      console.error('Error submitting event:', error);
      alert('Có lỗi xảy ra khi gửi sự kiện: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ và tên</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="eventTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên sự kiện</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa điểm</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startDateTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thời gian bắt đầu</FormLabel>
              <FormControl>
                <DatePicker
                  selected={field.value}
                  onChange={(date: Date) => field.onChange(date)}
                  showTimeSelect
                  dateFormat="Pp"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDateTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thời gian kết thúc</FormLabel>
              <FormControl>
                <DatePicker
                  selected={field.value}
                  onChange={(date: Date) => field.onChange(date)}
                  showTimeSelect
                  dateFormat="Pp"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="eventType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hình thức</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá vé (VND)</FormLabel>
              <FormControl>
                <Input {...field} type="number" onChange={e => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="participantLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số người tham dự</FormLabel>
              <FormControl>
                <Input {...field} type="number" onChange={e => field.onChange(parseInt(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Gửi</Button>
      </form>
    </Form>
  );
};

export default OrganizerEventForm;
