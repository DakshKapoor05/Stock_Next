"use client";

import { useState } from "react";
import { Controller } from "react-hook-form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { Label } from "@/components/ui/label";

import { Check, ChevronsUpDown } from "lucide-react";

import countryList from "react-select-country-list";

const CountrySelect = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const countries = countryList().getData();

  const getFlagImage = (countryCode) => (
    <img
      src={`https://flagcdn.com/20x15/${countryCode.toLowerCase()}.png`}
      width={20}
      height={15}
      alt={countryCode}
      style={{ display: "inline-block" }}
    />
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        role="combobox"
        aria-expanded={open}
        className="country-select-trigger w-full justify-between inline-flex items-center rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {value ? (
          <span className="flex items-center gap-2">
            {getFlagImage(value)}
            <span>{countries.find((c) => c.value === value)?.label}</span>
          </span>
        ) : (
          "Select your country..."
        )}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>

      <PopoverContent
        className="w-full p-0 bg-gray-800 border-gray-600"
        align="start"
      >
        <Command className="bg-gray-800 border-gray-600">
          <CommandInput
            placeholder="Search countries..."
            className="country-select-input"
          />
          <CommandEmpty className="country-select-empty">
            No country found.
          </CommandEmpty>
          <CommandList className="max-h-60 bg-gray-800 scrollbar-hide-default">
            <CommandGroup className="bg-gray-800">
              {countries.map((country) => (
                <CommandItem
                  key={country.value}
                  value={`${country.label} ${country.value}`}
                  onSelect={() => {
                    onChange(country.value);
                    setOpen(false);
                  }}
                  className="country-select-item"
                >
                  <Check
                    className={`mr-2 h-4 w-4 text-yellow-500 ${
                      value === country.value ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <span className="flex items-center gap-2">
                    {getFlagImage(country.value)}
                    <span>{country.label}</span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export const CountrySelectField = ({
  name,
  label,
  control,
  error,
  required = false,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>

      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `Please select ${label.toLowerCase()}` : false,
        }}
        render={({ field }) => (
          <CountrySelect value={field.value} onChange={field.onChange} />
        )}
      />

      {error && <p className="text-sm text-red-500">{error.message}</p>}

      <p className="text-xs text-gray-500">
        Helps us show market data and news relevant to you.
      </p>
    </div>
  );
};

export default CountrySelectField;
