import React from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const ContactUsInformation = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-bold text-3xl font-roboto mb-4">
          Contact Information
        </h2>
        <p className="text-lg text-gray-600">
          Reach out to us through any of these channels for immediate
          assistance.
        </p>
      </div>

      <div className="space-y-8">
        {/* Email */}
        <div className="flex items-start gap-4">
          <div className="bg-gray-primary p-3 rounded-full">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-xl mb-2">Email Support</h3>
            <p className="text-gray-600 mb-1">support@weaponmarketplace.com</p>
            <p className="text-gray-600 mb-1">business@weaponmarketplace.com</p>
            <p className="text-sm text-gray-500">Response within 24 hours</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-4">
          <div className="bg-gray-primary p-3 rounded-full">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-xl mb-2">Phone Support</h3>
            <p className="text-gray-600 mb-1">+1 (000) 123-4567</p>
            <p className="text-gray-600 mb-1">+1 (000) 321-7654</p>
            <p className="text-sm text-gray-500">
              Available Mon-Fri, 9AM-6PM EST
            </p>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-4">
          <div className="bg-gray-primary p-3 rounded-full">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-xl mb-2">Office Address</h3>
            <p className="text-gray-600 mb-1">123 Defense Street</p>
            <p className="text-gray-600 mb-1">NY, VA 22201</p>
            <p className="text-gray-600 mb-1">United States</p>
            <p className="text-sm text-gray-500">By appointment only</p>
          </div>
        </div>

        {/* Support Hours */}
        <div className="flex items-start gap-4">
          <div className="bg-gray-primary p-3 rounded-full">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-xl mb-2">Support Hours</h3>
            <p className="text-gray-600 mb-1">
              Customer Support: 24/7 Available
            </p>
            <p className="text-gray-600 mb-1">
              Technical Support: Mon-Fri, 9AM-6PM EST
            </p>
            <p className="text-sm text-gray-500">Marketplace operates 24/7</p>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-gray-primary p-8 rounded-2xl">
        <h3 className="font-bold text-2xl mb-4">Why choose our marketplace?</h3>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-black rounded-full"></span>
            Verified suppliers and buyers
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-black rounded-full"></span>
            Secure transaction processing
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-black rounded-full"></span>
            Compliance with all regulations
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-black rounded-full"></span>
            24/7 customer support
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ContactUsInformation;
