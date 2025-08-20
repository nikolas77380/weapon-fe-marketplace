import { quickFilters } from "@/data/leftFilters";
import { SlidersHorizontal } from "lucide-react";
import React from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const LeftFilters = () => {
  return (
    <div className="border border-[#D3D3D3] rounded-lg pl-10 pr-6 pt-5.5 flex flex-col gap-5.5">
      <div className="flex items-center gap-2">
        <SlidersHorizontal size={20} className="text-black" />
        <h2 className="text-sm font-medium font-roboto">Filters</h2>
      </div>

      <div className="flex flex-col border-b border-[#D3D3D3] pb-3.5">
        <h2 className="text-sm font-medium font-roboto">Quick filters</h2>
        <div className="flex flex-col gap-2 mt-3">
          {quickFilters.map((filter) => (
            <div key={filter.id} className="flex items-center gap-3">
              <Checkbox id="filter" />
              <Label htmlFor="filter" className="text-[#1E1E1E]/80">
                {filter.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="border-b border-[#D3D3D3] pb-9">
        <h2 className="text-sm font-medium font-roboto">Category</h2>
        <div className="mt-3">
          <Select>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple">Armor</SelectItem>
                <SelectItem value="banana">Weapon</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-b border-[#D3D3D3] pb-9">
        <h2 className="text-sm font-medium font-roboto">Condition</h2>
        <div className="mt-3">
          <Select>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="All Conditions" />
            </SelectTrigger>
          </Select>
        </div>
        <h2 className="text-sm font-medium font-roboto mt-6.5">Availability</h2>
        <div className="mt-3">
          <Select>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="All Availability" />
            </SelectTrigger>
          </Select>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-medium font-roboto">Price range</h2>
        <div className="mt-3">
          <Select>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="All Prices" />
            </SelectTrigger>
          </Select>
        </div>
        <h2 className="text-sm font-medium font-roboto mt-6.5">Location</h2>
        <div className="mt-3">
          <Select>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default LeftFilters;
