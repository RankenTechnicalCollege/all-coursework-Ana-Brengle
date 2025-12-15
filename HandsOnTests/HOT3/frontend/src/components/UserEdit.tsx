import { useEffect ,useState} from "react";
import api from "@/lib/api";
import { toast } from 'react-toastify';
import {accountSchema} from "@/schemas/productSchema"
import { ZodError} from "zod";
import { useNavigate } from "react-router-dom";


interface AccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Account({ isOpen, onClose }: AccountDialogProps){
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false);
     const navigate = useNavigate();

    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    
    function showSuccess(message: string) {
      toast(message, { type: 'success', position: 'bottom-right' });
    }

    useEffect(() => {
        if (!isOpen) return;

        const fetchUser = async () => {
          setLoading(true)
            try {
                const response = await api.get('/users/me')
                setName(response.data.name);
                setEmail(response.data.email);
            } catch {
                toast.error("Failed to load account info");
            } finally {
              setLoading(false)
            }
        }
        fetchUser()
    },[isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

     const formData = {
    email: email,
    fullName: name,
    }
    try {
      const validatedData = accountSchema.parse(formData);
      // const validData = JSON.stringify(validatedData)
      await api.patch(`/users/me`, validatedData);
      showSuccess("User updated successfully");
      navigate('/');
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path.length > 0) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setValidationErrors(fieldErrors);
        return;
      }

    
}
}

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Edit Account</h2>
        {loading ? (
          <p>Loading info</p>
        ): (
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input w-full border rounded px-2 py-1"
            />
            {validationErrors.name && (
              <p className="text-red-500 text-sm">{validationErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full border rounded px-2 py-1"
            />
            {validationErrors.email && (
              <p className="text-red-500 text-sm">{validationErrors.email}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save
            </button>
          </div>
        </form>

        )}
        
      </div>
    </div>
  );
}

