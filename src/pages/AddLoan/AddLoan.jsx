// pages/Dashboard/ManagerDashBoard/AddLoan.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { PlusCircle, Loader2 } from 'lucide-react';
// import { toast } from 'react-toastify'; 

const AddLoan = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    
    // State to handle complex/dynamic inputs like Required Documents and EMI Plans
    const [requiredDocuments, setRequiredDocuments] = useState([]);
    const [emiPlans, setEmiPlans = useState([]);

    // Handlers for dynamic lists
    const addDocument = (doc) => setRequiredDocuments([...requiredDocuments, doc]);
    const removeDocument = (index) => setRequiredDocuments(requiredDocuments.filter((_, i) => i !== index));
    const addEmiPlan = (plan) => setEmiPlans([...emiPlans, plan]);
    const removeEmiPlan = (index) => setEmiPlans(emiPlans.filter((_, i) => i !== index));


    const onSubmit = async (data) => {
        setLoading(true);

        const loanData = {
            ...data,
            requiredDocuments, // Include dynamic lists
            emiPlans,
            // Assuming image upload happens separately and returns a URL, 
            // or is provided as a URL in the form. Using a placeholder here.
            image: data.image || 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Loan+Product', 
            showOnHome: data.showOnHome === 'true', // Convert string checkbox value to boolean
        };

        try {
            // Note: The backend requires the Firebase ID token in the header
            // Axios interceptors or local context should handle adding the token
            await axios.post('https://lonify-server-side.onrender.com//loans', loanData, {
                // headers: { Authorization: `Bearer ${firebaseToken}` } 
            });
            
            // toast.success("Loan product added successfully!");
            reset();
            setRequiredDocuments([]);
            setEmiPlans([]);
        } catch (error) {
            console.error("Error adding loan:", error);
            // toast.error("Failed to add loan. Check server logs.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-indigo-700">
                <PlusCircle className="h-6 w-6" /> Add New Loan Product
            </h1>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Basic Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Loan Title</label>
                        <input 
                            {...register("title", { required: "Title is required" })} 
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select 
                            {...register("category", { required: "Category is required" })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        >
                            <option value="">Select Category</option>
                            <option value="Personal">Personal Loan</option>
                            <option value="Business">Business Loan</option>
                            <option value="Education">Education Loan</option>
                        </select>
                        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
                        <input 
                            type="number" 
                            step="0.1"
                            {...register("interestRate", { required: "Interest rate is required", min: 0 })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                        {errors.interestRate && <p className="text-red-500 text-xs mt-1">{errors.interestRate.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Max Loan Limit ($)</label>
                        <input 
                            type="number" 
                            {...register("maxLimit", { required: "Max limit is required", min: 100 })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                        {errors.maxLimit && <p className="text-red-500 text-xs mt-1">{errors.maxLimit.message}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea 
                        {...register("description", { required: "Description is required" })} 
                        rows="3"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                </div>

                {/* Dynamic Inputs: Documents */}
                <DynamicList 
                    title="Required Documents"
                    list={requiredDocuments}
                    onAdd={addDocument}
                    onRemove={removeDocument}
                />
                
                {/* Dynamic Inputs: EMI Plans */}
                <DynamicList 
                    title="Available EMI Plans (e.g., 12 months, 24 months)"
                    list={emiPlans}
                    onAdd={addEmiPlan}
                    onRemove={removeEmiPlan}
                />
                
                {/* Toggle and Image */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center">
                        <input
                            id="showOnHome"
                            type="checkbox"
                            {...register("showOnHome")}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                        <label htmlFor="showOnHome" className="ml-2 block text-sm font-medium text-gray-700">
                            Show on Home Page
                        </label>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700">Image URL</label>
                         <input 
                            {...register("image")} 
                            placeholder="Enter image URL"
                            className="mt-1 block border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 transition"
                >
                    {loading && <Loader2 className="animate-spin h-5 w-5 mr-3" />}
                    {loading ? 'Adding Loan...' : 'Add Loan Product'}
                </button>
            </form>
        </div>
    );
};

// Reusable component for dynamic string lists (Documents, EMI Plans)
const DynamicList = ({ title, list, onAdd, onRemove }) => {
    const [newItem, setNewItem] = useState('');

    const handleAddItem = (e) => {
        e.preventDefault();
        if (newItem.trim()) {
            onAdd(newItem.trim());
            setNewItem('');
        }
    };

    return (
        <fieldset className="border p-4 rounded-md space-y-3">
            <legend className="text-sm font-semibold text-gray-700 px-2">{title}</legend>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder={`Enter new ${title.split(' ')[0]}`}
                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                />
                <button 
                    onClick={handleAddItem} 
                    className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 transition"
                >
                    Add
                </button>
            </div>
            <ul className="space-y-1">
                {list.map((item, index) => (
                    <li key={index} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                        <span>{item}</span>
                        <button 
                            onClick={() => onRemove(index)} 
                            className="text-red-500 hover:text-red-700 text-xs"
                        >
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        </fieldset>
    );
};

export default AddLoan;