"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast"; // ✅ correct toast import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link"; 

export default function EditInternshipPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const { toast } = useToast();
const [formData, setFormData] = useState({
  companyName: "",
  companyWebsite: "",
  companyLocation: "",
  hrName: "",
  hrEmail: "",
  hrMobile: "",
  city: "",
  internshipTitle: "",
  description: "",
  duration: "",
  durationUnit: "",
  positions: "",
  deadline: "",
  deadlineType: "",
  stipendType: "",
  stipendAmount: "",
  eligibility: "",
  perks: "",
});

const [skills, setSkills] = useState<string[]>([]);
const [newSkill, setNewSkill] = useState("");
const [selectionSteps, setSelectionSteps] = useState<string[]>([]);
const [newStep, setNewStep] = useState("");
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);


  useEffect(() => {
  const loadInternship = async () => {
    try {
      const res = await fetch(`/api/postings?id=${id}`);
      const data = await res.json();

      if (data.success && data.posting) {
        const p = data.posting;
        setFormData({
          companyName: p.companyName || "",
          companyWebsite: p.companyWebsite || "",
          companyLocation: p.companyLocation || "",
          hrName: p.hrName || "",
          hrEmail: p.hrEmail || "",
          hrMobile: p.hrMobile || "",
          city: p.city || "",
          internshipTitle: p.internshipTitle || "",
          description: p.description || "",
          duration: p.duration || "",
          durationUnit: p.durationUnit || "",
          positions: p.positions || "",
          deadline: p.deadline || "",
          deadlineType: p.deadlineType || "",
          stipendType: p.stipendType || "",
          stipendAmount: p.stipendAmount || "",
          eligibility: p.eligibility || "",
          perks: p.perks || "",
        });
        setSkills(Array.isArray(p.skills) ? p.skills : []);
        setSelectionSteps(Array.isArray(p.selectionProcess) ? p.selectionProcess : []);
      } else {
        toast({ title: "Error", description: "Internship not found." });
        router.push("/company/internships");
      }
    } catch (err) {
      console.error("Error fetching internship:", err);
      toast({ title: "Error", description: "Failed to load internship." });
      router.push("/company/internships");
    } finally {
      setLoading(false);
    }
  };

  if (id) loadInternship();
}, [id, router, toast]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

 const addSkill = () => {
  if (newSkill.trim() && !skills.includes(newSkill.trim())) {
    setSkills([...skills, newSkill.trim()]);
    setNewSkill("");
  }
};

const removeSkill = (skillToRemove: string) => {
  setSkills(skills.filter((skill) => skill !== skillToRemove));
};

const addSelectionStep = () => {
  if (newStep.trim()) {
    setSelectionSteps([...selectionSteps, newStep.trim()]);
    setNewStep("");
  }
};

const removeSelectionStep = (index: number) => {
  setSelectionSteps(selectionSteps.filter((_, i) => i !== index));
};


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSaving(true);
  try {
    const body = {
      id,
      ...formData,
      skills,
      selectionProcess: selectionSteps,
    };

    const res = await fetch("/api/postings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    toast({ title: "Success", description: "Internship updated successfully!" });
    router.push("/company/internships");
  } catch (err: any) {
    toast({ title: "Error", description: err.message || "Update failed." });
  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl">
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <Link href="/company/dashboard" className="flex items-center">
                <Image src="/intelacad-logo.png" alt="IntelAcad" width={160} height={70} className="object-contain" />
              </Link>
              <Link href="/company/internships" className="text-cyan-800 hover:text-cyan-900 font-semibold">
                Back to Internships
              </Link>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Internship</h1>
            <div className="w-32 h-1 bg-cyan-800 mb-8"></div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Company Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Company Information</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                    <Input
                      name="companyName"
                      placeholder="Text Input"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                    />
                    <p className="text-sm text-gray-600 mt-1">HR / Contact Person Name</p>
                    <Input
                      name="hrName"
                      placeholder="HR Name"
                      value={formData.hrName}
                      onChange={handleInputChange}
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Company Website</label>
                    <Input
                      name="companyWebsite"
                      type="url"
                      placeholder="URL"
                      value={formData.companyWebsite}
                      onChange={handleInputChange}
                      required
                    />
                    <p className="text-sm text-gray-600 mt-1">HR Mobile</p>
                    <Input
                      name="hrMobile"
                      type="tel"
                      placeholder="HR Mobile"
                      value={formData.hrMobile}
                      onChange={handleInputChange}
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Company Location</label>
                    <Input
                      name="companyLocation"
                      placeholder="Text Input"
                      value={formData.companyLocation}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      name="city"
                      placeholder="City, State, Country"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="mt-2"
                    />
                  </div>
                </div>
                <Input
                  name="hrEmail"
                  type="email"
                  placeholder="HR Email"
                  value={formData.hrEmail}
                  onChange={handleInputChange}
                  required
                  className="mt-4"
                />
              </div>

              {/* Internship Details */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Internship Details</h2>
                <div className="w-32 h-1 bg-cyan-800 mb-4"></div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Internship Title / Role</label>
                    <Textarea
                      name="internshipTitle"
                      placeholder="Responsibilities, Expectations..."
                      value={formData.internshipTitle}
                      onChange={handleInputChange}
                      required
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Required Skills</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-800 text-white rounded-full text-sm"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="hover:bg-cyan-900 rounded-full p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Add skill"
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                        />
                        <Button type="button" onClick={addSkill} className="bg-cyan-800 hover:bg-cyan-900">
                          Add
                        </Button>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Duration</label>
                        <div className="flex gap-2">
                          <Input
                            name="duration"
                            type="number"
                            value={formData.duration}
                            onChange={handleInputChange}
                            className="w-20"
                            required
                          />
                          <select
                            name="durationUnit"
                            value={formData.durationUnit}
                            onChange={(e) => setFormData({ ...formData, durationUnit: e.target.value })}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                          >
                            <option>Weeks</option>
                            <option>Months</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Positions</label>
                        <Input
                          name="positions"
                          type="number"
                          value={formData.positions}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Application Deadline</label>
                        <div className="flex gap-2">
                          <Input
                            name="deadline"
                            type="date"
                            value={formData.deadline}
                            onChange={handleInputChange}
                            required
                            className="flex-1"
                          />
                          <select
                            name="deadlineType"
                            value={formData.deadlineType}
                            onChange={(e) => setFormData({ ...formData, deadlineType: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-md"
                          >
                            <option>Hybrid</option>
                            <option>Remote</option>
                            <option>On-site</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Stipend / Pay</label>
                      <div className="flex gap-2 mb-4">
                        {["Paid", "Unpaid", "Variable"].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData({ ...formData, stipendType: type })}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${
                              formData.stipendType === type
                                ? "bg-cyan-800 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Eligibility Criteria</label>
                        <Textarea
                          name="eligibility"
                          placeholder="Year, CGPA, prerequisites..."
                          value={formData.eligibility}
                          onChange={handleInputChange}
                          className="min-h-[80px]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Perks & Benefits</label>
                        <Textarea
                          name="perks"
                          placeholder="Certificate, PPO, Flexible Hours, etc"
                          value={formData.perks}
                          onChange={handleInputChange}
                          className="min-h-[80px]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Selection Process</label>
                    <div className="space-y-2 mb-2">
                      {selectionSteps.map((step, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input value={step} readOnly className="flex-1" />
                          <button
                            type="button"
                            onClick={() => removeSelectionStep(index)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newStep}
                        onChange={(e) => setNewStep(e.target.value)}
                        placeholder="Add selection step"
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSelectionStep())}
                      />
                      <Button type="button" onClick={addSelectionStep} className="bg-cyan-800 hover:bg-cyan-900">
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <Link href="/company/internships">
                  <Button type="button" variant="outline" className="px-12 py-6 text-lg font-semibold bg-transparent">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="bg-cyan-800 hover:bg-cyan-900 text-white px-12 py-6 text-lg font-semibold"
                >
                  Update Internship
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
