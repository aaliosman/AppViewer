'use client';

import React, { useState } from 'react';
import { Mail, Phone, FileText, Link as LinkIcon } from 'lucide-react';

const Page = () => {
  const [email, setEmail] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [applications, setApplications] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(
        `/api/check-email?email=${encodeURIComponent(email)}`
      );
      const data = await res.json();

      if (data.authorized) {
        setAuthorized(true);
        getApplications();
      } else {
        setError('Email not found. Access denied.');
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const getApplications = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/training-applications?populate=attachments`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_ACCESS_TOKEN}`,
          },
        }
      );

      const data = await res.json();
      if (data?.data?.length > 0) {
        setApplications(data.data.map((app) => app.attributes || app));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const refreshApplications = () => {
    getApplications();
  };

  if (!authorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-md w-96"
        >
          <h2 className="text-xl font-bold mb-4">Enter your email</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="you@example.com"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            {loading ? 'Checking...' : 'Submit'}
          </button>
          {error && <p className="text-red-500 mt-3">{error}</p>}
        </form>
      </div>
    );
  }

  if (applications.length === 0 && authorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="bg-white text-center p-6 rounded-2xl shadow-md w-96">
          <h2 className="text-xl font-bold mb-4">لا يوجد بيانات</h2>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="px-10 pb-10 bg-gray-50 min-h-screen">
      <div className="header text-[#3C5DAB] flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <img
            src="/about-company-section-logo.png"
            className="w-[200px]"
            alt=""
          />
          <h1 className="text-2xl font-bold">بيانات المتقدمين للتدريب</h1>
        </div>
        <div className="flex gap-2 items-center mt-4 md:mt-0">
          <h1 className="text-2xl font-bold">
            عدد المتقدمين: {applications.length}
          </h1>
          <button
            onClick={refreshApplications}
            className="bg-[#3C5DAB] hover:bg-[#677fb6] cursor-pointer text-white py-2 px-4 rounded"
          >
            تحديث
          </button>
        </div>
      </div>
      <div className="bg-gray-300 h-[1px] mt-4 md:mt-0" />
      <div className="grid grid-cols-1 mt-6 md:grid-cols-2 gap-6">
        {applications.map((app) => (
          // <div
          //   key={app.documentId || app.id}
          //   className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
          // >
          //   <h2 className="text-xl font-semibold mb-2">{app.name}</h2>

          //   <div className="space-y-2 text-sm text-gray-700">
          //     <p className="flex items-center gap-2">
          //       <Mail className="w-4 h-4 text-blue-500" />
          //       {app.email}
          //     </p>
          //     <p className="flex items-center gap-2">
          //       <Phone className="w-4 h-4 text-green-500" />
          //       {app.phone}
          //     </p>
          //     {app.links && (
          //       <p className="flex items-center gap-2">
          //         <LinkIcon className="w-4 h-4 text-purple-500" />
          //         <a
          //           href={app.links}
          //           className="text-blue-600 underline"
          //           target="_blank"
          //         >
          //           {app.links}
          //         </a>
          //       </p>
          //     )}
          //     {app.notes && (
          //       <p className="flex items-center gap-2">
          //         <FileText className="w-4 h-4 text-gray-500" />
          //         {app.notes}
          //       </p>
          //     )}
          //   </div>

          //   {/* Skills */}
          //   {app.skills && (
          //     <div className="mt-4">
          //       <h3 className="text-sm font-medium text-gray-600 mb-2">
          //         Skills
          //       </h3>
          //       <div className="space-y-2">
          //         {Object.entries(app.skills).map(([skill, value]) => (
          //           <div key={skill}>
          //             <div className="flex justify-between text-xs font-medium">
          //               <span>{skill}</span>
          //               <span>{value}%</span>
          //             </div>
          //             <div className="w-full bg-gray-200 rounded-full h-2">
          //               <div
          //                 className="bg-blue-500 h-2 rounded-full"
          //                 style={{ width: `${value}%` }}
          //               ></div>
          //             </div>
          //           </div>
          //         ))}
          //       </div>
          //     </div>
          //   )}

          //   {/* Dates */}
          //   <p className="mt-4 text-xs text-gray-400">
          //     Submitted: {new Date(app.createdAt).toLocaleString()}
          //   </p>
          // </div>
          <div
            key={app.documentId || app.id}
            className="bg-white rounded-3xl shadow-md hover:shadow-xl p-6 border border-gray-100"
          >
            {/* Header */}
            <div className="header flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#3C5DAB] mb-4">
                {app.name}
              </h2>
              {/* <h2 className="w-8 h-8 flex items-center justify-center rounded-full border bg-[#3C5DAB] text-white text-xl font-bold mb-4">
                {applications.indexOf(app) + 1}
              </h2> */}
            </div>

            {/* Contact Info */}
            <div className="flex flex-col md:flex-row gap-8 md:items-center text-sm">
              <p className="flex items-center gap-2 text-gray-700">
                <Mail className="w-4 h-4 text-blue-500" />
                <span className="truncate">{app.email}</span>
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <Phone className="w-4 h-4 text-green-500" />
                {app.phone}
              </p>
              {app.links && (
                <p className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-purple-500" />
                  <a
                    href={app.links}
                    target="_blank"
                    className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full text-xs font-medium hover:underline"
                  >
                    Visit Profile
                  </a>
                </p>
              )}
            </div>

            {/* Notes */}
            {app.coursesAndCertificates && (
              <div className="mt-3">
                <span className="font-bold flex items-center gap-2 text-gray-600 text-sm">
                  <FileText className="w-4 h-4 text-gray-500" />
                  دورات و شهادات
                </span>
                <div className="note-value border border-gray-200 rounded-md p-3 mt-2">
                  <p className="text-gray-700">{app.coursesAndCertificates}</p>
                </div>
              </div>
            )}

            {/* Notes */}
            {app.notes && (
              <div className="mt-3">
                <span className="font-bold flex items-center gap-2 text-gray-600 text-sm">
                  <FileText className="w-4 h-4 text-gray-500" />
                  ملاحظات
                </span>
                <div className="note-value border border-gray-200 rounded-md p-3 mt-2">
                  <p className="text-gray-700">{app.notes}</p>
                </div>
              </div>
            )}

            {/* Skills */}
            {app.skills && (
              <div className="mt-5">
                <h3 className="text-sm font-bold text-gray-500 tracking-wide mb-3">
                  المهارات
                </h3>
                <div className="flex flex-wrap gap-6">
                  {Object.entries(app.skills).map(([skill, value]) => (
                    <div
                      key={skill}
                      className="relative w-16 h-16 flex items-center justify-center"
                    >
                      {/* Outer Circle (progress ring) */}
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `conic-gradient(#3C5DAB ${
                            value * 3.6
                          }deg, #E5E7EB ${value * 3.6}deg)`,
                        }}
                      />

                      {/* Inner Circle (to make it look like a border) */}
                      <div className="absolute inset-[4px] bg-white rounded-full flex items-center justify-center text-[10px] font-bold text-gray-700 text-center px-1">
                        {skill}
                      </div>

                      {/* Percentage under the circle */}
                      <span className="absolute -bottom-4 text-[9px] text-gray-500">
                        {value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attachments */}
            {app.attachments?.length > 0 && (
              <div className="mt-10">
                <h3 className="text-sm font-bold text-gray-500 tracking-wide mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  الملفات المرفقة
                </h3>
                <div className="flex flex-wrap gap-2">
                  {app.attachments.map((file, idx) => (
                    <a
                      key={file.id || idx}
                      href={
                        file.url.startsWith('http')
                          ? file.url
                          : `${process.env.NEXT_PUBLIC_BASE_API_URL}${file.url}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium hover:bg-blue-100 transition"
                    >
                      {file.name}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-100 text-sm text-gray-700">
              تم التسجيل في:{' '}
              {new Date(app.createdAt).toLocaleString('en-GB', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
