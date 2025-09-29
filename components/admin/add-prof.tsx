"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus } from "lucide-react"
import { api2 } from "@/lib/api"


export default function AddProfessorDialog() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
  institute_id: "",
})
  const [otp, setOtp] = useState("")
  const [message, setMessage] = useState("")
  const [timer, setTimer] = useState(0)

  const [institutes, setInstitutes] = useState<any[]>([])
  const [selectedInstitute, setSelectedInstitute] = useState("")


  // countdown for resend
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  // newly added
  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const res = await api2.get("/api/institutes")
        setInstitutes(res.data.data)
      } catch (err) {
        console.error("Failed to fetch institutes", err)
      }
    }
    fetchInstitutes()
  }, [])


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  

  const handleRegister = async () => {
    try {
      setLoading(true)
      setMessage("")
      const res = await api2.post("/api/professor-register", formData)
      setMessage(res.data.message || "OTP sent to email.")
      setStep(2)
      setTimer(60) // start 60s timer
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    try {
      setLoading(true)
      setMessage("")
      const res = await api2.post("/api/verify-otp", {
        email: formData.email,
        otp: otp,
      })
      setMessage(res.data.message || "Email verified successfully!")
      setStep(3)
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Verification failed")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    try {
      setLoading(true)
      setMessage("")
      const res = await api2.post("/api/send-otp", { email: formData.email })
      setMessage(res.data.message || "OTP resent successfully!")
      setTimer(60) // reset timer
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Failed to resend OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Professor
        </Button>
      </DialogTrigger>

      <DialogContent className="space-y-4 bg-background border-border">
        <DialogHeader>
          <DialogTitle>
            {step === 1 && "Add Professor"}
            {step === 2 && "Verify Professor"}
            {step === 3 && "Success"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {step === 1 && "Fill out the form below to add a new professor to the system."}
            {step === 2 && "Enter the verification code sent to the professor's email."}
            {step === 3 && "The professor has been successfully added and verified."}
          </DialogDescription>
        </DialogHeader>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-2">
          <div className={`h-2 w-8 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
          <div className={`h-2 w-8 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
          <div className={`h-2 w-8 rounded-full ${step >= 3 ? "bg-primary" : "bg-muted"}`} />
        </div>

        {/* Step 1: Register */}
        {step === 1 && (
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john.doe@example.com" value={formData.email} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="institute_id">Institute</Label>
              <select
                id="institute_id"
                value={formData.institute_id}
                onChange={handleChange}
                className="w-full border rounded-md p-2 bg-background text-foreground"
              >
                <option value="">Select an Institute</option>
                {institutes.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.full_name}
                  </option>
                ))}
              </select>
            </div>
            {message && <p className="text-sm text-muted-foreground">{message}</p>}
            <DialogFooter>
              <Button type="button" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleRegister} disabled={loading}>
                {loading ? "Processing..." : "Continue"}
              </Button>
            </DialogFooter>
          </form>
        )}

        {/* Step 2: Verify */}
        {step === 2 && (
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input id="otp" type="text" placeholder="Enter 6-digit code" value={otp} onChange={(e) => setOtp(e.target.value)} />
            </div>
            {message && <p className="text-sm text-muted-foreground">{message}</p>}
            <DialogFooter className="flex gap-2 flex-wrap">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button type="button" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleVerify} disabled={loading}>
                {loading ? "Verifying..." : "Finish"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleResendOtp}
                disabled={timer > 0 || loading}
              >
                {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
              </Button>
            </DialogFooter>
          </form>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="text-center space-y-4">
            <p className="text-green-600 font-medium">{message || "Professor added successfully!"}</p>
            <DialogFooter>
              <Button onClick={() => {
                setStep(1)
                setFormData({ name: "", email: "", password: "", institute_id: "professor" })
                setOtp("")
                setMessage("")
              }}>
                Close
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
