import React, { useState } from 'react'
import { DateRange } from 'react-day-picker';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format, addDays } from 'date-fns';
import { FaCalendarAlt } from 'react-icons/fa';

const TableDatePicker = ({ onChangeFrom, onChangeTo, selectedDate, setSelectedDate }: { onChangeFrom: (value: string) => void, onChangeTo: (value: string) => void, selectedDate: DateRange | null, setSelectedDate: React.Dispatch<React.SetStateAction<DateRange | null>> }) => {
    return (
        <div className="flex w-full md:w-auto col-span-2 flex-col gap-2">

            <Popover >
                <PopoverTrigger asChild>
                    <Button
                        style={{
                            height: "2rem"
                        }}
                        variant="outline"
                        className="w-full md:w-[220px] h-12 overflow-hidden text-[15px] bg-field text-foreground justify-start text-start font-normal px-4"
                    >
                        <FaCalendarAlt className="mr-2 " />
                        {selectedDate?.from
                            ? `${format(selectedDate.from, "PPP")} ${selectedDate.to
                                ? `- ${format(selectedDate.to, "PPP")}`
                                : ""
                            }`
                            : "Date Range"}
                    </Button>
                </PopoverTrigger>

                <PopoverContent side="bottom" className="w-auto p-0" align="start">
                    <Calendar
                        captionLayout="dropdown"
                        mode="range"
                        selected={selectedDate as DateRange}
                        numberOfMonths={2}
                        onSelect={(date) => {
                            setSelectedDate(date as DateRange);

                            if (date?.from) {
                                onChangeFrom(addDays(date.from, 1).toISOString().split("T")[0]);
                            }

                            if (date?.to) {
                                onChangeTo(addDays(date.to, 1).toISOString().split("T")[0]);
                            }
                        }}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default TableDatePicker