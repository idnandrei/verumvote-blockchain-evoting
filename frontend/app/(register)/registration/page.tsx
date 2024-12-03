"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function RegistrationForm() {
  const { toast } = useToast();
  const [blindAddress, setBlindAddress] = useState("");
  const [blindAddressInput, setBlindAddressInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });

  const handleBlindAddressGeneration = async () => {
    if (!blindAddressInput) {
      toast({
        title: "Error",
        description: "Please enter a wallet address",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/blind-address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: blindAddressInput }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate blind address");
      }

      setBlindAddress(data.blindedAddress);
      toast({
        title: "Success",
        description: "Blind address generated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", { blindAddress, ...formData });
    // Here you would typically send the data to your backend
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Registration Form</h1>

      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <div className="flex gap-2 mb-2">
          <Input
            type="text"
            value={blindAddressInput}
            onChange={(e) => setBlindAddressInput(e.target.value)}
            placeholder="Enter address for blind generation"
            className="flex-grow"
          />
          <Button
            onClick={handleBlindAddressGeneration}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Blind Address"}
          </Button>
        </div>
        <Input
          type="text"
          value={blindAddress}
          readOnly
          className="bg-gray-100"
          placeholder="Generated blind address will appear here"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="age">Age</Label>
          <Input
            type="number"
            id="age"
            name="age"
            required
            value={formData.age}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            type="text"
            id="address"
            name="address"
            required
            value={formData.address}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="city">City</Label>
          <Input
            type="text"
            id="city"
            name="city"
            required
            value={formData.city}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            type="text"
            id="country"
            name="country"
            required
            value={formData.country}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input
            type="text"
            id="postalCode"
            name="postalCode"
            required
            value={formData.postalCode}
            onChange={handleInputChange}
          />
        </div>

        <Button type="submit" className="w-full">
          Register
        </Button>
      </form>
    </div>
  );
}
