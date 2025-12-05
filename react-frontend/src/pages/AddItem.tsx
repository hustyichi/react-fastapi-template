import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addItem } from "@/services/api";

export default function AddItem() {
  const navigate = useNavigate();
  const [state, setState] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setState({});

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const quantity = formData.get("quantity") as string;

    const result = await addItem(name, description, quantity);
    setState(result);
    setIsLoading(false);

    if (result.success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">
            Create New Item
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Enter the details of the new item below.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6"
        >
          <div className="space-y-6">
            <div className="space-y-3">
              <Label
                htmlFor="name"
                className="text-gray-700 dark:text-gray-300"
              >
                Item Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Item name"
                required
                className="w-full border-gray-300 dark:border-gray-600"
              />
              {state.errors?.name && (
                <p className="text-red-500 text-sm">{state.errors.name}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="description"
                className="text-gray-700 dark:text-gray-300"
              >
                Item Description
              </Label>
              <Input
                id="description"
                name="description"
                type="text"
                placeholder="Description of the item"
                required
                className="w-full border-gray-300 dark:border-gray-600"
              />
              {state.errors?.description && (
                <p className="text-red-500 text-sm">
                  {state.errors.description}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="quantity"
                className="text-gray-700 dark:text-gray-300"
              >
                Quantity
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                placeholder="Quantity"
                required
                className="w-full border-gray-300 dark:border-gray-600"
              />
              {state.errors?.quantity && (
                <p className="text-red-500 text-sm">{state.errors.quantity}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Item"}
          </button>

          {state?.message && (
            <div className="mt-2 text-center text-sm text-red-500">
              <p>{state.message}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

