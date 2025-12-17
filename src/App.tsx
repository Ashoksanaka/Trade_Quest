import { useState, useEffect } from "react";
import {
  TrendingUp,
  Calendar,
  Trophy,
  Scroll,
  IndianRupee,
  MessageCircle,
  Copy,
  Check,
  Upload,
  Phone,
  Mail,
  FileText,
  PartyPopper,
  Sparkles,
} from "lucide-react";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Hide loader after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000); // Show loader for 4 second

    return () => clearTimeout(timer);
  }, []);
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    whatsappNumber: "",
    studentEmail: "",
    instituteName: "",
    department: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentSection, setShowPaymentSection] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [upiCopied, setUpiCopied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"transactionId" | "screenshot" | null>(null);
  const [stepsAcknowledged, setStepsAcknowledged] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [paymentProofSubmitted, setPaymentProofSubmitted] = useState(false);
  const [showStockgroSection, setShowStockgroSection] = useState(false);
  const [allStepsCompleted, setAllStepsCompleted] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);

  // Replace this URL with your Google Apps Script Web App URL
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwQJElgoN-tykJfQIn41mPx0MaMY_kRlO1M6NIHtzTrPBcsahFet_hcBln9nN48Kt3Nnw/exec";
  
  // Receiver UPI ID - Replace with your actual UPI ID
  const RECEIVER_UPI_ID = "9381870576@ybl"; // e.g., "yourname@paytm" or "yourname@ybl"
  
  // Registration amount
  const REGISTRATION_AMOUNT = "40";

  // Render loader
  if (isLoading) {
    return (
      <div className="w-full h-screen gap-1 pt-40 pb-40 relative flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="flex flex-col items-center animate-[bounce_1s_ease-in-out_infinite_0.1s]">
          <div className="w-1 h-6 bg-green-500"></div>
          <div className="w-3 h-12 bg-green-500 rounded-sm"></div>
          <div className="w-1 h-6 bg-green-500"></div>
        </div>

        <div className="flex flex-col items-center animate-[bounce_1s_ease-in-out_infinite_0.2s]">
          <div className="w-1 h-6 bg-red-500"></div>
          <div className="w-3 h-12 bg-red-500 rounded-sm"></div>
          <div className="w-1 h-6 bg-red-500"></div>
        </div>

        <div className="flex flex-col items-center animate-[bounce_1s_ease-in-out_infinite_0.1s]">
          <div className="w-1 h-6 bg-green-500"></div>
          <div className="w-3 h-12 bg-green-500 rounded-sm"></div>
          <div className="w-1 h-6 bg-green-500"></div>
        </div>
      </div>
    );
  }

  // Validate phone number (exactly 10 digits, no special characters)
  const validatePhoneNumber = (phone: string): boolean => {
    const digitsOnly = /^[0-9]+$/;
    return phone.length === 10 && digitsOnly.test(phone);
  };

  // Check if form is complete and valid
  const isFormValid = (): boolean => {
    return (
      formData.fullName.trim() !== "" &&
      formData.mobileNumber.trim() !== "" &&
      formData.whatsappNumber.trim() !== "" &&
      formData.studentEmail.trim() !== "" &&
      formData.instituteName.trim() !== "" &&
      formData.department.trim() !== "" &&
      validatePhoneNumber(formData.mobileNumber) &&
      validatePhoneNumber(formData.whatsappNumber)
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // For mobile and WhatsApp numbers, only allow digits and limit to 10
    if (name === "mobileNumber" || name === "whatsappNumber") {
      const digitsOnly = value.replace(/[^0-9]/g, '').slice(0, 10);
      setFormData({
        ...formData,
        [name]: digitsOnly,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Copy UPI ID to clipboard
  const copyUPIId = async () => {
    try {
      await navigator.clipboard.writeText(RECEIVER_UPI_ID);
      setUpiCopied(true);
      setTimeout(() => setUpiCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = RECEIVER_UPI_ID;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setUpiCopied(true);
      setTimeout(() => setUpiCopied(false), 2000);
    }
  };

  // Handle screenshot upload
  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      setPaymentScreenshot(file);
      setPaymentMethod("screenshot");
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Convert file to base64 for upload (temporary, will be uploaded to Drive)
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove data URL prefix (data:image/png;base64,)
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Submit form data to Google Sheets
  const submitToGoogleSheets = async () => {
    let screenshotData = null;
    
    // Convert screenshot to base64 if uploaded (for sending to Google Apps Script)
    if (paymentScreenshot) {
      const base64Data = await fileToBase64(paymentScreenshot);
      screenshotData = {
        filename: paymentScreenshot.name,
        mimeType: paymentScreenshot.type,
        fileData: base64Data,
      };
    }

    const formPayload = {
      ...formData,
      transactionId: transactionId || "",
      paymentScreenshot: screenshotData, // Object with filename, mimeType, and base64 data
      paymentMethod: paymentMethod || "",
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(formPayload),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();

    if (result.result === "success") {
      alert("Payment proof submitted successfully!");
      
      // Set payment proof submitted state and automatically show Stockgro section
      setPaymentProofSubmitted(true);
      setShowStockgroSection(true);
      
      // Hide form and payment section
      setShowForm(false);
      setShowPaymentSection(false);
      setTransactionId("");
      setPaymentScreenshot(null);
      setScreenshotPreview(null);
      setPaymentMethod(null);
    } else {
      throw new Error(result.error || result.message || "Submission failed");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.fullName ||
      !formData.mobileNumber ||
      !formData.whatsappNumber ||
      !formData.studentEmail ||
      !formData.instituteName ||
      !formData.department
    ) {
      alert("Please fill in all fields");
      return;
    }

    // Validate phone numbers
    if (!validatePhoneNumber(formData.mobileNumber)) {
      alert("Mobile number must be exactly 10 digits (no special characters)");
      return;
    }

    if (!validatePhoneNumber(formData.whatsappNumber)) {
      alert("WhatsApp number must be exactly 10 digits (no special characters)");
      return;
    }

    // Show payment section
    setShowPaymentSection(true);
  };

  // Validate transaction ID
  const validateTransactionId = (id: string): boolean => {
    // At least 12 characters and only alphanumeric
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    return id.length >= 12 && alphanumericRegex.test(id);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate payment method
    if (!paymentMethod) {
      alert("Please enter transaction ID or upload payment screenshot");
      return;
    }

    if (paymentMethod === "transactionId") {
      if (!transactionId.trim()) {
        alert("Please enter transaction ID");
        return;
      }
      if (!validateTransactionId(transactionId.trim())) {
        alert("Transaction ID must be at least 12 characters long and contain only letters and numbers (no special characters)");
        return;
      }
    }

    if (paymentMethod === "screenshot" && !paymentScreenshot) {
      alert("Please upload payment screenshot");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitToGoogleSheets();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappGroupLink = "https://whatsapp.com/channel/0029VbBeVuvGk1FpQW68vh2Q";
  // Stockgro URLs - Replace with actual URLs
  const STOCKGRO_EVENT_REGISTRATION_URL = "https://community.stockgro.club/form/900e8368-1979-4daa-a8ff-c9b8dff96289";
  const STOCKGRO_APP_INSTALLATION_URL = "https://stockgro.onelink.me/vNON/21jikjek";

  // Handle completion of registration
  const handleCompleteRegistration = () => {
    setShowCongratulations(true);
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Reset all states after showing congratulations
    setTimeout(() => {
      setShowCongratulations(false);
      setAllStepsCompleted(false);
      setPaymentProofSubmitted(false);
      setShowStockgroSection(false);
      setShowForm(false);
      setStepsAcknowledged(false);
      setFormData({
        fullName: "",
        mobileNumber: "",
        whatsappNumber: "",
        studentEmail: "",
        instituteName: "",
        department: "",
      });
    }, 5000); // Show congratulations for 5 seconds
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Congratulations Modal */}
      {showCongratulations && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-gradient-to-br from-emerald-500/20 via-slate-800 to-slate-900 border-2 border-emerald-500/50 rounded-2xl p-8 sm:p-12 max-w-md mx-4 shadow-2xl animate-scaleIn">
            <div className="text-center">
              {/* Animated Icons */}
              <div className="relative mb-6 flex justify-center">
                <PartyPopper className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-400 animate-bounce" />
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400 absolute -top-2 -right-2 animate-pulse" style={{ animationDelay: '0.2s' }} />
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 absolute -bottom-1 -left-1 animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold text-emerald-400 mb-4 animate-fadeInUp">
                Congratulations!
              </h2>
              <p className="text-lg sm:text-xl text-slate-300 mb-2 animate-fadeInUp" style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
                Your registration is complete!
              </p>
              <p className="text-sm sm:text-base text-slate-400 mb-6 animate-fadeInUp" style={{ animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards' }}>
                Thank you for registering for Trade Quest. We look forward to seeing you compete!
              </p>
              
              {/* Confetti Animation */}
              <div className="flex justify-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"
                    style={{
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '1s',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-sm fixed w-full z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-400" />
            <span className="text-lg sm:text-2xl font-bold">Trade Quest</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-6">
            <div className="flex items-center gap-1 sm:gap-2 pr-2 sm:pr-6 border-slate-700">
              <p className="text-[10px] sm:text-xs text-slate-400 hidden sm:block">Powered by</p>
              <img
                src="https://res.cloudinary.com/drvmk8gkm/image/upload/v1738911125/lbljo7tapuhorrzjyvzc.png"
                className="h-6 w-auto sm:h-10 md:h-24"
                alt="Powered by"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-8xl mb-4 sm:mb-6">
            <i className="text-orange-600 font-serif font-bold block mb-1 sm:mb-2">
              Elektra 2026
            </i>
            <i className="text-sm sm:text-base md:text-xl block">presents</i>
          </h1>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6">
            <span className="text-emerald-400">Trade</span> Quest
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            The ultimate trading competition where strategy meets opportunity.{" "}
            <br className="hidden sm:block" />
            Join elite traders in a battle of market mastery.
          </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 items-center mb-6 sm:mb-8 px-2">
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <Calendar className="text-emerald-400 w-4 h-4 sm:w-5 sm:h-5" />
              <span>Event dates: Jan 05 to Jan 08</span>
            </div>
            
            <div className="hidden sm:block w-2 h-2 bg-slate-600 rounded-full"></div>
            <div className="flex items-center gap-2 text-sm sm:text-base">
            <IndianRupee className="text-emerald-400 w-4 h-4 sm:w-5 sm:h-5" />
              <span>Registration Amount: 40 </span>
            </div>
            <div className="hidden sm:block w-2 h-2 bg-slate-600 rounded-full"></div>
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <Scroll className="text-emerald-400 w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-center">Registration Deadline: Jan 4, 9:00 PM</span>
            </div>
          </div>
          <p className="animate-scroll text-red-800 text-base sm:text-lg md:text-xl font-semibold mb-6 sm:mb-8 px-4">
              "Stop Risking; Your Future is worth more than a flip of a coin"
            </p>
        </div>
      </section>

      {/* Event Overview */}
      <section className="py-12 sm:py-16 md:py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center">
            Event Overview
          </h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-slate-700/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-emerald-400">
                About
              </h3>
              <p className="text-slate-300">
                Trade Quest is a 4-days intensive trading competition designed
                to identify and reward the most skilled traders. Participants
                will engage in simulated market trading with real-time data and
                virtual capital.
              </p>
            </div>
            
            <div className="bg-slate-700/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-emerald-400">
                Target Audience
              </h3>
              <ul className="text-slate-300 space-y-2">
                <li>• Students</li>
                <li>• Trading enthusiasts</li>

                <li>• Professional traders</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Rules & Guidelines */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Competition Rules</h2>
              <div className="space-y-4 text-slate-300">
                <div className="bg-slate-700/50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-emerald-400">
                    Eligibility
                  </h3>
                  <ul className="space-y-2">
                    <li>1. Must be 18 years or older</li>
                    <li>2. Participant should belong to an educational body</li>
                    <li>3. Complete registration by deadline</li>
                    <li>4. Accept terms and conditions</li>
                  </ul>
                </div>
                <div className="bg-slate-700/50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-emerald-400">
                    Trading Rules
                  </h3>
                  <ul className="space-y-2">
                    <li>1. Initial virtual capital: ₹10,00,000</li>
                    <li>2. No leverage</li>
                    <li>3. Minimum 1 trade per day</li>
                    <li>4. Market hours trading only</li>
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Guidelines</h2>
              <div className="space-y-4 text-slate-300">
                <div className="bg-slate-700/50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-emerald-400">
                    Process
                  </h3>
                  <ol className="space-y-2 list-decimal list-inside">
                    <li>Complete registration form</li>
                    <li>Attend platform tour session</li>
                    <li>Get registered on the Stockgro</li>
                    <li>Begin trading on start date</li>
                  </ol>
                </div>
                <div className="bg-slate-700/50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-emerald-400">
                    Evaluation
                  </h3>
                  <ul className="space-y-2">
                    <li>• Highest return on investment</li>
                    <li>• Evaluation based on leaderboard</li>
                    <li>• Active participation</li>
                    <li>• Avoid malpractice</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prizes */}
      <section className="py-12 sm:py-16 md:py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
        <p className="text-red-500 pt-2 blink text-sm sm:text-base md:text-lg text-center px-2">Keep visiting the site for updated prize pool</p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center">Prize Pool</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-b from-[#FFD700]/10 to-slate-700/50 p-6 rounded-lg text-center">
              <Trophy className="w-12 h-12 text-[#FFD700] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">1st Place</h3>
              <p className="text-2xl font-bold text-[#FFD700]">₹3,000</p>
            </div>
            <div className="bg-gradient-to-b from-[#C0C0C0]/10 to-slate-700/50 p-6 rounded-lg text-center">
              <Trophy className="w-12 h-12 text-[#C0C0C0] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">2nd Place</h3>
              <p className="text-2xl font-bold text-[#C0C0C0]">₹2,000</p>
            </div>
            <div className="bg-gradient-to-b from-[#CD7F32]/10 to-slate-700/50 p-6 rounded-lg text-center">
              <Trophy className="w-12 h-12 text-[#CD7F32] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">3rd Place</h3>
              <p className="text-2xl font-bold text-[#CD7F32]">₹1,000</p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration */}
      <section id="register" className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-3 sm:px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Register Now</h2>
          <div className="max-w-2xl mx-auto bg-slate-700/50 p-4 sm:p-6 md:p-8 rounded-lg">
            <p className="text-slate-300 mb-4 sm:mb-6 text-sm sm:text-base">
              Don't miss your chance to compete with the best traders.
              <br className="hidden sm:block" />
              Registration closes on January 04, 2026.
            </p>
            
            {!showForm && !paymentProofSubmitted && !showStockgroSection ? (
              <div className="space-y-6 text-left">
                <div className="bg-slate-800/50 rounded-lg p-4 sm:p-6 border border-slate-600">
                  <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-emerald-400 flex items-center gap-2">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                    Registration Steps
                  </h3>
                  <ol className="space-y-3 sm:space-y-4 text-slate-300">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-semibold text-sm sm:text-base mt-0.5">
                        1
                      </span>
                      <span className="text-sm sm:text-base">Fill participant information</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-semibold text-sm sm:text-base mt-0.5">
                        2
                      </span>
                      <span className="text-sm sm:text-base">Complete the payment and submit proof</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-semibold text-sm sm:text-base mt-0.5">
                        3
                      </span>
                      <span className="text-sm sm:text-base">Register for the event on our partnered platform</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-semibold text-sm sm:text-base mt-0.5">
                        4
                      </span>
                      <span className="text-sm sm:text-base">Install Stockgro application (Not applicable to PC/Desktop users)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-semibold text-sm sm:text-base mt-0.5">
                        5
                      </span>
                      <span className="text-sm sm:text-base">Join our WhatsApp channel for latest updates</span>
                    </li>
                  </ol>
                </div>
                
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 sm:p-6">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={stepsAcknowledged}
                      onChange={(e) => {
                        setStepsAcknowledged(e.target.checked);
                        if (!e.target.checked) {
                          setShowForm(false);
                          setPaymentProofSubmitted(false);
                          setShowStockgroSection(false);
                        }
                      }}
                      className="mt-1 w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 bg-slate-800 border-slate-600 rounded focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-800 cursor-pointer"
                    />
                    <span className="text-sm sm:text-base text-slate-300 group-hover:text-white transition-colors">
                      I have read and understood all the registration steps clearly.
                    </span>
                  </label>
                </div>
                
                {stepsAcknowledged && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForm(true)}
                      className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-base sm:text-lg transition-colors"
                    >
                      Continue to Register
                    </button>
                  </div>
                )}
              </div>
            ) : showForm && !showPaymentSection && !paymentProofSubmitted ? (
              <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
              <div>
                <label htmlFor="fullName" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-slate-300 mb-2">
                  Mobile Number (+91)
                </label>
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  placeholder="Enter 10 digit mobile number"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  maxLength={10}
                  className={`w-full px-3 sm:px-4 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent text-sm sm:text-base ${
                    formData.mobileNumber && !validatePhoneNumber(formData.mobileNumber)
                      ? 'border-red-500 focus:ring-red-500'
                      : formData.mobileNumber && validatePhoneNumber(formData.mobileNumber)
                      ? 'border-emerald-500 focus:ring-emerald-500'
                      : 'border-slate-600 focus:ring-emerald-500'
                  }`}
                  required
                />
                {formData.mobileNumber && !validatePhoneNumber(formData.mobileNumber) && (
                  <p className="text-xs text-red-400 mt-1">
                    Mobile number must be exactly 10 digits (no special characters)
                  </p>
                )}
                {formData.mobileNumber && validatePhoneNumber(formData.mobileNumber) && (
                  <p className="text-xs text-emerald-400 mt-1">
                    ✓ Valid mobile number
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="whatsappNumber" className="block text-sm font-medium text-slate-300 mb-2">
                  Whatsapp Number (+91)
                </label>
                <input
                  type="tel"
                  id="whatsappNumber"
                  name="whatsappNumber"
                  placeholder="Enter 10 digit WhatsApp number"
                  value={formData.whatsappNumber}
                  onChange={handleInputChange}
                  maxLength={10}
                  className={`w-full px-3 sm:px-4 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent text-sm sm:text-base ${
                    formData.whatsappNumber && !validatePhoneNumber(formData.whatsappNumber)
                      ? 'border-red-500 focus:ring-red-500'
                      : formData.whatsappNumber && validatePhoneNumber(formData.whatsappNumber)
                      ? 'border-emerald-500 focus:ring-emerald-500'
                      : 'border-slate-600 focus:ring-emerald-500'
                  }`}
                  required
                />
                {formData.whatsappNumber && !validatePhoneNumber(formData.whatsappNumber) && (
                  <p className="text-xs text-red-400 mt-1">
                    WhatsApp number must be exactly 10 digits (no special characters)
                  </p>
                )}
                {formData.whatsappNumber && validatePhoneNumber(formData.whatsappNumber) && (
                  <p className="text-xs text-emerald-400 mt-1">
                    ✓ Valid WhatsApp number
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="studentEmail" className="block text-sm font-medium text-slate-300 mb-2">
                  Student email ID
                </label>
                <input
                  type="email"
                  id="studentEmail"
                  name="studentEmail"
                  placeholder="Student email ID"
                  value={formData.studentEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label htmlFor="instituteName" className="block text-sm font-medium text-slate-300 mb-2">
                  Institute Name, city
                </label>
                <input
                  type="text"
                  id="instituteName"
                  name="instituteName"
                  placeholder="Institute Name, city"
                  value={formData.instituteName}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-slate-300 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  placeholder="Department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
                  required
                />
              </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !isFormValid()}
                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-base sm:text-lg transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            ) : showPaymentSection && !paymentProofSubmitted ? (
              <div className="space-y-4 text-left">
                {/* Receiver UPI ID Display */}
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-emerald-400 mb-2 sm:mb-3">
                    Make Payment of ₹{REGISTRATION_AMOUNT}
                  </h3>
                  <div className="bg-slate-800/50 rounded-lg p-4 mb-3">
                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
                      Send payment to this UPI ID:
                    </label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="text"
                        value={RECEIVER_UPI_ID}
                        readOnly
                        className="flex-1 px-3 sm:px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono text-sm sm:text-base md:text-lg break-all"
                      />
                      <button
                        type="button"
                        onClick={copyUPIId}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        {upiCopied ? (
                          <>
                            <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="text-sm sm:text-base">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="text-sm sm:text-base">Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      Copy the UPI ID and make payment of ₹{REGISTRATION_AMOUNT} using your UPI app
                    </p>
                  </div>
                </div>

                {/* Payment Verification Form */}
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2 sm:mb-3">
                      Payment Verification (Choose one):
                    </label>
                    
                    {/* Transaction ID Option */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="radio"
                          id="transactionIdOption"
                          name="paymentMethod"
                          checked={paymentMethod === "transactionId"}
                          onChange={() => {
                            setPaymentMethod("transactionId");
                            setPaymentScreenshot(null);
                            setScreenshotPreview(null);
                          }}
                          className="w-4 h-4 text-emerald-500"
                        />
                        <label htmlFor="transactionIdOption" className="text-slate-300 text-sm sm:text-base">
                          Enter Transaction ID
                        </label>
                      </div>
                      {paymentMethod === "transactionId" && (
                        <div className="mt-2">
                          <input
                            type="text"
                            value={transactionId}
                            onChange={(e) => {
                              // Only allow alphanumeric characters
                              const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                              setTransactionId(value);
                            }}
                            placeholder="Enter transaction ID from your UPI app"
                            maxLength={50}
                            className={`w-full px-3 sm:px-4 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent mt-2 text-sm sm:text-base ${
                              transactionId && !validateTransactionId(transactionId)
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-slate-600 focus:ring-emerald-500'
                            }`}
                          />
                          {transactionId && !validateTransactionId(transactionId) && (
                            <p className="text-xs text-red-400 mt-1">
                              Transaction ID must be at least 12 characters and contain only letters and numbers
                            </p>
                          )}
                          {transactionId && validateTransactionId(transactionId) && (
                            <p className="text-xs text-emerald-400 mt-1">
                              ✓ Valid transaction ID
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Screenshot Option */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="radio"
                          id="screenshotOption"
                          name="paymentMethod"
                          checked={paymentMethod === "screenshot"}
                          onChange={() => {
                            setPaymentMethod("screenshot");
                            setTransactionId("");
                          }}
                          className="w-4 h-4 text-emerald-500"
                        />
                        <label htmlFor="screenshotOption" className="text-slate-300 text-sm sm:text-base">
                          Upload Payment Screenshot
                        </label>
                      </div>
                      {paymentMethod === "screenshot" && (
                        <div className="mt-2">
                          <label className="block">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleScreenshotChange}
                              className="hidden"
                              id="screenshotInput"
                            />
                            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors">
                              <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                              <span className="text-slate-300 text-sm sm:text-base truncate">
                                {paymentScreenshot ? paymentScreenshot.name : "Choose file"}
                              </span>
                            </div>
                          </label>
                          {screenshotPreview && (
                            <div className="mt-3">
                              <img
                                src={screenshotPreview}
                                alt="Payment screenshot preview"
                                className="max-w-full h-auto rounded-lg border border-slate-600 max-h-64 sm:max-h-96 object-contain"
                              />
                            </div>
                          )}
                          <p className="text-xs text-slate-400 mt-1">
                            Upload a screenshot of your payment confirmation (Max 5MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 space-y-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || (!transactionId && !paymentScreenshot)}
                      className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-base sm:text-lg transition-colors"
                    >
                      {isSubmitting ? (
                        "Submitting..."
                      ) : (
                        <>
                          <IndianRupee className="w-5 h-5" />
                          Complete Registration
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPaymentSection(false);
                        setTransactionId("");
                        setPaymentScreenshot(null);
                        setScreenshotPreview(null);
                        setPaymentMethod(null);
                      }}
                      className="w-full text-slate-400 hover:text-slate-300 text-sm underline"
                    >
                      Back to Form
                    </button>
                  </div>
                </form>
              </div>
            ) : null}

            {paymentProofSubmitted && (
              <div className="mt-6 pt-6 border-t border-slate-600">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 sm:p-6 mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-emerald-400 mb-2 text-center">
                    Complete Your Registration
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base text-center mb-6">
                    Please complete the following steps to finalize your registration:
                  </p>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  {/* Stockgro Event Registration */}
                  <a
                    href={STOCKGRO_EVENT_REGISTRATION_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-base sm:text-lg transition-colors"
                  >
                    <Scroll className="w-5 h-5" />
                    Stockgro Event Registration
                  </a>

                  {/* Stockgro App Installation */}
                  <a
                    href={STOCKGRO_APP_INSTALLATION_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-base sm:text-lg transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                    Stockgro App Installation
                  </a>

                  {/* WhatsApp Channel Link */}
                  <a
                    href={whatsappGroupLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-base sm:text-lg transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Join WhatsApp Channel
                  </a>
                </div>

                {/* Final Acknowledgment Checkbox */}
                <div className="mt-6 pt-6 border-t border-slate-600">
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 sm:p-6">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={allStepsCompleted}
                        onChange={(e) => setAllStepsCompleted(e.target.checked)}
                        className="mt-1 w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 bg-slate-800 border-slate-600 rounded focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-800 cursor-pointer"
                      />
                      <span className="text-sm sm:text-base text-slate-300 group-hover:text-white transition-colors">
                        I have completed all the registration steps including Stockgro registration, app installation, and joining the WhatsApp channel.
                      </span>
                    </label>
                  </div>

                  {allStepsCompleted && (
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={handleCompleteRegistration}
                        className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-base sm:text-lg transition-colors"
                      >
                        <Check className="w-5 h-5" />
                        Complete Registration
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-4">
          {/* Commented out footer grid section */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Student Co-ordinators
              </h3>
              <ul className="text-sm sm:text-base text-slate-300 space-y-1.5 sm:space-y-2">
                <li>M RamaLakshmi</li>
                <li>Ch Sai Vikash</li>
                <li>T Nihal</li>
                <li>M Pavan Kumar</li>
                <li>D Deekshithulu</li>
                
              </ul>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Student Volunteers
              </h3>
              <ul className="text-sm sm:text-base text-slate-300 space-y-1.5 sm:space-y-2">
                <li>B Himasri</li>
                <li>G Srinu</li>
                <li>G Srujana</li>
                <li>K Harsha Vardhan</li>
                <li>N Bhavana</li>
                
              </ul>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Faculty Co-ordinator
              </h3>
              <ul className="text-sm sm:text-base text-slate-300 space-y-1.5 sm:space-y-2">
                <li>Mr. B Kiran Patrudu</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Co-Conveners
              </h3>
              <ul className="text-sm sm:text-base text-slate-300 space-y-1.5 sm:space-y-2">
                <li>Mr. S Ravi Kumar</li>
                <li>Mrs. B Deepa</li>
                <li>Mrs. P Devi</li>
                <li>Dr. KVG Srinivas</li>
    
              </ul>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Convener
              </h3>
              <ul className="text-sm sm:text-base text-slate-300 space-y-1.5 sm:space-y-2">
                <li>Dr. B Jagadeesh</li>
                <li>(Prof. & HOD, ECE)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Honorary Convener
              </h3>
              <ul className="text-sm sm:text-base text-slate-300 space-y-1.5 sm:space-y-2">
                <li>Dr. V Rajya Lakshmi</li>
                <li>(Prof. & Principal, ANITS)</li>
              </ul>
            </div>
            
          </div> */}
          
          {/* Contact Details Section */}
          <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-slate-700">
            <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center text-emerald-400">
              Contact Us for Queries
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
              {/* Sai Vikash */}
              <div className="bg-slate-800/50 p-4 sm:p-6 rounded-lg border border-slate-700 hover:border-emerald-500/50 transition-colors">
                <h4 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-emerald-400">
                  Ch Sai Vikash
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  <a
                    href="tel:+919390446372"
                    className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors text-sm sm:text-base"
                  >
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span>+91 9390446372</span>
                  </a>
                  <a
                    href="mailto:chinnarisaivikash.24.ece@anits.edu.in"
                    className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors text-sm sm:text-base break-all"
                  >
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="break-all">chinnarisaivikash.24.ece@anits.edu.in</span>
                  </a>
                </div>
              </div>

              {/* T Nihal */}
              <div className="bg-slate-800/50 p-4 sm:p-6 rounded-lg border border-slate-700 hover:border-emerald-500/50 transition-colors">
                <h4 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-emerald-400">
                  T Nihal
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  <a
                    href="tel:+917799558819"
                    className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors text-sm sm:text-base"
                  >
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span>+91 7799558819</span>
                  </a>
                  <a
                    href="mailto:thotanihal.24.ece@anits.edu.in"
                    className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors text-sm sm:text-base break-all"
                  >
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="break-all">thotanihal.24.ece@anits.edu.in</span>
                  </a>
                </div>
              </div>

              {/* M Pavan */}
              <div className="bg-slate-800/50 p-4 sm:p-6 rounded-lg border border-slate-700 hover:border-emerald-500/50 transition-colors">
                <h4 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-emerald-400">
                  M Pavan Kumar
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  <a
                    href="tel:+919704242378"
                    className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors text-sm sm:text-base"
                  >
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span>+91 9704242378</span>
                  </a>
                  <a
                    href="mailto:madinapavankumar.24.ece@anits.edu.in"
                    className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors text-sm sm:text-base break-all"
                  >
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="break-all">madinapavankumar.24.ece@anits.edu.in</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
