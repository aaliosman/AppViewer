'use client';
import React, { useState, useEffect } from 'react';
import { CloudUpload, X } from 'lucide-react';
import axios from 'axios';
import TextFromRichEditor from './components/TextFromRichEditor';

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  const [courseData, setCourseData] = useState([]);
  console.log('%c[] -> courseData : ', 'color: #5466dc', courseData);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios
        .get(`${baseUrl}/api/global`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_ACCESS_TOKEN}`,
          },
        })
        .then((res) => {
          setCourseData(res?.data?.data);
        });
    };
    fetchData();
  }, []);

  const SKILLS_LIST = [
    'Html',
    'Css',
    'React.js',
    'Next.js',
    'JavaScript',
    'Node.js',
    'TailwindCss',
  ];
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    skills: {},
    links: '',
    coursesAndCertificates: '',
    notes: '',
  });
  const [status, setStatus] = useState({
    loading: false,
    error: '',
    success: '',
  });

  const [files, setFiles] = useState([]);
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSkillChange(skill, checked) {
    const updated = { ...form.skills };
    if (checked) {
      updated[skill] = updated[skill] || 50; // default 50%
    } else {
      delete updated[skill];
    }
    setForm({ ...form, skills: updated });
  }

  function handleSkillPercentChange(skill, value) {
    const updated = { ...form.skills, [skill]: Number(value) };
    setForm({ ...form, skills: updated });
  }

  function validate() {
    if (!form.name.trim()) return 'الرجاء إدخال الاسم الكامل.';
    if (!form.email.trim()) return 'الرجاء إدخال البريد الإلكتروني.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      return 'بريد إلكتروني غير صالح.';
    if (!form.phone.trim()) return 'الرجاء إدخال رقم الهاتف.';
    return '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setStatus({ loading: false, error: err, success: '' });
      return;
    }
    setStatus({ loading: true, error: '', success: '' });

    try {
      let uploadedFileIds = [];

      // If user uploaded files, upload them first
      if (files.length > 0) {
        const fileData = new FormData();
        files.forEach((file) => {
          fileData.append('files', file);
        });

        const uploadRes = await fetch(`${baseUrl}/api/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_ACCESS_TOKEN}`,
          },
          body: fileData,
        });

        const uploaded = await uploadRes.json();
        if (!uploadRes.ok)
          throw new Error(uploaded?.error?.message || 'فشل رفع الملفات');

        uploadedFileIds = uploaded.map((f) => f.id);
      }

      // Now submit the application
      const res = await fetch(`${baseUrl}/api/training-applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            ...form,
            attachments: uploadedFileIds,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || 'حدث خطأ');

      setStatus({
        loading: false,
        error: '',
        success: 'تم إرسال البيانات والملفات بنجاح. شكرًا لك!',
      });
      setForm({
        name: '',
        email: '',
        phone: '',
        skills: {},
        experience: '',
        links: '',
        coursesAndCertificates: '',
        notes: '',
      });
      setFiles([]);
    } catch (err) {
      setStatus({
        loading: false,
        error: err.message || 'فشل الإرسال، حاول لاحقًا.',
        success: '',
      });
    }
  }

  if (!courseData) {
    return <div className="text-center text-black">loading...</div>;
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen font-arial text-gray-600 bg-gray-50 p-6 flex flex-col items-center justify-center"
    >
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-md p-3 md:p-8">
        <div className="header flex flex-col-reverse md:flex-row items-center justify-center md:justify-between">
          <div className="info">
            <h1 className="text-2xl text-[#3C5DAB] font-bold mb-2 text-center md:text-right">
              {courseData?.pageTitle}
            </h1>
            <p className="text-sm text-gray-600 mb-6 text-center md:text-right">
              {courseData?.pageShortText}
            </p>
          </div>
          <img
            src="/about-company-section-logo.png"
            className="w-[250px]"
            alt=""
          />
        </div>

        <div className="h-[1px] w-full bg-gray-200 mb-4"></div>

        <div className="info mb-10">
          <div className="title flex gap-2 text-[15px] md:text-xl font-bold">
            <label htmlFor="title">عنوان الدورة :</label>
            <h1>{courseData?.courseTitle}</h1>
          </div>

          <div className="text-sm mt-4 flex flex-col gap-2">
            <TextFromRichEditor blocks={courseData?.courseDescription} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <label className="flex flex-col text-right">
              <span className="text-sm mb-1">
                الاسم الكامل <b className="text-red-600">*</b>
              </span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="p-2 rounded border"
              />
            </label>
            <label className="flex flex-col text-right">
              <span className="text-sm mb-1">
                رقم الهاتف <b className="text-red-600">*</b>
              </span>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="p-2 rounded border"
              />
            </label>
            <label className="flex flex-col text-right">
              <span className="text-sm mb-1">
                البريد الإلكتروني <b className="text-red-600">*</b>
              </span>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="p-2 rounded border"
              />
            </label>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-sm mb-2">مهارات سابقة لديك</span>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
              {SKILLS_LIST.map((skill) => (
                <div
                  key={skill}
                  className=" flex items-center justify-between border p-2 rounded"
                >
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.skills.hasOwnProperty(skill)}
                      onChange={(e) =>
                        handleSkillChange(skill, e.target.checked)
                      }
                    />
                    <span>{skill}</span>
                  </label>
                  {form.skills.hasOwnProperty(skill) && (
                    <div className="flex items-center gap-1">
                      <span>%</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={form.skills[skill]}
                        onChange={(e) =>
                          handleSkillPercentChange(skill, e.target.value)
                        }
                        className="w-20 p-1 border rounded text-center"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col text-right">
              <span className="text-sm mb-1"> سنوات الخبرة ان وجدت</span>
              <input
                name="experience"
                value={form.experience}
                onChange={handleChange}
                placeholder="مثال: 3 سنوات"
                className="p-2 rounded border"
              />
            </label>
            <label className="flex flex-col text-right">
              <span className="text-sm mb-1">
                روابط (LinkedIn / GitHub / موقع شخصي)
              </span>
              <input
                name="links"
                value={form.links}
                onChange={handleChange}
                className="p-2 rounded border"
                placeholder="https://..."
              />
            </label>
          </div>
          <label className="flex flex-col text-right">
            <span className="text-sm mb-1">الشهادات والدورات</span>
            <textarea
              name="coursesAndCertificates"
              value={form.coursesAndCertificates}
              onChange={handleChange}
              rows={3}
              className="p-2 rounded border"
              placeholder="الشهادات والدورات التدريبية المتحصل عليها"
            ></textarea>
          </label>
          <label className="flex flex-col text-right">
            <span className="text-sm mb-1">ملاحظات أو طلبات خاصة</span>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="p-2 rounded border"
              placeholder="أي معلومات إضافية تريد مشاركتها"
            ></textarea>
          </label>

          <label className="flex flex-col text-right">
            <span className="text-sm mb-1">الملفات (PDF أو أكثر من ملف)</span>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".pdf,.jpg,.png"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files))}
                className="w-3/4 md:w-1/2 p-2 border"
              />
              <div className="h-full p-2 cursor-pointer bg-[#3C5DAB] text-white">
                <CloudUpload />
              </div>
            </div>

            {files.length > 0 && (
              <ul className="mt-2 text-sm text-gray-700 space-y-2">
                {files.map((file, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between bg-gray-50 border rounded px-2 py-1"
                  >
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setFiles(files.filter((_, fileIdx) => fileIdx !== idx))
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </label>
          <div className="flex items-center justify-between gap-4">
            <button
              type="submit"
              disabled={status.loading}
              className="bg-[#3C5DAB] text-white px-8 py-2 rounded-md hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
            >
              {status.loading ? 'جارٍ الإرسال...' : 'أرسال '}
            </button>
            <div className="text-right flex-1">
              {status.error && <p className="text-red-600">{status.error}</p>}
              {status.success && (
                <p className="text-green-600">{status.success}</p>
              )}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
