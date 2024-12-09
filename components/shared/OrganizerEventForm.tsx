"use client"
import React, { useEffect, useState } from 'react';
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
import { getOrganizerEvents } from '@/lib/actions/organizer.actions';
import toast from 'react-hot-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Toaster } from 'react-hot-toast';

const formSchema = z.object({
  name: z.string().min(1, 'Họ và tên là bắt buộc'),
  email: z.string().email('Email không hợp lệ'),
  phoneNumber: z.string().min(1, 'Số điện thoại là bắt buộc'),
  eventTitle: z.string().min(1, 'Tên sự kiện là bắt buộc'),
  description: z.string().min(1, 'Mô tả là bắt buộc'),
  location: z.string().min(1, 'Địa điểm là bắt buộc'),
  startDateTime: z.date().refine(
    (date) => date >= new Date(),
    'Thời gian bắt đầu không được nhỏ hơn thời gian hiện tại'
  ),
  endDateTime: z.date(),
  eventType: z.string().min(1, 'Hình thức là bắt buộc'),
  price: z.number().min(0, 'Giá không được âm'),
  participantLimit: z.number().min(1, 'Số người tham dự phải lớn hơn 0'),
});

interface OrganizerEventFormProps {
  setOrganizers: React.Dispatch<React.SetStateAction<IOrganizer[]>>;
  userData: {
    name: string;
    email: string;
  };
}

const OrganizerEventForm: React.FC<OrganizerEventFormProps> = ({ setOrganizers, userData }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
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

  useEffect(() => {
    form.setValue('name', userData.name);
    form.setValue('email', userData.email);
  }, [userData, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch('/api/organizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Lỗi khi gửi form');
      }

      setOrganizers(prev => [...prev, responseData]);
      form.reset();
      
      toast.success('Đăng ký tổ chức sự kiện thành công! Phiếu đang ở trạng thái chờ duyệt.', {
        duration: 5000,
        position: 'top-center',
        icon: '🎉',
        style: {
          background: '#4CAF50',
          color: '#fff',
        },
      });

    } catch (error) {
      console.error('Lỗi:', error);
      toast.error('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.', {
        duration: 3000,
        position: 'top-center',
      });
    }
  };

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedOrganizerId, setSelectedOrganizerId] = useState<string | null>(null);

  const onCancel = async (organizerId: string) => {
    try {
      const response = await fetch('/api/cancelOrganizer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: organizerId }),
      });

      if (!response.ok) {
        throw new Error('Lỗi khi hủy đăng ký');
      }

      const updatedOrganizer = await response.json();
      setOrganizers(prev => prev.map(org => 
        org._id === organizerId ? { ...org, status: 'cancelled' } : org
      ));
      
      toast.success('Hủy đăng ký thành công');
    } catch (error) {
      console.error('Lỗi:', error);
      toast.error('Có lỗi xảy ra khi hủy đăng ký. Vui lòng thử lại sau.');
    }
  };

  const handleCancelClick = (organizerId: string) => {
    setSelectedOrganizerId(organizerId);
    setShowCancelDialog(true);
  };

  return (
    <>
      <Toaster />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ và tên</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
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
                  <Input {...field} type="email" disabled />
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
                    minDate={new Date()}
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
                    minDate={field.value}
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
                <FormLabel>Giá vé ($)</FormLabel>
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
        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận hủy đăng ký</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn hủy đăng ký tổ chức sự kiện này không?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowCancelDialog(false)}>Không</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (selectedOrganizerId) {
                    onCancel(selectedOrganizerId);
                    setShowCancelDialog(false);
                  }
                }}
              >
                Xác nhận
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Form>
    </>
  );
};

export default OrganizerEventForm;
