'use client';

import { useState } from 'react';

export default function InterestForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    costGuess: '',
    spidrPin: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Format Spidr PIN manually
    if (name === 'spidrPin') {
      const raw = value.replace(/\D/g, '');
      const chunks = raw.match(/.{1,4}/g) || [];
      const formatted = chunks.join('-').slice(0, 19);
      setFormData({ ...formData, spidrPin: formatted });
    } 
    // Handle cost guess formatting
    else if (name === 'costGuess') {
      // Remove any non-digit characters except decimal point
      const cleanValue = value.replace(/[^\d.]/g, '');
      // Ensure only one decimal point and limit decimal places
      const parts = cleanValue.split('.');
      let formatted = parts[0]; // Keep the whole number part as is
      if (parts.length > 1) {
        // Add decimal point and limit to exactly 2 decimal places
        formatted += '.' + parts[1].slice(0, 2);
      }
      setFormData({ ...formData, costGuess: formatted });
    }
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thanks for submitting your guess!');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-md bg-[#2d2d2d]/95 text-white border border-white/[0.08] p-8 rounded-lg flex flex-col gap-6 backdrop-blur-sm"
      style={{
        boxShadow: '0 0 50px rgba(0, 180, 216, 0.08)',
      }}
    >
      <h2 className="text-4xl font-extrabold text-center uppercase relative">
        <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent" style={{ letterSpacing: '-0.03em' }}>
          Air Fryer Interest Form
        </span>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-transparent via-[#00b4d8] to-transparent rounded-full opacity-70"></div>
      </h2>

      <input
        name="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange}
        className="bg-[#1a1a1a] border-none px-4 py-3 rounded-lg placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] transition-all text-sm font-light tracking-wide"
        required
      />

      <input
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleChange}
        className="bg-[#1a1a1a] border-none px-4 py-3 rounded-lg placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] transition-all text-sm"
        required
      />

      <input
        name="phone"
        type="tel"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
        className="bg-[#1a1a1a] border-none px-4 py-3 rounded-lg placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] transition-all text-sm"
        required
      />

      <input
        name="email"
        type="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
        className="bg-[#1a1a1a] border-none px-4 py-3 rounded-lg placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] transition-all text-sm"
        required
      />

      <div className="relative">
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 text-sm">$</span>
        <input
          name="costGuess"
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={formData.costGuess}
          onChange={handleChange}
          className="bg-[#1a1a1a] border-none pl-7 pr-4 py-3 rounded-lg placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] transition-all text-sm w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          required
        />
      </div>

      <input
        name="spidrPin"
        type="password"
        placeholder="Spidr PIN (e.g. 1234-5678-9012-3456)"
        value={formData.spidrPin}
        onChange={handleChange}
        maxLength={19}
        className="bg-[#1a1a1a] border-none px-4 py-3 rounded-lg placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#00b4d8] transition-all text-sm"
      />

      <button
        type="submit"
        className="bg-gradient-to-r from-[#00b4d8] to-[#0077be] text-white rounded-lg py-3 font-medium hover:from-[#00a0c2] hover:to-[#006ba8] transition-all text-sm uppercase tracking-wider shadow-lg shadow-[#00b4d8]/10"
      >
        Submit
      </button>
    </form>
  );
}
