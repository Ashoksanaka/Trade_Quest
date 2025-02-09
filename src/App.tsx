import {
  TrendingUp,
  Calendar,
  Trophy,
  Scroll,
  Mail,
  IndianRupee,
  ExternalLink,
  Phone,
} from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-sm fixed w-full z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-emerald-400" />
            <span className="text-2xl font-bold">Trade Quest</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 pr-6 border-slate-700">
              <p className="text-xs text-slate-400">Powered by</p>
              <img
                src="https://res.cloudinary.com/drvmk8gkm/image/upload/v1738911125/lbljo7tapuhorrzjyvzc.png"
                className="h-10 w-auto md:h-24"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-8xl mb-6">
            <i className=" text-orange-600 font-serif font-bold">
              Elektra 2025
            </i>
            <i className="text-xl">presents</i>
          </h1>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-emerald-400">Trade</span> Quest
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            The ultimate trading competition where strategy meets opportunity.{" "}
            <br />
            Join elite traders in a battle of market mastery.
          </p>
                    <div className="flex flex-col md:flex-row justify-center gap-4 items-center mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="text-emerald-400" />
              <span>March 03 to 07, 2025</span>
            </div>
            
            <div className="hidden md:block w-2 h-2 bg-slate-600 rounded-full"></div>
            <div className="flex items-center gap-2">
            <IndianRupee className="text-emerald-400" />
              <span>Registration Amount: 50 </span>
            </div>
            <div className="hidden md:block w-2 h-2 bg-slate-600 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Scroll className="text-emerald-400" />
              <span>Registration Deadline: February 28, 2025</span>
            </div>
          </div>
        </div>
      </section>

      {/* Event Overview */}
      <section className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Event Overview
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-700/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-emerald-400">
                About
              </h3>
              <p className="text-slate-300">
                Trade Quest is a 5-days intensive trading competition designed
                to identify and reward the most skilled traders. Participants
                will engage in simulated market trading with real-time data and
                virtual capital.
              </p>
            </div>
            <div className="bg-slate-700/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-emerald-400">
                Key Highlights
              </h3>
              <ul className="text-slate-300 space-y-2">
                <li>• mentorship sessions</li>
                <li>• Live market simulation</li>
                <li>• Platform tokens for participants</li>
                <li>• Real-time leaderboard</li>
              </ul>
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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-8">Competition Rules</h2>
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
              <h2 className="text-3xl font-bold mb-8">Guidelines</h2>
              <div className="space-y-4 text-slate-300">
                <div className="bg-slate-700/50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-emerald-400">
                    Process
                  </h3>
                  <ol className="space-y-2 list-decimal list-inside">
                    <li>Complete registration form</li>

                    <li>Attend orientation session</li>
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
      <section className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
        <p className="text-red-500 pt-2 blink text-lg text-center">Keep visiting the site for updated prize pool</p>
          <h2 className="text-3xl font-bold mb-12 text-center">Prize Pool</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
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
      <section id="register" className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Register Now</h2>
          <div className="max-w-2xl mx-auto bg-slate-700/50 p-8 rounded-lg">
            <p className="text-slate-300 mb-6">
              Don't miss your chance to compete with the best traders.
              <br />
              Registration closes on March 1, 2025.
            </p>
            <a
              href="https://forms.gle/8dAYhyN7fKwcGK6C7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-8 py-3 rounded-full font-semibold text-lg transition-colors"
            >
              Register for Trade Quest <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-around gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Student Co-ordinator
              </h3>
              <ul className="text-slate-300 space-y-2">
                <li>S Ashok</li>
                <div>
                  <ul className="text-slate-300 space-y-2">
                    <li className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      +91 9705061057
                    </li>
                    <li className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      ashoksanaka9963@gmail.com
                    </li>
                  </ul>
                </div>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">
                Faculty Co-ordinator
              </h3>
              <ul className="text-slate-300 space-y-2">
                <li>Mr. B Kiran Patrudu</li>
                
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">
                Co-Conveners
              </h3>
              <ul className="text-slate-300 space-y-2">
                <li>Mr. A Siva Kumar</li>
                <li>Mrs. Ch Anoosha</li>
                <li>Mrs. M Nirmala</li>
                <li>Dr. KVG Srinivas</li>
    
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">
                Convener
              </h3>
              <ul className="text-slate-300 space-y-2">
                <li>Dr. B Jagadeesh</li>
                <li>(Prof. & HOD, ECE)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">
                Honorary Convener
              </h3>
              <ul className="text-slate-300 space-y-2">
                <li>Dr. K Sri Rama Krishna</li>
                <li>(Prof. & Principal, ANITS)</li>
              </ul>
            </div>
            
          </div>
          <div className="mt-12 pt-8 border-t border-slate-700 text-center text-slate-400">
            <p>© 2025 Trade Quest. All rights reserved.</p>
            <p className="mt-2">Sponsored by Stockgro</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
