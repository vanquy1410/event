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
import { IOrganizerData } from '@/lib/database/models/organizer.model';
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
import { 
  EVENT_SCALES, 
  type EventScale, 
  type VenueType,
  calculateEstimatedRevenue 
} from '@/constants/event-scales';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  eventScale: z.string().min(1, 'Vui lòng chọn quy mô sự ki���n'),
  venueType: z.string().min(1, 'Vui lòng chọn loại địa điểm'),
  venue: z.string().min(1, 'Vui lòng chọn địa điểm tổ chức'),
  expectedTicketPrice: z.number().min(0, 'Giá vé không được âm'),
  expectedRevenue: z.number().min(0, 'Doanh thu dự kiến không được âm'),
});

type FormValues = z.infer<typeof formSchema>;

interface OrganizerEventFormProps {
  setOrganizers: React.Dispatch<React.SetStateAction<IOrganizerData[]>>;
  userData: {
    name: string;
    email: string;
  };
}

const OrganizerEventForm: React.FC<OrganizerEventFormProps> = ({ setOrganizers, userData }) => {
  const form = useForm<FormValues>({
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
      eventScale: '',
      venueType: '',
      venue: '',
      expectedTicketPrice: 0,
      expectedRevenue: 0,
    },
  });

  useEffect(() => {
    form.setValue('name', userData.name);
    form.setValue('email', userData.email);
  }, [userData, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // Lấy thông tin venue được chọn
      const selectedVenue = selectedScale?.venues[data.venueType as keyof typeof selectedScale.venues]
        .find(v => v.name === data.venue);

      // Tính toán số người tham dự dự kiến
      const expectedAttendees = Math.floor(
        Math.min(
          selectedScale?.capacity || 0,
          selectedVenue?.capacity || 0
        ) * (selectedScale?.expectedRevenue.occupancyRate || 0)
      );

      const formData = {
        ...data,
        expectedRevenue: estimatedRevenue,
        expectedTicketPrice: Number(data.expectedTicketPrice),
        participantLimit: expectedAttendees, // Sử dụng số người dự kiến đã tính
        price: selectedVenue?.pricePerDay || 0,
        scaleDetails: {
          capacity: selectedScale?.capacity || 0,
          basePrice: selectedScale?.basePrice || 0,
          venues: {
            name: selectedVenue?.name,
            capacity: selectedVenue?.capacity,
            pricePerDay: selectedVenue?.pricePerDay,
            rating: selectedVenue?.rating,
            facilities: selectedVenue?.facilities
          }
        }
      };

      console.log('Sending data:', formData);
      // Gửi request
      const response = await fetch('/api/organizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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

  const [selectedScale, setSelectedScale] = useState(EVENT_SCALES[0]);
  const [estimatedRevenue, setEstimatedRevenue] = useState(0);
  const [ticketPrice, setTicketPrice] = useState<number>(0);

  const calculateEstimatedRevenue = (
    scale: EventScale,
    venue: VenueType,
    ticketPrice: number
  ): number => {
    const expectedAttendees = Math.min(scale.capacity, venue.capacity) * scale.expectedRevenue.occupancyRate;
    const totalRevenue = expectedAttendees * ticketPrice;
    const venueCost = venue.pricePerDay;
    const organizationCost = scale.basePrice;
    
    return totalRevenue - venueCost - organizationCost;
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
         
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startDateTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời gian bắt đầu</FormLabel>
                  <FormControl>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date) => {
                        field.onChange(date);
                        // Tự động cập nhật endDateTime nếu nhỏ hơn startDateTime
                        const currentEnd = form.getValues('endDateTime');
                        if (currentEnd < date) {
                          form.setValue('endDateTime', date);
                        }
                      }}
                      showTimeSelect
                      dateFormat="dd/MM/yyyy, h:mm aa"
                      minDate={new Date()}
                      className="w-full"
                      placeholderText="Chọn thời gian bắt đầu"
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
                      dateFormat="dd/MM/yyyy, h:mm aa"
                      minDate={form.getValues('startDateTime')}
                      className="w-full"
                      placeholderText="Chọn thời gian kết thúc"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="eventType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hình thức</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn hình thức sự kiện" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem 
                      value="offline" 
                      className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                    >
                      Trực tiếp (Offline)
                    </SelectItem>
                    <SelectItem 
                      value="online" 
                      className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                    >
                      Trực tuyến (Online)
                    </SelectItem>
  
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eventScale"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Quy mô sự kiện</FormLabel>
                <Select
                  onValueChange={(value) => {
                    const scale = EVENT_SCALES.find(s => s.id === value);
                    if (scale) {
                      setSelectedScale(scale);
                      field.onChange(value);
                      // Reset venue selection when scale changes
                      form.setValue('venue', '');
                    }
                  }}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn quy mô sự kiện" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_SCALES.map((scale) => (
                      <SelectItem key={scale.id} value={scale.id}>
                        {scale.name} - Tối đa {scale.capacity} người - Chi phí: {scale.basePrice.toLocaleString()}đ
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {selectedScale && (
            <FormField
              control={form.control}
              name="venueType"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Loại địa điểm</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue('venue', '');
                    }}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại địa điểm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem 
                        value="hotels" 
                        className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                      >
                        Khách sạn
                      </SelectItem>
                      <SelectItem 
                        value="conference" 
                        className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                      >
                        Hội nghị
                      </SelectItem>
                      <SelectItem 
                        value="outdoor" 
                        className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                      >
                        Ngoài trời
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {selectedScale && form.watch('venueType') && (
            <FormField
              control={form.control}
              name="venue"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Địa điểm cụ thể</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      const venueType = selectedScale.venues[form.watch('venueType') as keyof typeof selectedScale.venues]
                        .find(v => v.name === value);
                      if (venueType) {
                        const estimatedRevenue = calculateEstimatedRevenue(
                          selectedScale,
                          venueType,
                          selectedScale.expectedRevenue.minTicketPrice
                        );
                        form.setValue('expectedRevenue', estimatedRevenue);
                        setEstimatedRevenue(estimatedRevenue);
                      }
                    }}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn địa điểm" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedScale?.venues[form.watch('venueType') as keyof typeof selectedScale.venues]?.map((venue) => (
                        <SelectItem 
                          key={venue.name} 
                          value={venue.name}
                          className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                        >
                          {venue.name} - Sức chứa: {venue.capacity} - Giá: {venue.pricePerDay.toLocaleString()}đ/ngày
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
           <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa điểm khu vực tổ chức sự kiện</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="expectedTicketPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá vé dự kiến (VNĐ)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => {
                        const price = Number(e.target.value);
                        field.onChange(price);
                        setTicketPrice(price);
                        
                        // Tính toán lại doanh thu khi giá vé thay đổi
                        if (selectedScale && form.watch('venue')) {
                          const venueType = selectedScale.venues[form.watch('venueType') as keyof typeof selectedScale.venues]
                            .find(v => v.name === form.watch('venue'));
                          if (venueType) {
                            const estimatedRevenue = calculateEstimatedRevenue(
                              selectedScale,
                              venueType,
                              price
                            );
                            form.setValue('expectedRevenue', estimatedRevenue);
                            setEstimatedRevenue(estimatedRevenue);
                          }
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <p className="text-sm font-medium mb-2">Doanh thu dự kiến</p>
              <p className="p-2 bg-gray-100 rounded">
                {estimatedRevenue.toLocaleString()}đ
              </p>
            </div>
          </div>
          {selectedScale && form.watch('venue') && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Thông tin chi tiết:</h3>
              <div className="space-y-2">
                <p>Quy mô tối đa: {selectedScale.capacity} người</p>
                <p>Chi phí tổ chức cơ bản: {selectedScale.basePrice.toLocaleString()}đ</p>
                <p>Chi phí địa điểm: {selectedScale.venues[form.watch('venueType') as keyof typeof selectedScale.venues]
                  .find(v => v.name === form.watch('venue'))?.pricePerDay.toLocaleString()}đ/ngày</p>
                <p>Số người tham dự dự kiến: {Math.floor(
                  Math.min(selectedScale.capacity, 
                    selectedScale.venues[form.watch('venueType') as keyof typeof selectedScale.venues]
                      .find(v => v.name === form.watch('venue'))?.capacity || 0
                  ) * selectedScale.expectedRevenue.occupancyRate
                )} người</p>
                <p>Giá vé đề xuất: {selectedScale.expectedRevenue.minTicketPrice.toLocaleString()}đ - {selectedScale.expectedRevenue.maxTicketPrice.toLocaleString()}đ</p>
                <p className="font-semibold text-lg">Doanh thu dự kiến: {estimatedRevenue.toLocaleString()}đ</p>
              </div>
            </div>
          )}
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
