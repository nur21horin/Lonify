import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { Search, Filter, TrendingUp, ArrowRight } from "lucide-react";
import { getAuth } from "firebase/auth";

export default function AllLoans() {
  const [loanData, setLoanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(loanData.map((loan) => loan.category))];

  const filteredLoans = loanData.filter((loan) => {
    const matchesSearch =
      loan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || loan.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const auth = getAuth();
        if (!auth.currentUser) {
          console.error("User not authenticated");
          setLoading(false);
          return;
        }
        const token = await auth.currentUser.getIdToken();

        const res = await fetch("http://localhost:5000/loans", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch loans");
        }

        const data = await res.json();
        setLoanData(data);
      } catch (error) {
        console.error("Failed to fetch loans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  if (loading) {
    return <p className="text-center py-20">Loading loans...</p>;
  }

  return (
    <div className="bg-white min-h-screen">
      <section className="py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Browse All Loans</h1>
        <p className="mt-4 text-gray-600">
          Find the perfect loan product that fits your needs
        </p>
      </section>

      <section className="py-6 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search loans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLoans.length > 0 ? (
            filteredLoans.map((loan) => (
              <div
                key={loan._id}
                className="group border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition"
              >
                <div className="relative">
                  <img
                    src={loan.image}
                    alt={loan.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {loan.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600">
                    {loan.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {loan.description}
                  </p>
                  <div className="flex justify-between mt-4 text-gray-800 text-sm font-semibold border-t pt-2">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-blue-600" />{" "}
                      {loan.interestRate} interest
                    </span>
                    <span>{loan.maxLimit} max</span>
                  </div>
                  <Link
                    to={`/loans/${loan._id}`}
                    className="mt-4 inline-flex items-center justify-center w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    View Details <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-600">
                No loans found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                className="mt-4 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
