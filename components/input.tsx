
export default function Input({ input, setInput, isLoading }: {input: any, setInput: (value: any) => void, isLoading: boolean}) {
  return (
    <input
      type="text"
      value={input}
      disabled={isLoading}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Type your message here..."
      className="flex-1 rounded-l-lg border p-2 focus:outline-none focus:ring-2 focus:ring-primary"
    />
  );
}
