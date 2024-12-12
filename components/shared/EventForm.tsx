"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { eventFormSchema } from "@/lib/validator"
import * as z from 'zod'
import { eventDefaultValues } from "@/constants"
import Dropdown from "./Dropdown"
import { Textarea } from "@/components/ui/textarea"
import { FileUploader } from "./FileUploader"
import { useState, useEffect } from "react"
import Image from "next/image"
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { Checkbox } from "../ui/checkbox"
import { useRouter } from "next/navigation"
import { createEvent, updateEvent } from "@/lib/actions/event.actions"
import { IEvent } from "@/lib/database/models/event.model"
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { IOrganizer } from "@/types/organizer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

// Khai báo ReactQuill
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Please wait for loading…</p>,
});

type EventFormProps = {
  userId: string
  type: "Create" | "Update"
  event?: IEvent,
  eventId?: string
  eventsOrganizer?: IOrganizer[]
}

const EventForm = ({ userId, type, event, eventId, eventsOrganizer = [] }: EventFormProps) => {
  const [eventSelected, setEventSelected] = useState<IOrganizer | null>(null);
  const [files, setFiles] = useState<File[]>([])
  const initialValues = event && type === 'Update' 
    ? { 
      ...event, 
      startDateTime: new Date(event.startDateTime), 
      endDateTime: new Date(event.endDateTime) 
    }
    : eventDefaultValues;
  const router = useRouter();

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      ...initialValues,
      categoryId: event?.category?._id || '',
      eventOrganizerId: event?.eventOrganizerId || '',
      imageUrl: event?.imageUrl || '',
    }
  })
 
  const onSubmit = async (values: z.infer<typeof eventFormSchema>) => {
    let uploadedImageUrl = values.imageUrl;

    if (!uploadedImageUrl && !files.length) {
      form.setError('imageUrl', {
        type: 'manual',
        message: 'Vui lòng chọn hình ảnh cho sự kiện'
      });
      return;
    }
  
    if(!values.eventOrganizerId) {
      form.setError('eventOrganizerId', {
        type: 'manual',
        message: 'Vui lòng chọn sự kiện'
      });
      return
    }

    if(!values.categoryId) {
      form.setError('categoryId', {
        type: 'manual',
        message: 'Vui lòng chọn danh mục'
      });
      return
    }


    if (files.length > 0) {
      const formData = new FormData();
      formData.append('file', files[0]);
      formData.append('fileType', 'image');

      try {
        const response = await fetch('/api/s3-storage', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload ảnh thất bại');
        }

        const data = await response.json();
        uploadedImageUrl = data.fileUrl;
      } catch (error) {
        console.error('Lỗi khi upload ảnh:', error);
        return;
      }
    }

    if (type === 'Create') {
      try {
        const newEvent = await createEvent({
          event: { 
            ...values, 
            eventOrganizerId: eventSelected?._id || values.eventOrganizerId,
            imageUrl: uploadedImageUrl,
            categoryId: values.categoryId 
          },
          userId,
          path: '/profile'
        })

        if (newEvent) {
          form.reset();
          router.push(`/events/${newEvent._id}`)
        }
      } catch (error) {
        console.log("Lỗi khi tạo sự kiện:", error);
      }
    }

    if (type === 'Update') {
      if (!eventId) {
        router.back()
        return;
      }

      try {
        const updatedEvent = await updateEvent({
          userId,
          event: { 
            ...values, 
            eventOrganizerId: eventSelected?._id || values.eventOrganizerId,
            _id: eventId, 
            imageUrl: uploadedImageUrl,
            categoryId: values.categoryId
          },
          path: `/events/${eventId}`
        })

        if (updatedEvent) {
          form.reset();
          router.push(`/events/${updatedEvent._id}`)
        }
      } catch (error) {
        console.log("Lỗi khi cập nhật sự kiện:", error);
      }
    }
  }

  const handleChangeEventOrganizer = (value: string) => {
    const event = eventsOrganizer.find(event => event._id === value);
    setEventSelected(event || null);

    form.setValue('eventOrganizerId', value);
    form.setValue('title', event?.eventTitle || '');
    form.setValue('description', event?.description || '');
    form.setValue('location', event?.location || '');
    form.setValue('startDateTime', new Date(event?.startDateTime || ''));
    form.setValue('endDateTime', new Date(event?.endDateTime || ''));
    form.setValue('price', (event?.expectedTicketPrice || 0).toString());
    form.setValue('participantLimit', event?.participantLimit || 0);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex items-center flex-col gap-5 md:flex-row">
        {
          eventsOrganizer.length > 0 && (
            <Select value={eventSelected?._id} onValueChange={handleChangeEventOrganizer}>
          <SelectTrigger className="max-w-xs">
            <SelectValue placeholder="Chọn sự kiện" />
          </SelectTrigger>
          <SelectContent>
            {eventsOrganizer.map((event) => (
              <SelectItem key={event._id} value={event._id}>
                {event.eventTitle}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
          )
        }
        <FormField
            control={form.control}
            defaultValue={eventSelected?._id}
            name="eventOrganizerId"
            render={({ field }) => (
              <Input type="hidden" {...field} value={eventSelected?._id} />
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input placeholder="Tên sự kiện" {...field} className="input-field" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Dropdown onChangeHandler={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl className="h-72">
                    <ReactQuill 
                      value={field.value} 
                      onChange={(value) => form.setValue('description', value)} 
                      placeholder="Mô tả"                
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl className="h-72">
                    <FileUploader 
                      onImageChange={(value) => form.setValue('imageUrl', value)}
                      onDocumentChange={(value) => form.setValue('url', value)}
                      imageUrl={form.watch('imageUrl')}
                      documentUrl={form.watch('url')}
                      setFiles={setFiles}
                      eventId={eventId || 'new'} // Thêm prop eventId
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <div></div>
        <div></div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                      <Image
                        src="/assets/icons/location-grey.svg"
                        alt="calendar"
                        width={24}
                        height={24}
                      />

                      <Input placeholder="Địa điểm hoặc trực tuyến" {...field} className="input-field" />
                    </div>

                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
              control={form.control}
              name="startDateTime"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                      <Image
                        src="/assets/icons/calendar.svg"
                        alt="calendar"
                        width={24}
                        height={24}
                        className="filter-grey"
                      />
                      <p className="ml-3 whitespace-nowrap text-grey-600">Ngày bắt đầu:</p>
                      <DatePicker 
                        selected={field.value} 
                        onChange={(date: Date) => {
                          const today = new Date();
                          if (date < today) {
                            alert("Ngày bắt đầu không được nhỏ hơn ngày hiện tại.");
                            return;
                          }
                          field.onChange(date);
                        }} 
                        showTimeSelect
                        timeInputLabel="Time:"
                        dateFormat="dd/MM/yyyy h:mm aa"
                        wrapperClassName="datePicker"
                      />
                    </div>

                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        
          <FormField
              control={form.control}
              name="endDateTime"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                      <Image
                        src="/assets/icons/calendar.svg"
                        alt="calendar"
                        width={24}
                        height={24}
                        className="filter-grey"
                      />
                      <p className="ml-3 whitespace-nowrap text-grey-600">Ngày kết thúc:</p>
                      <DatePicker 
                        selected={field.value} 
                        onChange={(date: Date) => {
                          const startDate = form.getValues("startDateTime");
                          if (date < new Date(startDate)) {
                            alert("Ngày kết thúc không được nhỏ hơn ngày bắt đầu.");
                            return;
                          }
                          field.onChange(date);
                        }} 
                        showTimeSelect
                        timeInputLabel="Time:"
                        dateFormat="dd/MM/yyyy h:mm aa"
                        wrapperClassName="datePicker"
                      />
                    </div>

                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                      <Image
                        src="/assets/icons/dollar.svg"
                        alt="dollar"
                        width={24}
                        height={24}
                        className="filter-grey"
                      />
                      <Input type="number" placeholder="Giá" {...field} className="p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
                      <FormField
                        control={form.control}
                        name="isFree"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center">
                                <label htmlFor="isFree" className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Miễn phí</label>
                                <Checkbox
                                  onCheckedChange={field.onChange}
                                  checked={field.value}
                                id="isFree" className="mr-2 h-5 w-5 border-2 border-primary-500" />
                              </div>
          
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />   
                    </div>

                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />   
           <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                      <Image
                        src="/assets/icons/link.svg"
                        alt="link"
                        width={24}
                        height={24}
                      />

                      <Input placeholder="URL" {...field} className="input-field" readOnly/>
                    </div>

                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="participantLimit"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/user.svg"
                      alt="user"
                      width={24}
                      height={24}
                      // className="filter-grey"
                    />
                    <Input 
                      type="number" 
                      placeholder="Số lượng người tham gia" 
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="button col-span-2 w-full"
        >
          {form.formState.isSubmitting ? (
            'Đang xử lý...'
          ): type === 'Create' ? 'Thêm sự kiện' : 'Cập nhật sự kiện'}
        </Button>
      </form>
    </Form>
  )
}

export default EventForm